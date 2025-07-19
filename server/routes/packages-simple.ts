import { RequestHandler } from "express";
import { getDB } from "../database/db";

export const getAllPackages: RequestHandler = async (req, res) => {
  try {
    const db = getDB();
    const packages = db
      .prepare("SELECT * FROM packages ORDER BY popular DESC, created_at DESC")
      .all();
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
    });
  }
};

export const getActivePackages: RequestHandler = async (req, res) => {
  try {
    const db = getDB();
    const packages = db
      .prepare(
        "SELECT * FROM packages WHERE status = 'active' ORDER BY popular DESC, created_at DESC",
      )
      .all();
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
    });
  }
};

export const getPackageById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const pkg = db.prepare("SELECT * FROM packages WHERE id = ?").get(id);

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
      price_infant,
      price_child,
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

    const db = getDB();
    const result = db
      .prepare(
        `
      INSERT INTO packages (name, duration, mecca_stay, medina_stay, itinerary, price_double, price_triple, price_quad, popular, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
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
    });
  }
};
