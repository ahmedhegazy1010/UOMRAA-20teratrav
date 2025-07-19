import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

// نحصل على connection string من متغيرات البيئة
const sql = neon(
  process.env.DATABASE_URL || "postgresql://localhost:5432/teratrav",
);

export async function initializeNeonDatabase() {
  console.log("🗄️ Initializing TeraTrav Neon database with real data...");

  try {
    // إنشاء الجداول
    await createTables();
    console.log("✅ Database tables created");

    // إدراج البيانات الحقيقية
    await insertRealData();
    console.log("✅ Real data inserted");

    console.log("🗄️ Neon database initialized successfully with real data");
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

async function insertRealData() {
  try {
    // حذف البيانات التجريبية القديمة
    await sql`DELETE FROM users WHERE username IN ('admin', 'hegazy')`;
    await sql`DELETE FROM packages WHERE name LIKE 'باقة%' OR name LIKE '%أيام'`;

    // حذف المستخدمين القدامى وإعادة إنشائهم
    await sql`DELETE FROM users WHERE username IN ('teratrav_admin', 'ahmed_hegazy')`;

    // إنشاء المستخدمين بكلمات مرور واضحة (غير مشفرة)
    await sql`
      INSERT INTO users (username, password_hash, email, role)
      VALUES
        ('teratrav_admin', 'TeraTrav@2024#Admin', 'admin@teratrav.sa', 'admin'),
        ('ahmed_hegazy', 'Ahmed@TeraTrav2024', 'ahmed@teratrav.sa', 'admin')
    `;
    console.log("✅ Users created with clear passwords:");
    console.log("✅ Admin: teratrav_admin / TeraTrav@2024#Admin");
    console.log("✅ Ahmed: ahmed_hegazy / Ahmed@TeraTrav2024");

    // التحقق من وجود باقات العمرة الحقيقية
    const packageCount =
      await sql`SELECT COUNT(*) as count FROM packages WHERE name LIKE 'المولد النبوي%' OR name LIKE 'عشر ذي الحجة%'`;

    if (packageCount[0].count === 0) {
      // إدراج باقات العمرة الحقيقية
      await sql`
        INSERT INTO packages (name, duration, mecca_stay, medina_stay, itinerary, price_double, price_triple, price_quad, price_infant, price_child, status, popular, description)
        VALUES 
          ('المولد النبوي (اغسطس)', '7 أيام / 6 ليالي', '4 ليالي - فندق هيلتون الحرم', '2 ليالي - فندق دار الهجرة', 'الرياض - جدة - مكة - المدينة - جدة - الرياض', 4500, 3800, 3200, 1500, 2800, 'active', true, 'باقة المولد النبوي الشريف تشمل زيارة الحرمين الشريفين مع إقامة فاخرة وخدمات متميزة'),
          ('المولد النبوي (سبتمبر)', '10 أيام / 9 ليالي', '6 ليالي - فندق فيرمونت مكة', '3 ليالي - فندق المدينة موفنبيك', 'الرياض - جدة - مكة - المدينة - جدة - الرياض', 6800, 5900, 5200, 2200, 4100, 'active', true, 'باقة شاملة للمولد النبوي مع إقامة ممتدة وبرنامج زيارات شامل'),
          ('عشر ذي الحجة (ديسمبر)', '8 أيام / 7 ليالي', '5 ليالي - برج الساعة فيرمونت', '2 ليالي - فندق الأنصار الذهبي', 'الرياض - جدة - مكة - المدينة - جدة - الرياض', 5200, 4500, 3900, 1800, 3400, 'active', false, 'باقة العشر الأوائل من ذي الحجة مع إقامة قريبة من الحرم المكي'),
          ('رجب المبارك (فبراير)', '5 أيام / 4 ليالي', '3 ليالي - فندق دار التوحيد', '1 ليلة - فندق الطيبة سيتي', 'الرياض - المدينة - مكة - جدة - الرياض', 3200, 2800, 2400, 1200, 2000, 'active', false, 'باقة قصيرة لشهر رجب المبارك مناسبة للرحلات السريعة'),
          ('شعبان المبارك (مارس)', '6 أيام / 5 ليالي', '3 ليالي - فندق سويس أوتيل', '2 ليالي - فندق شذا المدينة', 'الرياض - جدة - مكة - المدينة - جدة - الرياض', 3800, 3300, 2900, 1400, 2500, 'active', false, 'باقة شهر شعبان مع ��دمات متميزة وإقامة مريحة')
      `;
      console.log("✅ Real Umrah packages created");
    }
  } catch (error) {
    console.error("Error inserting real data:", error);
  }
}

// تصدير دالة SQL للاستخدام في الطرق الأخرى
export { sql };
