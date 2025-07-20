// دالة عامة لعرض الباقات (بدون مصادقة)
// ملاحظة: هذا الملف يقرأ البيانات من نفس المصدر المشترك مع packages-admin.js

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
    price_áfrica: 3300,
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
