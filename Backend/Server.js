require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mysql = require("mysql2/promise");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Database 
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10
});

// Check DB connection on startup
(async function () {
  try {
    await db.query("SELECT 1");
    console.log("🎯 Database connected successfully!");
  } catch (err) {
    console.error("❌ DB connection failed", err);
  }
})();

//  Users Router
app.use("/api/users", userRoutes);

// Multer for PDF Upload
const upload = multer({ storage: multer.memoryStorage() });

// -----------------------------
// TEMP — DISABLE AUTH FOR TESTING
// -----------------------------
const auth = () => (req, res, next) => next();

// EVENTS API
app.post("/events", auth(), async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const sql = "INSERT INTO events (name, category, level) VALUES (?,?,?)";
    const [result] = await db.query(sql, [name, category, level]);
    res.json({ message: "Event created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Event error", error: err });
  }
});

// CERTIFICATE UPLOAD
app.post("/certificates/upload/:pid", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const pid = req.params.pid;
    const sql = `
      INSERT INTO certificates (participation_id, file_data, original_filename, mime_type)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [
      pid,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    ]);

    res.json({ message: "File uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Upload error", error: err });
  }
});


// SERVER 
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);

module.exports = db;
