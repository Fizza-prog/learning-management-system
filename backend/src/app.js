/**
 * @file app.js
 * @description Configures and starts the Express API server.
 *
 * Responsibilities:
 * - Register middleware and resource route modules.
 * - Connect the database and listen on the configured port.
 */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import notFound from "./middleware/notFoundMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";
import "./models/index.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use(
  "/api/support",
  supportRoutes
);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);


// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();