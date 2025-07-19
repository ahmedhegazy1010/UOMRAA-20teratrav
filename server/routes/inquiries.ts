import { RequestHandler } from "express";
import { queries, Inquiry } from "../database/init";

export const getAllInquiries: RequestHandler = async (req, res) => {
  try {
    const inquiries = queries.getAllInquiries.all() as Inquiry[];
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
      error: error.message,
    });
  }
};

export const getInquiryById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = queries.getInquiryById.get(id) as Inquiry;

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "الاستفسا�� غير موجود",
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
      error: error.message,
    });
  }
};

export const createInquiry: RequestHandler = async (req, res) => {
  try {
    const { customer_name, phone, email, message } = req.body;

    // Validation
    if (!customer_name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "الاسم ورقم الهاتف والرسالة مطلوبة",
      });
    }

    const result = queries.insertInquiry.run(
      customer_name,
      phone,
      email || null,
      message,
    );

    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid, ...req.body },
      message: "تم إرسال الاستفسار بنجاح، سنتواصل معك قريباً",
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إرسال الاستفسار",
      error: error.message,
    });
  }
};

export const updateInquiryStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    // Validate status
    if (!["new", "replied", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة الاستفسار غير صالحة",
      });
    }

    // Check if inquiry exists
    const existingInquiry = queries.getInquiryById.get(id);
    if (!existingInquiry) {
      return res.status(404).json({
        success: false,
        message: "الاستفسار غير موجود",
      });
    }

    const result = queries.updateInquiryStatus.run(
      status,
      admin_response || null,
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
      data: { id, status, admin_response },
      message: "تم تحديث حالة الاستفسار بنجاح",
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تحديث حالة الاستفسار",
      error: error.message,
    });
  }
};
