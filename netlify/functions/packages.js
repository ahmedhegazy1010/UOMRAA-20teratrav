// دالة عامة لعرض الباقات (بد��ن مصادقة)
const storage = require("./persistent-storage");

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const method = event.httpMethod;

    // GET all active packages (public, no auth required)
    if (method === "GET") {
      // الحصول على الباقات النشطة
      const activePackages = storage.getActivePackages();

      console.log("Active packages found:", activePackages.length);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: activePackages,
          message: "تم جلب الباقات بنجاح",
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
    console.error("Error in packages.js:", error);
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
