// وظائف إدارة باقات العمرة
const jwt = require("jsonwebtoken");
const storage = require("./shared-storage");

const JWT_SECRET = "teratrav_jwt_secret_2024_umrah_admin";

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

exports.handler = async (event, context) => {
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
          data: storage.getPackages(),
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

      const pkg = storage.getPackageById(packageId);
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
