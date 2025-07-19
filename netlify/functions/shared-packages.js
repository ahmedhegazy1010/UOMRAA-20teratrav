// ملف مشترك لبيانات الباقات
// سيتم استخدامه من قبل packages.js و packages-admin.js

let packagesData = [
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
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
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
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
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
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
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
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: 5,
    name: "شعبان المبارك (مارس)",
    duration: "6 أيام / 5 ليالي",
    mecca_stay: "3 ليالي - فندق سويس أوتيل",
    medina_stay: "2 ليالي - فندق شذا المدينة",
    itinerary: "الرياض - جدة - مكة - المدي��ة - جدة - الرياض",
    price_double: 3800,
    price_triple: 3300,
    price_quad: 2900,
    price_infant: 1400,
    price_child: 2500,
    status: "active",
    popular: false,
    description: "باقة شهر شعبان مع خدمات متميزة وإقامة مريحة",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
];

// دوال للتعامل مع البيانات
function getAllPackages() {
  return packagesData;
}

function getActivePackages() {
  return packagesData.filter((pkg) => pkg.status === "active");
}

function getPackageById(id) {
  return packagesData.find((pkg) => pkg.id === parseInt(id));
}

function addPackage(newPackage) {
  const newId = Math.max(...packagesData.map((p) => p.id), 0) + 1;
  const packageWithId = {
    ...newPackage,
    id: newId,
    created_at: new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString().split("T")[0],
  };
  packagesData.push(packageWithId);
  return packageWithId;
}

function updatePackage(id, updateData) {
  const index = packagesData.findIndex((pkg) => pkg.id === parseInt(id));
  if (index === -1) {
    return null;
  }

  packagesData[index] = {
    ...packagesData[index],
    ...updateData,
    id: parseInt(id),
    updated_at: new Date().toISOString().split("T")[0],
  };

  return packagesData[index];
}

function deletePackage(id) {
  const index = packagesData.findIndex((pkg) => pkg.id === parseInt(id));
  if (index === -1) {
    return null;
  }

  const deletedPackage = packagesData[index];
  packagesData.splice(index, 1);
  return deletedPackage;
}

module.exports = {
  getAllPackages,
  getActivePackages,
  getPackageById,
  addPackage,
  updatePackage,
  deletePackage,
};
