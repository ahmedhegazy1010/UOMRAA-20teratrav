const storage = require("./netlify/functions/shared-storage");

console.log("Testing storage system...");
console.log("Default packages count:", storage.getPackages().length);
console.log("Active packages count:", storage.getActivePackages().length);

console.log("Adding new package...");
const newPkg = storage.addPackage({
  name: "Test Package",
  duration: "5 days",
  mecca_stay: "3 nights",
  medina_stay: "2 nights",
  itinerary: "Test",
  price_double: 1000,
  price_triple: 900,
  price_quad: 800,
  status: "active",
});

console.log("New package added with ID:", newPkg.id);
console.log("Total packages after add:", storage.getPackages().length);

// Test packages.js handler
const packagesHandler = require("./netlify/functions/packages");
const mockEvent = {
  httpMethod: "GET",
  path: "/packages",
};

packagesHandler
  .handler(mockEvent, {})
  .then((result) => {
    console.log("Packages handler test result:", result.statusCode);
    const body = JSON.parse(result.body);
    console.log("Active packages returned:", body.data.length);
  })
  .catch((err) => {
    console.error("Packages handler test failed:", err);
  });
