import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleVerify,
  handleLogout,
  authenticateToken,
} from "./routes/auth";
import { initializeDatabase } from "./database/init";
import {
  getAllPackages,
  getActivePackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "./routes/packages";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
} from "./routes/bookings";
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiryStatus,
} from "./routes/inquiries";
import { getStats } from "./routes/stats";

export function createServer() {
  const app = express();

  // Initialize database
  try {
    initializeDatabase();
    console.log("🗄️ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/verify", handleVerify);
  app.post("/api/auth/logout", handleLogout);

  // Public routes (no authentication required)
  app.get("/api/packages/active", getActivePackages);
  app.post("/api/bookings", createBooking);
  app.post("/api/inquiries", createInquiry);

  // Protected admin routes
  app.get("/api/packages", authenticateToken, getAllPackages);
  app.get("/api/packages/:id", authenticateToken, getPackageById);
  app.post("/api/packages", authenticateToken, createPackage);
  app.put("/api/packages/:id", authenticateToken, updatePackage);
  app.delete("/api/packages/:id", authenticateToken, deletePackage);

  app.get("/api/bookings", authenticateToken, getAllBookings);
  app.get("/api/bookings/:id", authenticateToken, getBookingById);
  app.put("/api/bookings/:id/status", authenticateToken, updateBookingStatus);

  app.get("/api/inquiries", authenticateToken, getAllInquiries);
  app.get("/api/inquiries/:id", authenticateToken, getInquiryById);
  app.put("/api/inquiries/:id/status", authenticateToken, updateInquiryStatus);

  app.get("/api/stats", authenticateToken, getStats);

  return app;
}
