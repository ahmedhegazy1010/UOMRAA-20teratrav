// نظام تخزين دائم للباقات يستخدم ملف JSON
const fs = require("fs");
const path = require("path");

// مسار ملف البيانات
const DATA_FILE = path.join(__dirname, "packages-data.json");

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
    description: "باقة قصيرة لشهر رجب المبارك مناسبة لل��حلات السريعة",
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

// قراءة البيانات من الملف
function loadPackages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      const packages = JSON.parse(data);
      console.log("Loaded packages from file:", packages.length);
      return packages;
    } else {
      console.log("No data file found, using defaults");
      savePackages(DEFAULT_PACKAGES);
      return [...DEFAULT_PACKAGES];
    }
  } catch (error) {
    console.error("Error loading packages:", error);
    return [...DEFAULT_PACKAGES];
  }
}

// حفظ البيانات في الملف
function savePackages(packages) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(packages, null, 2));
    console.log("Packages saved to file:", packages.length);
  } catch (error) {
    console.error("Error saving packages:", error);
  }
}

// Cache للبيانات
let packagesCache = null;
let cacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

function getPackages() {
  const now = Date.now();
  if (!packagesCache || now - cacheTime > CACHE_DURATION) {
    packagesCache = loadPackages();
    cacheTime = now;
  }
  return packagesCache;
}

function setPackages(packages) {
  packagesCache = [...packages];
  cacheTime = Date.now();
  savePackages(packages);
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

exports.getPackages = getPackages;
exports.setPackages = setPackages;
exports.addPackage = addPackage;
exports.updatePackage = updatePackage;
exports.deletePackage = deletePackage;
exports.getActivePackages = getActivePackages;
exports.getPackageById = getPackageById;
