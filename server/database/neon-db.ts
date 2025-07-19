import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// نحصل على connection string من متغيرات البيئة
const sql = neon(
  process.env.DATABASE_URL || "postgresql://localhost:5432/teratrav",
);

export async function initializeNeonDatabase() {
  console.log("🗄️ Initializing TeraTrav Neon database...");

  try {
    // إنشاء الجداول
    await createTables();
    console.log("✅ Database tables created");

    // إدراج البيانات الافتراضية
    await insertDefaults();
    console.log("✅ Default data inserted");

    console.log("🗄️ Neon database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

async function createTables() {
  // جدول المستخدمين
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin',
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // جدول الباقات
  await sql`
    CREATE TABLE IF NOT EXISTS packages (
      id SERIAL PRIMARY KEY,
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
      popular BOOLEAN DEFAULT false,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // جدول الحجوزات
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (package_id) REFERENCES packages (id)
    )
  `;

  // جدول الاستفسارات
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      admin_response TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

async function insertDefaults() {
  try {
    // التحقق من وجود مستخدم admin
    const existingAdmin =
      await sql`SELECT id FROM users WHERE username = 'admin'`;

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash("teratrav2024", 10);
      await sql`
        INSERT INTO users (username, password_hash, email, role)
        VALUES ('admin', ${hashedPassword}, 'admin@teratrav.com', 'admin')
      `;
      console.log("✅ Admin user created");
    }

    // التحقق من وجود مستخدم hegazy
    const existingHegazy =
      await sql`SELECT id FROM users WHERE username = 'hegazy'`;

    if (existingHegazy.length === 0) {
      const hegazyPassword = await bcrypt.hash("hegazy01550", 10);
      await sql`
        INSERT INTO users (username, password_hash, email, role)
        VALUES ('hegazy', ${hegazyPassword}, 'hegazy@teratrav.com', 'admin')
      `;
      console.log("✅ Hegazy user created");
    }

    // التحقق من وجود باقات تجريبية
    const packageCount = await sql`SELECT COUNT(*) as count FROM packages`;

    if (packageCount[0].count === 0) {
      // إدراج باقات تجريبية
      await sql`
        INSERT INTO packages (name, duration, mecca_stay, medina_stay, itinerary, price_double, price_triple, price_quad, price_infant, price_child, status, popular)
        VALUES 
          ('باقة 8 أيام', '8 أيام', '4 ليالي - فندق 4 نجوم', '3 ليالي - فندق 4 نجوم', 'مكة - المدينة - مكة', 25000, 23000, 21000, 8000, 15000, 'active', false),
          ('باقة 10 أيام', '10 أيام', '5 ليالي - فندق 5 نجوم', '4 ليالي - فندق 5 نجوم', '��كة - المدينة - مكة', 35000, 32000, 29000, 10000, 20000, 'active', true),
          ('باقة 14 يوم', '14 يوم', '7 ليالي - فندق فاخر', '6 ليالي - فندق فاخر', 'مكة - المدينة - مكة', 45000, 42000, 38000, 12000, 25000, 'active', false)
      `;
      console.log("✅ Sample packages created");
    }
  } catch (error) {
    console.error("Error inserting defaults:", error);
  }
}

// تصدير دالة SQL للاستخدام في الطرق الأخرى
export { sql };
