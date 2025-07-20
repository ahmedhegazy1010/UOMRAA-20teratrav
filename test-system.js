const fetch = require("node-fetch");

const API_BASE = "http://localhost:8080";

// Test functions
async function testLogin() {
  console.log("🔐 Testing login...");
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "admin",
      password: "teratrav2024",
    }),
  });

  const data = await response.json();
  if (data.success && data.token) {
    console.log("✅ Login successful");
    return data.token;
  } else {
    console.log("❌ Login failed:", data);
    return null;
  }
}

async function testGetPackages() {
  console.log("📦 Testing get active packages...");
  const response = await fetch(`${API_BASE}/api/packages/active`);
  const data = await response.json();

  console.log("Response:", data);
  if (data.success) {
    console.log(`✅ Got ${data.data.length} packages`);
    return data.data;
  } else {
    console.log("❌ Failed to get packages:", data);
    return [];
  }
}

async function testCreatePackage(token) {
  console.log("➕ Testing create package...");
  const packageData = {
    name: "باقة اختبار",
    duration: "7 أيام",
    mecca_stay: "4 أيام",
    medina_stay: "3 أيام",
    itinerary: "برنامج شامل",
    price_double: 5000,
    price_triple: 4500,
    price_quad: 4000,
    status: "active",
    popular: false,
    description: "باقة تجريبية",
  };

  const response = await fetch(`${API_BASE}/api/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(packageData),
  });

  const data = await response.json();
  if (data.success) {
    console.log("✅ Package created successfully:", data.data.id);
    return data.data.id;
  } else {
    console.log("❌ Failed to create package:", data);
    return null;
  }
}

async function testUpdatePackage(token, packageId) {
  console.log("✏️ Testing update package...");
  const updateData = {
    name: "باقة اختبار محدثة",
    duration: "8 أيام",
    mecca_stay: "5 أيام",
    medina_stay: "3 أيام",
    itinerary: "برنامج شامل محدث",
    price_double: 5500,
    price_triple: 5000,
    price_quad: 4500,
    status: "active",
    popular: true,
    description: "باقة تجريبية محدثة",
  };

  const response = await fetch(`${API_BASE}/api/packages/${packageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  const data = await response.json();
  if (data.success) {
    console.log("✅ Package updated successfully");
    return true;
  } else {
    console.log("❌ Failed to update package:", data);
    return false;
  }
}

async function testDeletePackage(token, packageId) {
  console.log("🗑️ Testing delete package...");
  const response = await fetch(`${API_BASE}/api/packages/${packageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (data.success) {
    console.log("✅ Package deleted successfully");
    return true;
  } else {
    console.log("❌ Failed to delete package:", data);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log("🚀 Starting system tests...\n");

  try {
    // Test 1: Login
    const token = await testLogin();
    if (!token) {
      console.log("❌ Cannot continue without login");
      return;
    }

    console.log("\n");

    // Test 2: Get initial packages
    const initialPackages = await testGetPackages();
    console.log("\n");

    // Test 3: Create new package
    const packageId = await testCreatePackage(token);
    if (!packageId) {
      console.log("❌ Cannot continue without creating package");
      return;
    }

    console.log("\n");

    // Test 4: Get packages after creation
    const packagesAfterCreate = await testGetPackages();
    if (packagesAfterCreate.length > initialPackages.length) {
      console.log("✅ New package appears in list!");
    } else {
      console.log("❌ New package NOT in list!");
    }

    console.log("\n");

    // Test 5: Update package
    await testUpdatePackage(token, packageId);

    console.log("\n");

    // Test 6: Get packages after update
    const packagesAfterUpdate = await testGetPackages();
    const updatedPackage = packagesAfterUpdate.find((p) => p.id == packageId);
    if (updatedPackage && updatedPackage.name === "باقة اختبار محدثة") {
      console.log("✅ Package update reflected in list!");
    } else {
      console.log("❌ Package update NOT reflected!");
    }

    console.log("\n");

    // Test 7: Delete package
    await testDeletePackage(token, packageId);

    console.log("\n");

    // Test 8: Get packages after deletion
    const packagesAfterDelete = await testGetPackages();
    const deletedPackage = packagesAfterDelete.find((p) => p.id == packageId);
    if (!deletedPackage) {
      console.log("✅ Package deletion reflected in list!");
    } else {
      console.log("❌ Package deletion NOT reflected!");
    }

    console.log("\n🎉 Tests completed!");
  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

runTests();
