// دالة عامة لعرض الباقات (بدون مصادقة)
// متغير عام لتخزين الباقات (فارغ في البداية)
let packages = [];

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
      // فلترة الباقات النشطة فقط
      const activePackages = packages.filter((pkg) => pkg.status === "active");

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

// دالة لإضافة باقة (يتم استدعاؤها من packages-admin)
function addPackage(newPackage) {
  const newId = Math.max(...packages.map((p) => p.id), 0) + 1;
  const packageWithId = {
    ...newPackage,
    id: newId,
    created_at: new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString().split("T")[0],
  };
  packages.push(packageWithId);
  return packageWithId;
}

// دالة لتحديث باقة
function updatePackage(id, updateData) {
  const index = packages.findIndex((pkg) => pkg.id === parseInt(id));
  if (index === -1) {
    return null;
  }

  packages[index] = {
    ...packages[index],
    ...updateData,
    id: parseInt(id),
    updated_at: new Date().toISOString().split("T")[0],
  };

  return packages[index];
}

// دالة لحذف باقة
function deletePackage(id) {
  const index = packages.findIndex((pkg) => pkg.id === parseInt(id));
  if (index === -1) {
    return null;
  }

  const deletedPackage = packages[index];
  packages.splice(index, 1);
  return deletedPackage;
}

// دالة للحصول على جميع الباقات
function getAllPackages() {
  return packages;
}

// دالة للحصول على باقة بالمعرف
function getPackageById(id) {
  return packages.find((pkg) => pkg.id === parseInt(id));
}

// تصدير الدوال للاستخدام في packages-admin
global.packagesData = {
  addPackage,
  updatePackage,
  deletePackage,
  getAllPackages,
  getPackageById,
};
