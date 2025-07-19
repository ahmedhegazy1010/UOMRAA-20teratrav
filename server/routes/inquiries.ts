import { RequestHandler } from "express";
import { getDB } from "../database/db";

export const createInquiry: RequestHandler = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // Validation
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "الاسم ورقم الهاتف والرسالة مطلوبة",
      });
    }

    const db = getDB();

    const result = db
      .prepare(
        `
      INSERT INTO inquiries (name, phone, email, message, status, created_at)
      VALUES (?, ?, ?, ?, 'new', CURRENT_TIMESTAMP)
    `,
      )
      .run(name, phone, email || null, message);

    // Get the created inquiry
    const inquiry = db
      .prepare("SELECT * FROM inquiries WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: inquiry,
      message: "تم إرسال استفسارك بنجاح، سنتواصل معك قريباً",
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إرسال الاستفسار",
    });
  }
};

export const getAllInquiries: RequestHandler = async (req, res) => {
  try {
    const db = getDB();
    const inquiries = db
      .prepare("SELECT * FROM inquiries ORDER BY created_at DESC")
      .all();

    res.json({
      success: true,
      data: inquiries,
      message: "تم جلب الاستفسارات بنجاح",
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الاستفسارات",
    });
  }
};

export const getInquiryById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const inquiry = db.prepare("SELECT * FROM inquiries WHERE id = ?").get(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "الاستفسار غير موجود",
      });
    }

    res.json({
      success: true,
      data: inquiry,
      message: "تم جلب الاستفسار بنجاح",
    });
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الاستفسار",
    });
  }
};

export const updateInquiryStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "حالة الاستفسار مطلوبة",
      });
    }

    const validStatuses = ["new", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة الاستفسار غير صحيحة",
      });
    }

    const db = getDB();

    const result = db
      .prepare(
        `
      UPDATE inquiries 
      SET status = ?, admin_response = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      )
      .run(status, admin_response || null, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "الاستفسار غير موجود",
      });
    }

    // Get updated inquiry
    const inquiry = db.prepare("SELECT * FROM inquiries WHERE id = ?").get(id);

    res.json({
      success: true,
      data: inquiry,
      message: "تم تحديث حالة الاستفسار بنجاح",
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تحديث حالة الاستفسار",
    });
  }
};

export const deleteInquiry: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const result = db.prepare("DELETE FROM inquiries WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "الاستفسار غير موجود",
      });
    }

    res.json({
      success: true,
      message: "تم حذف الاستفسار بنجاح",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({
      success: false,
      message: "��طأ في حذف الاستفسار",
    });
  }
};

// Get inquiry statistics
export const getInquiryStats: RequestHandler = async (req, res) => {
  try {
    const db = getDB();

    const stats = {
      total: db.prepare("SELECT COUNT(*) as count FROM inquiries").get() as {
        count: number;
      },
      new: db
        .prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'")
        .get() as { count: number },
      in_progress: db
        .prepare(
          "SELECT COUNT(*) as count FROM inquiries WHERE status = 'in_progress'",
        )
        .get() as { count: number },
      resolved: db
        .prepare(
          "SELECT COUNT(*) as count FROM inquiries WHERE status = 'resolved'",
        )
        .get() as { count: number },
      closed: db
        .prepare(
          "SELECT COUNT(*) as count FROM inquiries WHERE status = 'closed'",
        )
        .get() as { count: number },
      this_month: db
        .prepare(
          "SELECT COUNT(*) as count FROM inquiries WHERE DATE(created_at) >= DATE('now', 'start of month')",
        )
        .get() as { count: number },
    };

    res.json({
      success: true,
      data: {
        total_inquiries: stats.total.count,
        new_inquiries: stats.new.count,
        in_progress_inquiries: stats.in_progress.count,
        resolved_inquiries: stats.resolved.count,
        closed_inquiries: stats.closed.count,
        this_month_inquiries: stats.this_month.count,
      },
      message: "تم جلب إحصائيات الاستفسارات بنجاح",
    });
  } catch (error) {
    console.error("Error fetching inquiry stats:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب إحصائيات الاستفسارات",
    });
  }
};
