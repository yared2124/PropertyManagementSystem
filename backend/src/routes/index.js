/**
 * Main router – mounts all feature route modules.
 */

import express from "express";
import authRoutes from "./auth.routes.js";
import propertyRoutes from "./property.routes.js";
import vehicleRoutes from "./vehicle.routes.js";
import contractRoutes from "./contract.routes.js";
import paymentRoutes from "./payment.routes.js";
import poaRoutes from "./poa.routes.js";
import maintenanceRoutes from "./maintenance.routes.js";
import documentRoutes from "./document.routes.js";
import notificationRoutes from "./notification.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import reportRoutes from "./report.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/contracts", contractRoutes);
router.use("/payments", paymentRoutes);
router.use("/poa", poaRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
router.use("/users", userRoutes);

export default router;
