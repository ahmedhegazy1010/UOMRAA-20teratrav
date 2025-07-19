import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Simple in-memory user store (replace with database in production)
const ADMIN_USERS = [
  {
    id: "1",
    username: "admin",
    // Password: teratrav2024 (hashed)
    passwordHash:
      "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // This is a bcrypt hash for "password"
    role: "admin",
  },
];

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "teratrav_admin_secret_2024";

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

// Hash the actual password
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Initialize admin password hash
const initializeAdminPassword = async () => {
  const hashedPassword = await hashPassword("teratrav2024");
  ADMIN_USERS[0].passwordHash = hashedPassword;
};

// Initialize on startup
initializeAdminPassword();

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم وكلمة المرور مطلوبان",
      });
    }

    // Find user
    const user = ADMIN_USERS.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Return success response
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

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };

    // Check if user still exists
    const user = ADMIN_USERS.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

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
  // For JWT, logout is handled client-side by removing the token
  // In production, you might want to maintain a blacklist of revoked tokens
  res.json({
    success: true,
    message: "تم تسجيل الخروج بنجاح",
  });
};

// Middleware to protect routes
export const authenticateToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "مطلوب تسجيل الدخول",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };

    // Attach user to request
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "رمز المصادقة غير صالح",
    });
  }
};
