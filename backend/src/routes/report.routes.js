import express from "express";
import { authenticate} from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import reportController from "../controllers/report.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(requireRole(["SYSTEM_ADMIN", "ACCOUNTANT"]));

router.get("/revenue", reportController.getRevenue);
router.get("/contracts", reportController.getContracts);
router.get("/maintenance", reportController.getMaintenance);
router.get("/occupancy", reportController.getOccupancy);
router.get("/users", reportController.getUsers);
router.get("/dashboard-summary", reportController.getDashboardSummary);

export default router;
