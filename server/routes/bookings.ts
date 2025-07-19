import { RequestHandler } from "express";
import { queries, Booking } from "../database/init";

export const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const bookings = queries.getAllBookings.all();
    res.json({
      success: true,
      data: bookings,
      message: "تم جلب الحجوزات بنجاح",
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الحجوزات",
      error: error.message,
    });
  }
};

export const getBookingById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = queries.getBookingById.get(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "الحجز غير موجود",
      });
    }

    res.json({
      success: true,
      data: booking,
      message: "تم جلب الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الحجز",
      error: error.message,
    });
  }
};

export const createBooking: RequestHandler = async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      email,
      package_id,
      room_type,
      travelers_count,
      total_price,
      travel_date,
      special_requests,
    } = req.body;

    // Validation
    if (
      !customer_name ||
      !phone ||
      !package_id ||
      !room_type ||
      !travelers_count ||
      !total_price
    ) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول الأساسية مطلوبة",
      });
    }

    // Validate room type
    if (!["double", "triple", "quad"].includes(room_type)) {
      return res.status(400).json({
        success: false,
        message: "نوع الغرفة غير صالح",
      });
    }

    // Check if package exists
    const pkg = queries.getPackageById.get(package_id);
    if (!pkg) {
      return res.status(400).json({
        success: false,
        message: "الباقة المحددة غير موجودة",
      });
    }

    const result = queries.insertBooking.run(
      customer_name,
      phone,
      email || null,
      package_id,
      room_type,
      parseInt(travelers_count),
      parseInt(total_price),
      travel_date || null,
      special_requests || null,
    );

    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid, ...req.body },
      message: "تم إنشاء الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إنشاء الحجز",
      error: error.message,
    });
  }
};

export const updateBookingStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة الحجز غير صالحة",
      });
    }

    // Check if booking exists
    const existingBooking = queries.getBookingById.get(id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "الحجز غير موجود",
      });
    }

    const result = queries.updateBookingStatus.run(status, id);

    if (result.changes === 0) {
      return res.status(400).json({
        success: false,
        message: "لم يتم تحديث أي شيء",
      });
    }

    res.json({
      success: true,
      data: { id, status },
      message: "تم تحديث حالة الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تحديث حالة الحجز",
      error: error.message,
    });
  }
};
