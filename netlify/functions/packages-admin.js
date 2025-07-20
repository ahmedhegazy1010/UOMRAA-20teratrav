// وظائف إدارة باقات العمرة
const jwt = require("jsonwebtoken");

const JWT_SECRET = "teratrav_jwt_secret_2024_umrah_admin";

// متغير عام لتخزين الباقات مع بيانات افتراضية
let packages = [
  {
    id: 1,
    name: "المولد النبوي (اغسطس)",
    duration: "7 أيام / 6 ليالي",
    mecca_stay: "4 ليالي - فندق هيلتون الحرم",
    medina_stay: "2 ليالي - فندق دار الهجرة",
    itinerary: "الرياض - جدة - مكة - المدينة - جدة - الرياض",
    price_double: 4500,
    price_triple: 3800,
    price_quad: 3200,
    price_infant: 1500,
    price_child: 2800,
    status: "active",
    popular: true,
    description:
      "باقة المولد النبوي الشريف تشمل زيارة الحرمين الشريفين مع إقامة فاخرة وخدمات متميزة",
    created_at: "2025-01-19",
    updated_at: "2025-01-19",
  },
  {
    id: 2,
    name: "المولد النبوي (سبتمبر)",
    duration: "10 أيام / 9 ليالي",
    mecca_stay: "6 ليالي - فندق فيرمونت مكة",
    medina_stay: "3 ليالي - فندق المدينة موفنبيك",
    itinerary: "الرياض - جدة - مكة - المدينة - جدة - الرياض",
    price_double: 6800,
    price_triple: 5900,
    price_quad: 5200,
    price_infant: 2200,
    price_child: 4100,
    status: "active",
    popular: true,
    description: "باقة شاملة للمولد النبوي مع إقامة ممتدة وبرنامج زيارات شامل",
    created_at: "2025-01-19",
    updated_at: "2025-01-19",
  },
  {
    id: 3,
    name: "عشر ذي الحجة (ديسمبر)",
    duration: "8 أيام / 7 ليالي",
    mecca_stay: "5 ليالي - برج الساعة فيرمونت",
    medina_stay: "2 ليالي - فندق الأنصار الذهبي",
    itinerary: "الرياض - جدة - مكة - المدينة - جدة - الرياض",
    price_double: 5200,
    price_triple: 4500,
    price_quad: 3900,
    price_infant: 1800,
    price_child: 3400,
    status: "active",
    popular: false,
    description: "باقة العشر الأوائل من ذي الحجة مع إقامة قريبة من الحرم المكي",
    created_at: "2025-01-19",
    updated_at: "2025-01-19",
  },
  {
    id: 4,
    name: "رجب المبارك (فبراير)",
    duration: "5 أيام / 4 ليالي",
    mecca_stay: "3 ليالي - فندق دار التوحيد",
    medina_stay: "1 ليلة - فندق الطيبة سيتي",
    itinerary: "الرياض - المدينة - مكة - جدة - الرياض",
    price_double: 3200,
    price_triple: 2800,
    price_quad: 2400,
    price_infant: 1200,
    price_child: 2000,
    status: "active",
    popular: false,
    description: "باقة قصيرة لشهر رجب المبارك مناسبة للرحلات السريعة",
    created_at: "2025-01-19",
    updated_at: "2025-01-19",
  },
  {
    id: 5,
    name: "شعبان المبارك (مارس)",
    duration: "6 أيام / 5 ليالي",
    mecca_stay: "3 ليالي - فندق سويس أوتيل",
    medina_stay: "2 ليالي - فندق شذا المدينة",
    itinerary: "الرياض - جدة - مكة - المدينة - جدة - الرياض",
    price_double: 3800,
    price_triple: 3300,
    price_quad: 2900,
    price_infant: 1400,
    price_child: 2500,
    status: "active",
    popular: false,
    description: "باقة شهر شعبان مع خدمات متميزة وإقامة مريحة",
    created_at: "2025-01-19",
    updated_at: "2025-01-19",
  },
];

// دالة لحفظ البيانات في global للمشاركة مع packages.js
function saveToGlobal() {
  if (typeof global !== "undefined") {
    global.sharedPackages = packages;
    console.log("Data saved to global, packages count:", packages.length);
  }
}

// دالة لقراءة البيانات من global
function loadFromGlobal() {
  if (typeof global !== "undefined" && global.sharedPackages) {
    packages = global.sharedPackages;
    console.log("Data loaded from global, packages count:", packages.length);
  }
}

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

// دوال إدارة البيانات
function getAllPackages() {
  return packages;
}

function getActivePackages() {
  return packages.filter((pkg) => pkg.status === "active");
}

function getPackageById(id) {
  return packages.find((pkg) => pkg.id === parseInt(id));
}

