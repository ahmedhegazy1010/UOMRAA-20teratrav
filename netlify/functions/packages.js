// دالة عامة لعرض الباقات (بدون مصادقة)
const { getActivePackages } = require("./shared-packages");

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
      const activePackages = getActivePackages();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: activePackages,
          message: "تم جلب الباقا�� بنجاح",
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
