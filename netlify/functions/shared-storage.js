// نظام تخزين مشترك بسيط للـ Netlify Functions
// يستخدم نظام الذاكرة مع استبدال دوري للبيانات

// البيانات الافتراضية
const DEFAULT_PACKAGES = [
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

// متغير عام للتخزين المؤقت
let packagesCache = [...DEFAULT_PACKAGES];
let lastUpdated = Date.now();

// مدة انتهاء الصلاحية (5 دقائق)
const CACHE_EXPIRY = 5 * 60 * 1000;

// دوال الإدارة
function getPackages() {
  // إذا انتهت صلاحية البيانات، أعد تحميل البيانات الافتراضية
  if (Date.now() - lastUpdated > CACHE_EXPIRY) {
    console.log("Cache expired, reloading default packages");
    packagesCache = [...DEFAULT_PACKAGES];
    lastUpdated = Date.now();
  }

  return packagesCache;
}

function setPackages(newPackages) {
  packagesCache = [...newPackages];
  lastUpdated = Date.now();
  console.log("Packages updated in cache, count:", packagesCache.length);
}

function addPackage(newPackage) {
  const packages = getPackages();
  const newId = Math.max(...packages.map((p) => p.id), 0) + 1;
  const packageWithId = {
    ...newPackage,
    id: newId,
    created_at: new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString().split("T")[0],
  };

  packages.push(packageWithId);
  setPackages(packages);

  return packageWithId;
}

function updatePackage(id, updateData) {
  const packages = getPackages();
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

  setPackages(packages);
  return packages[index];
}

function deletePackage(id) {
  const packages = getPackages();
  const index = packages.findIndex((pkg) => pkg.id === parseInt(id));

  if (index === -1) {
    return null;
  }

  const deletedPackage = packages[index];
  packages.splice(index, 1);
  setPackages(packages);

  return deletedPackage;
}

function getActivePackages() {
  return getPackages().filter((pkg) => pkg.status === "active");
}

function getPackageById(id) {
  return getPackages().find((pkg) => pkg.id === parseInt(id));
}

module.exports = {
  getPackages,
  setPackages,
  addPackage,
  updatePackage,
  deletePackage,
  getActivePackages,
  getPackageById,
};
