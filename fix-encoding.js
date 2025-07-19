const fs = require("fs");
const path = require("path");

// Function to fix encoding issues
function fixEncoding(content) {
  // Replace common encoding issues
  const fixes = {
    "كلمة المر��ر": "كلمة المرور",
    "خط ا��سير": "خط السير",
    "ا��م الشركة": "اسم الشركة",
    "إعد��دات النظام العامة": "إعدادات النظام العامة",
    "إعداد��ت عامة للموقع والنظام": "إعدادات عامة للموقع والنظام",
    "مدير ال��ظام": "مدير النظام",
    "رس��م التأشيرة": "رسوم التأشيرة",
    "التنقلات ��لداخلية بأحدث ��لباصات": "التنقلات الداخلية بأحدث الباصات",
    "رحلات ا��عمرة": "رحلات العمرة",
    "خ�� السير": "خط السير",
    "تحسين خدماتنا وتطوير منت��ات جديدة": "تحسين خدماتنا وتطوير منتجات جديدة",
    "نظ��ة عامة على أداء الموقع والحجوزات":
      "نظرة عامة على أداء الموقع والحجوزات",
    "طلبات ��اصة:": "طلبات خاصة:",
    "الصيانة ��الأمان": "الصيانة والأمان",
    "��لسماح بالتسجيل": "السماح بالتسجيل",
    "النسخ الاحتياطي الت��قائي": "النسخ الاحتياطي التلقائي",
    "إعادة تعيي�� كلمة المرور": "إعادة تعيين كلمة المرور",
  };

  let fixedContent = content;

  // Apply all fixes
  for (const [broken, fixed] of Object.entries(fixes)) {
    fixedContent = fixedContent.replace(
      new RegExp(broken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      fixed,
    );
  }

  return fixedContent;
}

// Fix AdminDashboard.tsx
const adminDashboardPath = "./client/pages/AdminDashboard.tsx";
if (fs.existsSync(adminDashboardPath)) {
  const content = fs.readFileSync(adminDashboardPath, "utf8");
  const fixedContent = fixEncoding(content);
  fs.writeFileSync(adminDashboardPath, fixedContent, "utf8");
  console.log("✅ Fixed AdminDashboard.tsx");
}

// Fix Umrah.tsx
const umrahPath = "./client/pages/Umrah.tsx";
if (fs.existsSync(umrahPath)) {
  const content = fs.readFileSync(umrahPath, "utf8");
  const fixedContent = fixEncoding(content);
  fs.writeFileSync(umrahPath, fixedContent, "utf8");
  console.log("✅ Fixed Umrah.tsx");
}

// Fix Privacy.tsx
const privacyPath = "./client/pages/Privacy.tsx";
if (fs.existsSync(privacyPath)) {
  const content = fs.readFileSync(privacyPath, "utf8");
  const fixedContent = fixEncoding(content);
  fs.writeFileSync(privacyPath, fixedContent, "utf8");
  console.log("✅ Fixed Privacy.tsx");
}

// Fix Admin.tsx
const adminPath = "./client/pages/Admin.tsx";
if (fs.existsSync(adminPath)) {
  const content = fs.readFileSync(adminPath, "utf8");
  const fixedContent = fixEncoding(content);
  fs.writeFileSync(adminPath, fixedContent, "utf8");
  console.log("✅ Fixed Admin.tsx");
}

// Fix AdminSetup.tsx
const adminSetupPath = "./client/pages/AdminSetup.tsx";
if (fs.existsSync(adminSetupPath)) {
  const content = fs.readFileSync(adminSetupPath, "utf8");
  const fixedContent = fixEncoding(content);
  fs.writeFileSync(adminSetupPath, fixedContent, "utf8");
  console.log("✅ Fixed AdminSetup.tsx");
}

console.log("🎉 تم إصلاح جميع مشاكل الترميز!");
