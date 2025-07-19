// دالة الإحصائيات للوحة التحكم
const jwt = require("jsonwebtoken");

const JWT_SECRET = "teratrav_jwt_secret_2024_umrah_admin";

// Helper function to verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("رمز المصادقة مطلوب");
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("رمز المصادقة غير صحيح");
  }
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      try {
        verifyToken(event.headers.authorization);
      } catch (error) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            success: false,
            message: error.message,
          }),
        };
      }

      // إحصائيات تجريبية
      const stats = {
        total_packages: 5,
        active_packages: 5,
        total_bookings: 12,
        pending_bookings: 3,
        completed_bookings: 9,
        total_inquiries: 8,
        new_inquiries: 2,
        revenue: 450000,
        monthly_revenue: 180000,
        popular_packages: [
          { name: "المولد النبوي (اغسطس)", bookings: 5 },
          { name: "المولد النبوي (سبتمبر)", bookings: 4 },
        ],
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            stats: stats,
          },
          message: "تم جلب الإحصائيات بنجاح",
        }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: "طريقة غير مسموحة",
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