function addPackage(newPackage) {
  const newId = Math.max(...packages.map((p) => p.id), 0) + 1;
  const packageWithId = {
    ...newPackage,
    id: newId,
    created_at: new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString().split("T")[0],
  };
  packages.push(packageWithId);

  // حفظ البيانات في المتغير العام للمشاركة
  saveToGlobal();
  console.log("Package added successfully, total packages:", packages.length);

  return packageWithId;
}

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

  // حفظ البيانات في المتغير العام للمشاركة
  saveToGlobal();
  console.log("Package updated successfully, total packages:", packages.length);

  return packages[index];
}

function deletePackage(id) {
  const index = packages.findIndex((pkg) => pkg.id === parseInt(id));
  if (index === -1) {
    return null;
  }

  const deletedPackage = packages[index];
  packages.splice(index, 1);

  // حفظ البيانات في المتغير العام للمشاركة
  saveToGlobal();
  console.log("Package deleted successfully, total packages:", packages.length);

  return deletedPackage;
}

exports.handler = async (event, context) => {
  // تحميل البيانات من global في بداية كل طلب
  loadFromGlobal();
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const method = event.httpMethod;
    const path = event.path;

    // استخراج ID من المسار إن وجد
    const pathParts = path.split("/");
    const packageId = pathParts[pathParts.length - 1];
    const isIdPath = !isNaN(parseInt(packageId));

    // GET all packages (requires auth)
    if (method === "GET" && !isIdPath) {
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: getAllPackages(),
          message: "تم جلب الباقات بنجاح",
        }),
      };
    }

    // GET single package (requires auth)
    if (method === "GET" && isIdPath) {
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

      const pkg = getPackageById(packageId);
      if (!pkg) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: "الباقة غير موجودة",
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: pkg,
          message: "تم جلب الباقة بنجاح",
        }),
      };
    }

    // POST new package (requires auth)
    if (method === "POST") {
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

      const packageData = JSON.parse(event.body);

      // التحقق من البيانات المطلوبة
      if (
        !packageData.name ||
        !packageData.duration ||
        !packageData.price_double ||
        !packageData.price_triple ||
        !packageData.price_quad
      ) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "البيانات المطلوبة ناقصة",
          }),
        };
      }

      const packageToAdd = {
        name: packageData.name,
        duration: packageData.duration,
        mecca_stay: packageData.mecca_stay || "",
        medina_stay: packageData.medina_stay || "",
        itinerary: packageData.itinerary || "",
        price_double: parseInt(packageData.price_double),
        price_triple: parseInt(packageData.price_triple),
        price_quad: parseInt(packageData.price_quad),
        price_infant: parseInt(packageData.price_infant) || 0,
        price_child: parseInt(packageData.price_child) || 0,
        status: packageData.status || "active",
        popular: packageData.popular || false,
        description: packageData.description || "",
      };

      const newPackage = addPackage(packageToAdd);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data: newPackage,
          message: "تم إضافة الباقة بنجاح",
        }),
      };
    }

    // PUT update package (requires auth)
    if (method === "PUT") {
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

      const updateData = JSON.parse(event.body);
      const updatePackageId = updateData.id;

      if (!updatePackageId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "معرف الباقة مطلوب",
          }),
        };
      }

      // تحديث البيانات مع التحقق من صحة البيانات
      if (
        !updateData.name ||
        !updateData.duration ||
        !updateData.price_double ||
        !updateData.price_triple ||
        !updateData.price_quad
      ) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "البيانات المطلوبة ناقصة",
          }),
        };
      }

      const updateDataFormatted = {
        name: updateData.name,
        duration: updateData.duration,
        mecca_stay: updateData.mecca_stay || "",
        medina_stay: updateData.medina_stay || "",
        itinerary: updateData.itinerary || "",
        price_double: parseInt(updateData.price_double),
        price_triple: parseInt(updateData.price_triple),
        price_quad: parseInt(updateData.price_quad),
        price_infant: parseInt(updateData.price_infant) || 0,
        price_child: parseInt(updateData.price_child) || 0,
        status: updateData.status || "active",
        popular: updateData.popular || false,
      };

      const updatedPackage = updatePackage(
        updatePackageId,
        updateDataFormatted,
      );

      if (!updatedPackage) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: "الباقة غير موجودة",
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: updatedPackage,
          message: "تم تحديث الباقة بنجاح",
        }),
      };
    }

    // DELETE package (requires auth)
    if (method === "DELETE" && isIdPath) {
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

      const deletedPackage = deletePackage(packageId);

      if (!deletedPackage) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: "الباقة غير موجودة",
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: deletedPackage,
          message: "تم حذف الباقة بنجاح",
        }),
      };
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
