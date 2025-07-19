import express, { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sql } from "../database/neon-db";

// JWT Secret (في الإنتاج، استخدم متغير بيئة)
const JWT_SECRET = process.env.JWT_SECRET || "teratrav_admin_secret_2024";

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم وكلمة المرور مطلوبان",
      });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const users = await sql`
      SELECT * FROM users 
      WHERE username = ${username} AND is_active = true
    `;

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    const user = users[0];

    // التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    // تحديث تاريخ آخر تسجيل دخول
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `;

    // إنشاء JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    // إرسال استجابة النجاح
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      message: "تم تسجيل الدخول بنجاح",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في الخادم الداخلي",
    });
  }
};

export const handleVerify: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "لا يوجد رمز مصادقة",
      });
    }

    // التحقق من JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };

    // التحقق من أن المستخدم ما زال موجوداً في قاعدة البيانات
    const users = await sql`
      SELECT * FROM users 
      WHERE username = ${decoded.username} AND is_active = true
    `;

    if (users.length === 0 || users[0].id.toString() !== decoded.id) {
      return res.status(401).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    const user = users[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "رمز المصادقة غير صالح",
    });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  // بالنسبة لـ JWT، تسجيل الخروج يتم معالجته من جانب العميل بإزالة الرمز
  // في الإنتاج، قد ترغب في الاحتفاظ بقائمة سوداء للرموز المبطلة
  res.json({
    success: true,
    message: "تم تسجيل الخروج بنجاح",
  });
};

// endpoint إنشاء مستخدم يدوي (للتطوير/الإعداد)
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { username, password, role = "admin" } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم وكلمة المرور مطلوبان",
      });
    }

    // التحقق من أن المستخدم غير موجود بالفعل
    const existingUsers = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم موجود بالفعل",
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إدراج المستخدم
    const result = await sql`
      INSERT INTO users (username, password_hash, role, is_active)
      VALUES (${username}, ${hashedPassword}, ${role}, true)
      RETURNING id
    `;

    res.status(201).json({
      success: true,
      message: "تم إنشاء المستخدم بنجاح",
      userId: result[0].id,
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في إنشاء المستخدم",
    });
  }
};

// endpoint إعادة تعيين كلمة المرور
export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم وكلمة المرور الجديدة مطلوبان",
      });
    }

    // التحقق من أن المستخدم موجود
    const users = await sql`
      SELECT id FROM users WHERE username = ${username}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // تحديث كلمة المرور
    await sql`
      UPDATE users
      SET password_hash = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE username = ${username}
    `;

    res.json({
      success: true,
      message: "تم تحديث كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في تحديث كلمة المرور",
    });
  }
};

// Middleware لحماية الطرق
export const authenticateToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "م��لوب تسجيل الدخول",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };

    // إرفاق المستخدم بالطلب
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({
      success: false,
      message: "رمز المصادقة غير صالح",
    });
  }
};
