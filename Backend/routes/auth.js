const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");


router.post("/register", (req, res) => {
  const { name, email, password, role, dept, sem, section } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const query = `
    INSERT INTO users (name, email, password_hash, role, dept_id, sem, section)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, email, password, role.toUpperCase(), dept, sem, section],
    (err, result) => {
      if (err) {
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Email already exists" });
  }
  return res.status(500).json({ message: "DB Error", error: err });
}

    }
  );
});

router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND role = ?";
  db.query(query, [email, role.toUpperCase()], (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];

    if (password !== user.password_hash)
      return res.status(401).json({ message: "Wrong Password" });

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      "SECRET_KEY"
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        dept: user.dept_id,
        sem: user.sem,
        section: user.section,
      },
    });
  });
});

module.exports = router;
