import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/overview",
  authenticate,
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"]),
  dashboardController.getOverview,
);

export default router;
