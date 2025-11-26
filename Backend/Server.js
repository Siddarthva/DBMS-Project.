require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json()); // JSON payload

// Multer for in-memory PDF
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files allowed"));
    } else {
      cb(null, true);
    }
  }
});

// MySQL Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10
});

// Middleware: Auth
function auth(roles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ message: "Forbidden" });
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}

// =====================
// AUTH
// =====================
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, dept_id, sem, section, mentor_id, hod_id } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password_hash, role, dept_id, sem, section, mentor_id, hod_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name, email, password_hash, role, dept_id || null, sem || null,
      section || null, mentor_id || null, hod_id || null
    ]);

    res.status(201).json({ message: "Registered", user_id: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid creds" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid creds" });

    delete user.password_hash;

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// =====================
// EVENTS (Mentor/HOD)
// =====================
app.post("/events", auth(["MENTOR", "HOD"]), async (req, res) => {
  try {
    const { name, category, level, start_date, end_date, organizer, description } = req.body;

    const pointsMap = { COLLEGE: 20, STATE: 40, NATIONAL: 60, INTERNATIONAL: 100 };
    const points = pointsMap[level];

    const sql = `
      INSERT INTO events (name, category, level, points, start_date, end_date, organizer, description, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(sql, [
      name, category, level, points,
      start_date, end_date || null,
      organizer || null, description || null,
      req.user.user_id
    ]);

    res.json({ message: "Event created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Event create error" });
  }
});

app.get("/events", auth(), async (req, res) => {
  const [rows] = await db.query("SELECT * FROM events ORDER BY start_date DESC");
  res.json(rows);
});

// =====================
// PARTICIPATION (Student)
// =====================
app.post("/participations", auth(["STUDENT"]), async (req, res) => {
  try {
    const { event_id, role, position, team_name } = req.body;

    const sql = `
      INSERT INTO participations (student_id, event_id, role, position, team_name)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      req.user.user_id, event_id, role || "PARTICIPANT", position || null, team_name || null
    ]);

    res.json({ message: "Participation added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Participation error" });
  }
});

// =====================
// CERTIFICATE UPLOAD
// =====================
app.post("/certificates/upload/:pid",
  auth(["STUDENT"]),
  upload.single("file"),
  async (req, res) => {
    try {
      const pid = req.params.pid;

      const fileData = req.file.buffer;
      const filename = req.file.originalname;
      const mime = req.file.mimetype;

      const sql = `
        INSERT INTO certificates (participation_id, file_data, original_filename, mime_type)
        VALUES (?, ?, ?, ?)
      `;

      await db.query(sql, [pid, fileData, filename, mime]);

      res.json({ message: "Certificate uploaded, pending mentor approval" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload error" });
    }
  });

// =====================
// CERTIFICATE VIEW
// =====================
app.get("/certificates/view/:cid", auth(), async (req, res) => {
  const cid = req.params.cid;

  const [rows] = await db.query(
    "SELECT file_data, mime_type FROM certificates WHERE certificate_id = ?",
    [cid]
  );

  if (!rows.length) return res.status(404).json({ message: "Not found" });

  res.setHeader("Content-Type", rows[0].mime_type);
  res.send(rows[0].file_data);
});

// =====================
// MENTOR APPROVAL
// =====================
app.patch("/certificates/mentor/:cid", auth(["MENTOR"]), async (req, res) => {
  const { cid } = req.params;
  const { action, remarks } = req.body;

  const status = action === "APPROVE" ? "PENDING_HOD" : "REJECTED";

  await db.query(
    "UPDATE certificates SET status=?, mentor_id=?, mentor_remarks=?, mentor_action_at=NOW() WHERE certificate_id=?",
    [status, req.user.user_id, remarks || null, cid]
  );

  res.json({ message: `Mentor ${action}` });
});

// =====================
// HOD FINAL APPROVAL
// =====================
app.patch("/certificates/hod/:cid", auth(["HOD"]), async (req, res) => {
  const { cid } = req.params;
  const { action, remarks } = req.body;

  const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

  await db.query(
    "UPDATE certificates SET status=?, hod_id=?, hod_remarks=?, hod_action_at=NOW() WHERE certificate_id=?",
    [status, req.user.user_id, remarks || null, cid]
  );

  res.json({ message: `HOD ${action}` });
});

// =====================
// LEADERBOARD
// =====================
app.get("/leaderboard", auth(), async (req, res) => {
  const [rows] = await db.query("SELECT * FROM leaderboard ORDER BY total_points DESC");
  res.json(rows);
});

// =====================
// SERVER START
// =====================
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
