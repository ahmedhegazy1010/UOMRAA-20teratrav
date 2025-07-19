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

      // إحصائيات حقيقية من النظام (فارغة في البداية)
      let packagesCount = 0;
      let activePackagesCount = 0;

      // قراءة إحصائيات الباقات من global
      if (typeof global !== "undefined" && global.sharedPackages) {
        packagesCount = global.sharedPackages.length;
        activePackagesCount = global.sharedPackages.filter(
          (pkg) => pkg.status === "active",
        ).length;
      }

      const stats = {
        total_packages: packagesCount,
        active_packages: activePackagesCount,
        total_bookings: 0,
        pending_bookings: 0,
        completed_bookings: 0,
        total_inquiries: 0,
        new_inquiries: 0,
        revenue: 0,
        monthly_revenue: 0,
        popular_packages: [],
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
