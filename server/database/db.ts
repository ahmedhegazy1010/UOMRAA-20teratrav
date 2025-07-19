import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import fs from "fs";

let db: Database.Database | null = null;

export function getDB() {
  if (!db) {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, "teratrav.db");
    db = new Database(dbPath);
    db.pragma("foreign_keys = ON");

    // Initialize tables
    initTables();
  }
  return db;
}

function initTables() {
  if (!db) return;

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin',
      is_active BOOLEAN DEFAULT 1,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Packages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration TEXT NOT NULL,
      mecca_stay TEXT NOT NULL,
      medina_stay TEXT NOT NULL,
      itinerary TEXT NOT NULL,
            price_double INTEGER NOT NULL,
      price_triple INTEGER NOT NULL,
      price_quad INTEGER NOT NULL,
      price_infant INTEGER,
      price_child INTEGER,
      status TEXT DEFAULT 'active',
      popular BOOLEAN DEFAULT 0,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      package_id INTEGER NOT NULL,
      room_type TEXT NOT NULL,
      travelers_count INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      travel_date DATE,
      special_requests TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (package_id) REFERENCES packages (id)
    )
  `);

  // Inquiries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      admin_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Run migrations
  runMigrations();

  // Insert default data
  insertDefaults();
}

function runMigrations() {
  if (!db) return;

  try {
    // Check if price_infant and price_child columns exist
    const tableInfo = db.prepare("PRAGMA table_info(packages)").all() as any[];
    const columnNames = tableInfo.map((col: any) => col.name);

    if (!columnNames.includes("price_infant")) {
      console.log("Adding price_infant column to packages table...");
      db.exec("ALTER TABLE packages ADD COLUMN price_infant INTEGER");
    }

    if (!columnNames.includes("price_child")) {
      console.log("Adding price_child column to packages table...");
      db.exec("ALTER TABLE packages ADD COLUMN price_child INTEGER");
    }

    console.log("✅ Database migrations completed");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
}

async function insertDefaults() {
  if (!db) return;

  try {
    // Check if admin exists
    const existingUser = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get("admin");

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("teratrav2024", 10);
      db.prepare(
        `
        INSERT INTO users (username, password_hash, email, role)
        VALUES (?, ?, ?, ?)
      `,
      ).run("admin", hashedPassword, "admin@teratrav.com", "admin");
      console.log("✅ Admin user created");
    }

    // Check if hegazy user exists
    const existingHegazy = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get("hegazy");

    if (!existingHegazy) {
      const hegazyPassword = await bcrypt.hash("hegazy01550", 10);
      db.prepare(
        `
        INSERT INTO users (username, password_hash, email, role)
        VALUES (?, ?, ?, ?)
      `,
      ).run("hegazy", hegazyPassword, "hegazy@teratrav.com", "admin");
      console.log("✅ Hegazy user created");
    }

    // Sample packages
    const packageCount = db
      .prepare("SELECT COUNT(*) as count FROM packages")
      .get() as { count: number };
    if (packageCount.count === 0) {
      const packages = [
        [
          "باقة 8 أيام",
          "8 أيام",
          "4 ليالي - فندق 4 نجوم",
          "3 ليالي - فندق 4 نجوم",
          "مكة - المدينة - مكة",
          25000,
          23000,
          21000,
          8000,
          15000,
          "active",
          0,
        ],
        [
          "باقة 10 أيام",
          "10 أيام",
          "5 ليالي - فندق 5 نجوم",
          "4 ليالي - فندق 5 نجوم",
          "مكة - المدينة - مكة",
          35000,
          32000,
          29000,
          10000,
          20000,
          "active",
          1,
        ],
        [
          "باقة 14 يوم",
          "14 يوم",
          "7 ليالي - فندق فاخر",
          "6 ليالي - فندق فاخر",
          "مكة - المدينة - مكة",
          45000,
          42000,
          38000,
          12000,
          25000,
          "active",
          0,
        ],
      ];

      const insertPackage = db.prepare(`
        INSERT INTO packages (name, duration, mecca_stay, medina_stay, itinerary, price_double, price_triple, price_quad, price_infant, price_child, status, popular)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const pkg of packages) {
        insertPackage.run(...pkg);
      }
      console.log("✅ Sample packages created");
    }
  } catch (error) {
    console.error("Error inserting defaults:", error);
  }
}

export function initializeDatabase() {
  console.log("🗄️ Initializing TeraTrav database...");
  getDB();
  console.log("✅ Database ready");
}
