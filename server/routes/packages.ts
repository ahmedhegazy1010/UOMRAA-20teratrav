import { RequestHandler } from "express";
import { queries, Package } from "../database/init";

export const getAllPackages: RequestHandler = async (req, res) => {
  try {
    const packages = queries.getAllPackages.all() as Package[];
    res.json({
      success: true,
      data: packages,
      message: "تم جلب الباقات بنجاح",
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الباقات",
      error: error.message,
    });
  }
};

export const getActivePackages: RequestHandler = async (req, res) => {
  try {
    const packages = queries.getActivePackages.all() as Package[];
    res.json({
      success: true,
      data: packages,
      message: "تم جلب الباقات النشطة بنجاح",
    });
  } catch (error) {
    console.error("Error fetching active packages:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الباقات النشطة",
      error: error.message,
    });
  }
};

export const getPackageById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = queries.getPackageById.get(id) as Package;

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "الباقة غير موجودة",
      });
    }

    res.json({
      success: true,
      data: pkg,
      message: "تم جلب الباقة بنجاح",
    });
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الباقة",
      error: error.message,
    });
  }
};

export const createPackage: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      duration,
      mecca_stay,
      medina_stay,
      itinerary,
      price_double,
      price_triple,
      price_quad,
      popular = false,
      description,
    } = req.body;

    // Validation
    if (
      !name ||
      !duration ||
      !mecca_stay ||
      !medina_stay ||
      !itinerary ||
      !price_double ||
      !price_triple ||
      !price_quad
    ) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول الأساسية مطلوبة",
      });
    }

    const result = queries.insertPackage.run(
      name,
      duration,
      mecca_stay,
      medina_stay,
      itinerary,
      parseInt(price_double),
      parseInt(price_triple),
      parseInt(price_quad),
      popular ? 1 : 0,
      description || null,
    );

    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid, ...req.body },
      message: "تم إنشاء الباقة بنجاح",
    });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إنشاء الباقة",
      error: error.message,
    });
  }
};

export const updatePackage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      duration,
      mecca_stay,
      medina_stay,
      itinerary,
      price_double,
      price_triple,
      price_quad,
      popular = false,
      description,
    } = req.body;

    // Check if package exists
    const existingPackage = queries.getPackageById.get(id) as Package;
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "الباقة غير موجودة",
      });
    }

    const result = queries.updatePackage.run(
      name,
      duration,
      mecca_stay,
      medina_stay,
      itinerary,
      parseInt(price_double),
      parseInt(price_triple),
      parseInt(price_quad),
      popular ? 1 : 0,
      description || null,
      id,
    );

    if (result.changes === 0) {
      return res.status(400).json({
        success: false,
        message: "لم يتم تحديث أي شيء",
      });
    }

    res.json({
      success: true,
      data: { id, ...req.body },
      message: "تم تحديث الباقة بنجاح",
    });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تحديث الباقة",
      error: error.message,
    });
  }
};

export const deletePackage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if package exists
    const existingPackage = queries.getPackageById.get(id) as Package;
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "الباقة غير موجودة",
      });
    }

    const result = queries.deletePackage.run(id);

    if (result.changes === 0) {
      return res.status(400).json({
        success: false,
        message: "لم يتم حذف أي شيء",
      });
    }

    res.json({
      success: true,
      message: "تم حذف الباقة بنجاح",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في حذف الباقة",
      error: error.message,
    });
  }
};
