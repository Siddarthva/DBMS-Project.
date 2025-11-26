require("dotenv").config();
const mysql = require("mysql2/promise");

async function testDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    const [rows] = await connection.query("SELECT DATABASE() AS db");
    console.log("🎉 Connected to DB:", rows[0].db);
    await connection.end();
  } catch (error) {
    console.error("❌ Database connection error:");
    console.error(error.message);
  }
}

testDB();
