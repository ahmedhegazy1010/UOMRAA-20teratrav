import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

// Create database instance
const dbPath = path.join(process.cwd(), "data", "teratrav.db");
let db: Database.Database;

export function getDatabase() {
  if (!db) {
    const fs = require("fs");
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma("foreign_keys = ON");
  }
  return db;
}

// Enable foreign keys
db.pragma("foreign_keys = ON");

export interface Package {
  id: number;
  name: string;
  duration: string;
  mecca_stay: string;
  medina_stay: string;
  itinerary: string;
  price_double: number;
  price_triple: number;
  price_quad: number;
  status: "active" | "inactive";
  popular: boolean;
  description?: string;
  included_services?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  phone: string;
  email: string;
  package_id: number;
  room_type: "double" | "triple" | "quad";
  travelers_count: number;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  travel_date?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: number;
  customer_name: string;
  phone: string;
  email?: string;
  message: string;
  status: "new" | "replied" | "closed";
  admin_response?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  role: "admin" | "manager";
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

// Initialize database tables
export function initializeDatabase() {
  console.log("🔧 Initializing TeraTrav database...");

  // Create data directory if it doesn't exist
  const fs = require("fs");
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
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
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      popular BOOLEAN DEFAULT 0,
      description TEXT,
      included_services TEXT,
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
      room_type TEXT NOT NULL CHECK (room_type IN ('double', 'triple', 'quad')),
      travelers_count INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
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
      status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
      admin_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database tables created successfully");

  // Insert default admin user if doesn't exist
  insertDefaultData();
}

// Insert default data
async function insertDefaultData() {
  try {
    // Check if admin user exists
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

      console.log("✅ Default admin user created");
    }

    // Check if sample packages exist
    const existingPackages = db
      .prepare("SELECT COUNT(*) as count FROM packages")
      .get() as { count: number };

    if (existingPackages.count === 0) {
      // Insert sample packages
      const insertPackage = db.prepare(`
        INSERT INTO packages (
          name, duration, mecca_stay, medina_stay, itinerary,
          price_double, price_triple, price_quad, popular, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const samplePackages = [
        [
          "باقة 8 أيام",
          "8 أيام",
          "4 ليالي - فندق 4 نجوم",
          "3 ليالي - فندق 4 نجوم",
          "مكة - المدينة - مكة",
          25000,
          23000,
          21000,
          0,
          "باقة اقتصادية مناسبة للميزانيات المحدودة مع خدمات ممتازة",
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
          1,
          "الباقة الأكثر طلباً - توازن مثالي بين الراحة والسعر",
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
          0,
          "باقة فاخرة للباحثين عن تجربة استثنائية ومريحة",
        ],
      ];

      for (const pkg of samplePackages) {
        insertPackage.run(...pkg);
      }

      console.log("✅ Sample packages inserted");
    }

    // Insert sample bookings if none exist
    const existingBookings = db
      .prepare("SELECT COUNT(*) as count FROM bookings")
      .get() as { count: number };

    if (existingBookings.count === 0) {
      const insertBooking = db.prepare(`
        INSERT INTO bookings (
          customer_name, phone, email, package_id, room_type, 
          travelers_count, total_price, status, travel_date, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const sampleBookings = [
        [
          "أحمد محمد علي",
          "01234567890",
          "ahmed@example.com",
          2,
          "double",
          2,
          70000,
          "pending",
          "2024-03-15",
          "يفضل فندق قريب من الحرم",
        ],
        [
          "فاطمة السيد",
          "01987654321",
          "fatima@example.com",
          1,
          "quad",
          4,
          84000,
          "confirmed",
          "2024-02-20",
          null,
        ],
        [
          "محمود حسن",
          "01555666777",
          "mahmoud@example.com",
          3,
          "triple",
          3,
          126000,
          "completed",
          "2024-01-10",
          "عميل مكرر - خدمة ممتازة",
        ],
      ];

      for (const booking of sampleBookings) {
        insertBooking.run(...booking);
      }

      console.log("✅ Sample bookings inserted");
    }

    // Insert sample inquiries if none exist
    const existingInquiries = db
      .prepare("SELECT COUNT(*) as count FROM inquiries")
      .get() as { count: number };

    if (existingInquiries.count === 0) {
      const insertInquiry = db.prepare(`
        INSERT INTO inquiries (customer_name, phone, email, message, status)
        VALUES (?, ?, ?, ?, ?)
      `);

      const sampleInquiries = [
        [
          "سارة أحمد",
          "01111222333",
          "sara@example.com",
          "أريد الاستفسار عن باقة العمرة لشهر رمضان المبارك، وما هي الخدمات المتاحة؟",
          "new",
        ],
        [
          "عبدالله محمد",
          "01444555666",
          "abdullah@example.com",
          "هل يمكن تخصيص باقة خاصة لمجموعة من 20 شخص؟ نحتاج عرض سعر مخصص",
          "replied",
        ],
      ];

      for (const inquiry of sampleInquiries) {
        insertInquiry.run(...inquiry);
      }

      console.log("✅ Sample inquiries inserted");
    }
  } catch (error) {
    console.error("❌ Error inserting default data:", error);
  }
}

// Database query helpers
export const queries = {
  // Users
  getUserByUsername: db.prepare(
    "SELECT * FROM users WHERE username = ? AND is_active = 1",
  ),
  updateUserLastLogin: db.prepare(
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
  ),

  // Packages
  getAllPackages: db.prepare(
    "SELECT * FROM packages ORDER BY popular DESC, created_at DESC",
  ),
  getActivePackages: db.prepare(
    'SELECT * FROM packages WHERE status = "active" ORDER BY popular DESC, created_at DESC',
  ),
  getPackageById: db.prepare("SELECT * FROM packages WHERE id = ?"),
  insertPackage: db.prepare(`
    INSERT INTO packages (
      name, duration, mecca_stay, medina_stay, itinerary,
      price_double, price_triple, price_quad, popular, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updatePackage: db.prepare(`
    UPDATE packages SET
      name = ?, duration = ?, mecca_stay = ?, medina_stay = ?, itinerary = ?,
      price_double = ?, price_triple = ?, price_quad = ?, popular = ?, description = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  deletePackage: db.prepare("DELETE FROM packages WHERE id = ?"),

  // Bookings
  getAllBookings: db.prepare(`
    SELECT b.*, p.name as package_name 
    FROM bookings b 
    LEFT JOIN packages p ON b.package_id = p.id 
    ORDER BY b.created_at DESC
  `),
  getBookingById: db.prepare(`
    SELECT b.*, p.name as package_name 
    FROM bookings b 
    LEFT JOIN packages p ON b.package_id = p.id 
    WHERE b.id = ?
  `),
  insertBooking: db.prepare(`
    INSERT INTO bookings (
      customer_name, phone, email, package_id, room_type,
      travelers_count, total_price, travel_date, special_requests
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateBookingStatus: db.prepare(
    "UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  ),

  // Inquiries
  getAllInquiries: db.prepare(
    "SELECT * FROM inquiries ORDER BY created_at DESC",
  ),
  getInquiryById: db.prepare("SELECT * FROM inquiries WHERE id = ?"),
  insertInquiry: db.prepare(`
    INSERT INTO inquiries (customer_name, phone, email, message)
    VALUES (?, ?, ?, ?)
  `),
  updateInquiryStatus: db.prepare(
    "UPDATE inquiries SET status = ?, admin_response = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  ),

  // Statistics
  getStats: db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM bookings) as total_bookings,
      (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
      (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
      (SELECT COUNT(*) FROM inquiries WHERE status = 'new') as new_inquiries,
      (SELECT SUM(total_price) FROM bookings WHERE status IN ('confirmed', 'completed')) as total_revenue,
      (SELECT COUNT(*) FROM packages WHERE status = 'active') as active_packages
  `),
};

// Graceful shutdown
process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));
