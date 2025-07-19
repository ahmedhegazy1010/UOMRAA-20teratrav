require("dotenv").config();

async function testNeonConnection() {
  try {
    // Import the Neon client
    const { neon } = await import("@neondatabase/serverless");

    const sql = neon(process.env.DATABASE_URL);

    console.log("🔄 Testing Neon database connection...");

    // Test basic connection
    const result = await sql`SELECT 1 as test`;
    console.log("✅ Basic connection test:", result);

    // Test creating tables
    console.log("🔄 Creating tables...");

    // Create users table
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

    // Create packages table
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

    // Create bookings table
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

    // Create inquiries table
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

    console.log("✅ All tables created successfully!");

    // Check if admin user exists
    const existingAdmin =
      await sql`SELECT id FROM users WHERE username = 'admin'`;

    if (existingAdmin.length === 0) {
      // We'll need bcrypt for password hashing
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash("teratrav2024", 10);

      await sql`
        INSERT INTO users (username, password_hash, email, role)
        VALUES ('admin', ${hashedPassword}, 'admin@teratrav.com', 'admin')
      `;
      console.log("✅ Admin user created");
    } else {
      console.log("✅ Admin user already exists");
    }

    // Check if hegazy user exists
    const existingHegazy =
      await sql`SELECT id FROM users WHERE username = 'hegazy'`;

    if (existingHegazy.length === 0) {
      const bcrypt = await import("bcryptjs");
      const hegazyPassword = await bcrypt.hash("hegazy01550", 10);

      await sql`
        INSERT INTO users (username, password_hash, email, role)
        VALUES ('hegazy', ${hegazyPassword}, 'hegazy@teratrav.com', 'admin')
      `;
      console.log("✅ Hegazy user created");
    } else {
      console.log("✅ Hegazy user already exists");
    }

    // Check packages
    const packageCount = await sql`SELECT COUNT(*) as count FROM packages`;
    console.log(`📦 Current packages count: ${packageCount[0].count}`);

    if (packageCount[0].count === 0) {
      await sql`
        INSERT INTO packages (name, duration, mecca_stay, medina_stay, itinerary, price_double, price_triple, price_quad, price_infant, price_child, status, popular)
        VALUES 
          ('المولد النبوي (اغسطس)', '8 أيام', '4 ليالي - فندق 4 نجوم', '3 ليالي - فندق 4 نجوم', 'مكة - المدينة - مكة', 25000, 23000, 21000, 8000, 15000, 'active', false),
          ('المولد النبوي (سبتمبر)', '10 أيام', '5 ليالي - فندق 5 نجوم', '4 ليالي - فندق 5 نجوم', 'مكة - المدينة - مكة', 35000, 32000, 29000, 10000, 20000, 'active', true),
          ('عشر ذي الحجة (ديسمبر)', '14 يوم', '7 ليالي - فندق فاخر', '6 ليالي - فندق فاخر', 'مكة - المدينة - مكة', 45000, 42000, 38000, 12000, 25000, 'active', false)
      `;
      console.log("✅ Sample packages created");
    }

    console.log("🎉 Neon database setup completed successfully!");
    console.log("");
    console.log("🔑 Login credentials:");
    console.log("   Username: admin | Password: teratrav2024");
    console.log("   Username: hegazy | Password: hegazy01550");
  } catch (error) {
    console.error("❌ Neon connection failed:", error);
  }
}

testNeonConnection();
