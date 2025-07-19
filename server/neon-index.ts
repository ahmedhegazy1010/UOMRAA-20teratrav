import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Load environment variables
dotenv.config();
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleVerify,
  handleLogout,
  authenticateToken,
  createUser,
  resetPassword,
} from "./routes/neon-auth";
import { initializeNeonDatabase } from "./database/neon-db";
import {
  getAllPackages,
  getActivePackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "./routes/neon-packages";
import { getStats } from "./routes/stats-simple";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
} from "./routes/bookings";
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats,
} from "./routes/inquiries";

export function createNeonServer() {
  const app = express();

  // تهيئة قاعدة البيانات
  initializeNeonDatabase().catch((error) => {
    console.error("❌ Failed to initialize Neon database:", error);
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // مسارات API الأساسية
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from TeraTrav Neon server!" });
  });

  app.get("/api/demo", handleDemo);

  // مسارات المصادقة
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/verify", handleVerify);
  app.post("/api/auth/logout", handleLogout);

  // مسارات إدارة المستخدمين يدوياً (للإعداد/التطوير)
  app.post("/api/auth/create-user", createUser);
  app.post("/api/auth/reset-password", resetPassword);

  // المسارات العامة (لا تحتاج مصادقة)
  app.get("/api/packages/active", getActivePackages);
  app.get("/api/packages/:id", getPackageById);
  app.post("/api/bookings", createBooking);
  app.post("/api/inquiries", createInquiry);

  // المسارات المحمية للمدير
  app.get("/api/packages", authenticateToken, getAllPackages);
  app.post("/api/packages", authenticateToken, createPackage);
  app.put("/api/packages/:id", authenticateToken, updatePackage);
  app.delete("/api/packages/:id", authenticateToken, deletePackage);
  app.get("/api/stats", authenticateToken, getStats);

  // مسارات إدارة الحجوزات (للمدير فقط)
  app.get("/api/bookings", authenticateToken, getAllBookings);
  app.get("/api/bookings/:id", authenticateToken, getBookingById);
  app.put("/api/bookings/:id/status", authenticateToken, updateBookingStatus);
  app.delete("/api/bookings/:id", authenticateToken, deleteBooking);
  app.get("/api/bookings/stats", authenticateToken, getBookingStats);

  // مسارات إدارة الاستفسارات (للمدير فقط)
  app.get("/api/inquiries", authenticateToken, getAllInquiries);
  app.get("/api/inquiries/:id", authenticateToken, getInquiryById);
  app.put("/api/inquiries/:id/status", authenticateToken, updateInquiryStatus);
  app.delete("/api/inquiries/:id", authenticateToken, deleteInquiry);
  app.get("/api/inquiries/stats", authenticateToken, getInquiryStats);

  return app;
}
