// Quick script to create user
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const path = require("path");

async function createUserManually() {
  try {
    const dbPath = path.join(process.cwd(), "data", "teratrav.db");
    const db = new Database(dbPath);

    // Hash the password
    const hashedPassword = await bcrypt.hash("hegazy01550", 10);

    // Delete existing user if exists
    db.prepare("DELETE FROM users WHERE username = ?").run("hegazy");

    // Insert new user
    const result = db
      .prepare(
        `
      INSERT INTO users (username, password_hash, role, is_active)
      VALUES (?, ?, ?, 1)
    `,
      )
      .run("hegazy", hashedPassword, "admin");

    console.log("✅ User created successfully!");
    console.log("Username: hegazy");
    console.log("Password: hegazy01550");
    console.log("User ID:", result.lastInsertRowid);

    db.close();
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }
}

createUserManually();
