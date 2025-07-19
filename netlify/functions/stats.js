// وظيفة الإحصائيات للوحة التحكم
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
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // التحقق من المصادقة
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

    // إحصائيات وهمية (في التطبيق الحقيقي، ستأتي من قاعدة البيانات)
    const stats = {
      totalPackages: 5,
      activePackages: 5,
      totalBookings: 12,
      pendingBookings: 3,
      totalInquiries: 8,
      newInquiries: 2,
      totalRevenue: 85000,
      monthlyRevenue: 25000,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: stats,
        message: "تم جلب الإحصائيات بنجاح",
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
