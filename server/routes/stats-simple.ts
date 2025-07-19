import { RequestHandler } from "express";
import { getDB } from "../database/db";

export const getStats: RequestHandler = async (req, res) => {
  try {
    const db = getDB();

    // Get basic counts
    const totalBookings = db
      .prepare("SELECT COUNT(*) as count FROM bookings")
      .get() as { count: number };

    const pendingBookings = db
      .prepare(
        "SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'",
      )
      .get() as { count: number };

    const newInquiries = db
      .prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'")
      .get() as { count: number };

    const totalRevenue = db
      .prepare(
        "SELECT SUM(total_price) as total FROM bookings WHERE status IN ('confirmed', 'completed')",
      )
      .get() as { total: number };

    const activePackages = db
      .prepare("SELECT COUNT(*) as count FROM packages WHERE status = 'active'")
      .get() as { count: number };

    const formattedStats = {
      totalBookings: {
        title: "إجمالي الحجوزات",
        value: totalBookings.count.toString(),
        trend: "+12%",
        icon: "Users",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      monthlyRevenue: {
        title: "المبيعات الشهرية",
        value: `${((totalRevenue.total || 0) / 1000000).toFixed(1)}M`,
        trend: "+8%",
        icon: "DollarSign",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      newInquiries: {
        title: "الاستفسارات الجديدة",
        value: newInquiries.count.toString(),
        trend: "+15%",
        icon: "MessageSquare",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
      newCustomers: {
        title: "العملاء الجدد",
        value: totalBookings.count.toString(),
        trend: "+25%",
        icon: "UserCheck",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
    };

    res.json({
      success: true,
      data: {
        stats: formattedStats,
      },
      message: "تم جلب الإحصائيات بنجاح",
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الإحصائيات",
    });
  }
};
