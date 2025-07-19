// دالة عامة لعرض الباقات (بدون مصادقة)
// ملاحظة: هذا الملف يقرأ البيانات من نفس المصدر المشترك مع packages-admin.js

// متغير عام لتخزين الباقات
let packages = [];

// دالة للحصول على البيانات من global إذا كانت متاحة
function syncWithAdminData() {
  if (typeof global !== "undefined" && global.sharedPackages) {
    packages = global.sharedPackages;
  }
}

// دالة لحفظ البيانات في global للمشاركة
function saveToGlobal() {
  if (typeof global !== "undefined") {
    global.sharedPackages = packages;
  }
}

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
      // مزامنة البيانات مع packages-admin
      syncWithAdminData();

      console.log("Current packages in packages.js:", packages);

      // فلترة الباقات النشطة فقط
      const activePackages = packages.filter((pkg) => pkg.status === "active");

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
