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
    console.log("Creating package with data:", req.body);
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
      status = "active",
      popular = false,
      description,
    } = req.body;

    // Validation
    if (
      !name?.trim() ||
      !duration?.trim() ||
      !price_double ||
      !price_triple ||
      !price_quad
    ) {
      return res.status(400).json({
        success: false,
        message: "الاسم والمدة والأسعار مطلوبة",
      });
    }

    const db = getDB();
    const result = db
      .prepare(
        `
      INSERT INTO packages (name, duration, mecca_stay, medina_stay, itinerary, price_double, price_triple, price_quad, price_infant, price_child, status, popular, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        name,
        duration,
        mecca_stay,
        medina_stay,
        itinerary,
        parseInt(price_double) || 0,
        parseInt(price_triple) || 0,
        parseInt(price_quad) || 0,
        price_infant && price_infant.trim() ? parseInt(price_infant) : null,
        price_child && price_child.trim() ? parseInt(price_child) : null,
        status,
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
    console.error("Request body was:", req.body);
    res.status(500).json({
      success: false,
      message: "خطأ في إنشاء الباقة",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
