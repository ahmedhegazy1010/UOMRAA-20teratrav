// وظيفة تسجيل دخول مبسطة
const jwt = require("jsonwebtoken");

const JWT_SECRET = "teratrav_jwt_secret_2024_umrah_admin";

// المستخدمون مع كلمات مرور واضحة
const users = {
  teratrav_admin: {
    id: 1,
    username: "teratrav_admin",
    password: "TeraTrav@2024#Admin",
    email: "admin@teratrav.sa",
    role: "admin",
  },
  ahmed_hegazy: {
    id: 2,
    username: "ahmed_hegazy",
    password: "Ahmed@TeraTrav2024",
    email: "ahmed@teratrav.sa",
    role: "admin",
  },
};

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Method not allowed",
      }),
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    console.log("Login attempt:", { username, password: "***" });

    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: "اسم المستخدم وكلمة المرور مطلوبان",
        }),
      };
    }

    const user = users[username];

    if (!user) {
      console.log("User not found:", username);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: "اسم المستخدم أو كلمة المرور غير صحيحة",
        }),
      };
    }

    if (user.password !== password) {
      console.log("Password mismatch for:", username);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: "اسم المستخدم أو كلمة المرور غير صحيحة",
        }),
      };
    }

    // إنشاء JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    console.log("Login successful for:", username);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      }),
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "خطأ في الخادم",
        error: error.message,
      }),
    };
  }
};
