import express from "express";
import { authenticate} from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import reportController from "../controllers/report.controller.js";

const router = express.Router();

router.use(authenticate);

router.get(
  "/revenue",
  requireRole(["SYSTEM_ADMIN", "ACCOUNTANT"]),
  reportController.getRevenue,
);
router.get(
  "/contracts",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"]),
  reportController.getContracts,
);
router.get(
  "/maintenance",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  reportController.getMaintenance,
);
router.get(
  "/occupancy",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  reportController.getOccupancy,
);
router.get(
  "/users",
  requireRole(["SYSTEM_ADMIN"]),
  reportController.getUsers,
);
router.get(
  "/dashboard-summary",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"]),
  reportController.getDashboardSummary,
);
router.get(
  "/profit-loss",
  requireRole(["SYSTEM_ADMIN", "ACCOUNTANT"]),
  reportController.getProfitLoss,
);
router.get(
  "/occupancy-analytics",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  reportController.getOccupancyAnalytics,
);
router.get(
  "/revenue/csv",
  requireRole(["SYSTEM_ADMIN", "ACCOUNTANT"]),
  reportController.exportRevenueCSV,
);
export default router;
