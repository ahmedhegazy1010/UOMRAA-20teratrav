// وظيفة المصادقة للوحة التحكم
const jwt = require("jsonwebtoken");

// المستخدمون المسموح لهم بالدخول (بكلمات مرور واضحة)
const users = [
  {
    id: 1,
    username: "teratrav_admin",
    password: "TeraTrav@2024#Admin",
    email: "admin@teratrav.sa",
    role: "admin",
  },
  {
    id: 2,
    username: "ahmed_hegazy",
    password: "Ahmed@TeraTrav2024",
    email: "ahmed@teratrav.sa",
    role: "admin",
  },
];

const JWT_SECRET = "teratrav_jwt_secret_2024_umrah_admin";

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { path } = event;
    const method = event.httpMethod;

    // Login endpoint
    if (path.includes("/auth/login") && method === "POST") {
      const { username, password } = JSON.parse(event.body);

      const user = users.find((u) => u.username === username);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: "اسم المستخدم أو كلمة المرور غير صحيحة",
          }),
        };
      }

      // التحقق من كلمة المرور مباشرة (بدون تشفير)
      if (user.password !== password) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: "اسم المستخدم أو كلمة المرور غير صحيحة",
          }),
        };
      }

      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

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
    }

    // Verify token endpoint
    if (path.includes("/auth/verify") && method === "GET") {
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
        const user = users.find((u) => u.id === decoded.userId);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
            },
          }),
        };
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: "رمز المصادقة غير صحيح",
          }),
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        success: false,
        message: "المسار غير موجود",
      }),
    };
  } catch (error) {
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
