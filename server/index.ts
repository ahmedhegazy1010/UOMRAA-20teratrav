import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleVerify,
  handleLogout,
  authenticateToken,
} from "./routes/auth";
import { initializeDatabase } from "./database/db";
import {
  getAllPackages,
  getActivePackages,
  getPackageById,
  createPackage,
} from "./routes/packages-simple";
import { getStats } from "./routes/stats-simple";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
} from "./routes/bookings";

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
  app.get("/api/packages/:id", getPackageById);
  app.post("/api/bookings", createBooking);

  // Protected admin routes
  app.get("/api/packages", authenticateToken, getAllPackages);
  app.post("/api/packages", authenticateToken, createPackage);
  app.get("/api/stats", authenticateToken, getStats);

  // Booking management routes (admin only)
  app.get("/api/bookings", authenticateToken, getAllBookings);
  app.get("/api/bookings/:id", authenticateToken, getBookingById);
  app.put("/api/bookings/:id/status", authenticateToken, updateBookingStatus);
  app.delete("/api/bookings/:id", authenticateToken, deleteBooking);
  app.get("/api/bookings/stats", authenticateToken, getBookingStats);

  // Placeholder route for inquiries
  app.get("/api/inquiries", authenticateToken, (req, res) => {
    res.json({ success: true, data: [], message: "قريباً" });
  });

  return app;
}
