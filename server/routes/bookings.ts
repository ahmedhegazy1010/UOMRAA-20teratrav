import { RequestHandler } from "express";
import { getDB } from "../database/db";

export const createBooking: RequestHandler = async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      email,
      package_id,
      room_type,
      adults_count,
      children_count,
      infants_count,
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
      !adults_count ||
      !travelers_count ||
      !total_price
    ) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول الأساسية مطلوبة",
      });
    }

    const db = getDB();

    // Check if package exists
    const packageExists = db
      .prepare("SELECT id FROM packages WHERE id = ? AND status = 'active'")
      .get(package_id);

    if (!packageExists) {
      return res.status(404).json({
        success: false,
        message: "الباقة غير موجودة أو غير نشطة",
      });
    }

    const result = db
      .prepare(
        `
      INSERT INTO bookings (
        customer_name, phone, email, package_id, room_type, 
        travelers_count, total_price, travel_date, special_requests, 
        status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `,
      )
      .run(
        customer_name,
        phone,
        email || null,
        parseInt(package_id),
        room_type,
        parseInt(travelers_count),
        parseInt(total_price),
        travel_date || null,
        special_requests || null,
      );

    // Get the created booking with package details
    const booking = db
      .prepare(
        `
      SELECT 
        b.*,
        p.name as package_name,
        p.duration as package_duration
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      WHERE b.id = ?
    `,
      )
      .get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: booking,
      message: "تم إرسال طلب الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إرسال طلب الحجز",
    });
  }
};

export const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const db = getDB();
    const bookings = db
      .prepare(
        `
      SELECT 
        b.*,
        p.name as package_name,
        p.duration as package_duration
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      ORDER BY b.created_at DESC
    `,
      )
      .all();

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
    });
  }
};

export const getBookingById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const booking = db
      .prepare(
        `
      SELECT 
        b.*,
        p.name as package_name,
        p.duration as package_duration,
        p.mecca_stay,
        p.medina_stay,
        p.itinerary
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      WHERE b.id = ?
    `,
      )
      .get(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "الحجز غير موجود",
      });
    }

    res.json({
      success: true,
      data: booking,
      message: "تم جلب بيانات الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب بيانات الحجز",
    });
  }
};

export const updateBookingStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "حالة الحجز مطلوبة",
      });
    }

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة الحجز غير صحيحة",
      });
    }

    const db = getDB();

    const result = db
      .prepare(
        `
      UPDATE bookings 
      SET status = ?, admin_response = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      )
      .run(status, admin_response || null, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "الحجز غير موجود",
      });
    }

    // Get updated booking
    const booking = db
      .prepare(
        `
      SELECT 
        b.*,
        p.name as package_name,
        p.duration as package_duration
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      WHERE b.id = ?
    `,
      )
      .get(id);

    res.json({
      success: true,
      data: booking,
      message: "تم تحديث حالة الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تحديث حالة الحجز",
    });
  }
};

export const deleteBooking: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const result = db.prepare("DELETE FROM bookings WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "الحجز غير موجود",
      });
    }

    res.json({
      success: true,
      message: "تم حذف الحجز بنجاح",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في حذف الحجز",
    });
  }
};

// Get booking statistics
export const getBookingStats: RequestHandler = async (req, res) => {
  try {
    const db = getDB();

    const stats = {
      total: db.prepare("SELECT COUNT(*) as count FROM bookings").get() as {
        count: number;
      },
      pending: db
        .prepare(
          "SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'",
        )
        .get() as { count: number },
      confirmed: db
        .prepare(
          "SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'",
        )
        .get() as { count: number },
      completed: db
        .prepare(
          "SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'",
        )
        .get() as { count: number },
      cancelled: db
        .prepare(
          "SELECT COUNT(*) as count FROM bookings WHERE status = 'cancelled'",
        )
        .get() as { count: number },
      total_revenue: db
        .prepare(
          "SELECT SUM(total_price) as total FROM bookings WHERE status IN ('confirmed', 'completed')",
        )
        .get() as { total: number },
      this_month: db
        .prepare(
          "SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) >= DATE('now', 'start of month')",
        )
        .get() as { count: number },
    };

    res.json({
      success: true,
      data: {
        total_bookings: stats.total.count,
        pending_bookings: stats.pending.count,
        confirmed_bookings: stats.confirmed.count,
        completed_bookings: stats.completed.count,
        cancelled_bookings: stats.cancelled.count,
        total_revenue: stats.total_revenue.total || 0,
        this_month_bookings: stats.this_month.count,
      },
      message: "تم جلب إحصائيات الحجوزات بنجاح",
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب إحصائيات الحجوزات",
    });
  }
};
