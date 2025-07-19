// وظيفة التحقق من صحة التوكن
const jwt = require("jsonwebtoken");

const JWT_SECRET = "teratrav_jwt_secret_2024_umrah_admin";

// المستخدمون للمرجع
const users = {
  1: {
    id: 1,
    username: "teratrav_admin",
    email: "admin@teratrav.sa",
    role: "admin",
  },
  2: {
    id: 2,
    username: "ahmed_hegazy",
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

  if (event.httpMethod !== "GET") {
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
    const authHeader = event.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: "رمز المصادقة مطلوب",
        }),
      };
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users[decoded.userId];

      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: "المستخدم غير موجود",
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          user: user,
        }),
      };
    } catch (jwtError) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: "رمز المصادقة غير صحيح",
        }),
      };
    }
  } catch (error) {
    console.error("Verify error:", error);
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
