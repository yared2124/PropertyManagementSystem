import express from "express";
import { authenticate} from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { maintenanceSchema } from "../validations/maintenance.validation.js";
import maintenanceController from "../controllers/maintenance.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT"]),
  validate(maintenanceSchema),
  maintenanceController.create,
);
router.get(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD"]),
  maintenanceController.findAll,
);
router.get(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD"]),
  maintenanceController.findById,
);
router.put(
  "/:id/status",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  maintenanceController.updateStatus,
);
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  maintenanceController.delete,
);

export default router;
