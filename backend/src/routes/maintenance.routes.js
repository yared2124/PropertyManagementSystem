import express from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { maintenanceSchema } from "../validations/maintenance.validation.js";
import maintenanceController from "../controllers/maintenance.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(maintenanceSchema), maintenanceController.create);
router.get("/", maintenanceController.findAll);
router.get("/:id", maintenanceController.findById);
router.put(
  "/:id/status",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  maintenanceController.updateStatus,
);
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN"]),
  maintenanceController.delete,
);

export default router;
