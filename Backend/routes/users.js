// routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
// GET all users (only id, name, role)
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT user_id, name, role FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("🔥 SQL ERROR:", err);
    res.status(500).json({ message: "DB error", error: err.message });
  }
});


router.post("/add", async (req, res) => {
  try {
    const { name, email, password, role, dept_id, sem, section } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password_hash, role, dept_id, sem, section)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name, email, password_hash, role,
      dept_id || null, sem || null, section || null
    ]);

    res.json({ message: "User added", user_id: result.insertId });
  } catch (err) {
    console.error("🔥 Signup SQL Error:", err);
    res.status(500).json({ message: err.sqlMessage });
  }
});

module.exports = router;
