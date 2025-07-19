import { RequestHandler } from "express";
import { sql } from "../database/real-neon-db";

export const getAllPackages: RequestHandler = async (req, res) => {
  try {
    const packages = await sql`
      SELECT * FROM packages 
      ORDER BY popular DESC, created_at DESC
    `;
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
    const packages = await sql`
      SELECT * FROM packages 
      WHERE status = 'active' 
      ORDER BY popular DESC, created_at DESC
    `;
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
    const packages = await sql`
      SELECT * FROM packages WHERE id = ${id}
    `;

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "الباقة غير موجودة",
      });
    }

    res.json({
      success: true,
      data: packages[0],
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

    // التحقق من صحة البيانات
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

    const result = await sql`
      INSERT INTO packages (
        name, duration, mecca_stay, medina_stay, itinerary, 
        price_double, price_triple, price_quad, price_infant, price_child, 
        status, popular, description
      )
      VALUES (
        ${name}, ${duration}, ${mecca_stay || ""}, ${medina_stay || ""}, ${itinerary || ""},
        ${parseInt(price_double) || 0}, ${parseInt(price_triple) || 0}, ${parseInt(price_quad) || 0},
        ${price_infant && price_infant.trim() ? parseInt(price_infant) : null},
        ${price_child && price_child.trim() ? parseInt(price_child) : null},
        ${status}, ${popular}, ${description || null}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: result[0],
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
      price_infant,
      price_child,
      status,
      popular,
      description,
    } = req.body;

    const result = await sql`
      UPDATE packages 
      SET 
        name = ${name},
        duration = ${duration},
        mecca_stay = ${mecca_stay},
        medina_stay = ${medina_stay},
        itinerary = ${itinerary},
        price_double = ${parseInt(price_double)},
        price_triple = ${parseInt(price_triple)},
        price_quad = ${parseInt(price_quad)},
        price_infant = ${price_infant ? parseInt(price_infant) : null},
        price_child = ${price_child ? parseInt(price_child) : null},
        status = ${status},
        popular = ${popular},
        description = ${description},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "الباقة غير موجودة",
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: "تم تحديث الباقة بنجاح",
    });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تحديث الباقة",
    });
  }
};

export const deletePackage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql`
      DELETE FROM packages 
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "الباقة غير موجودة",
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
    });
  }
};
