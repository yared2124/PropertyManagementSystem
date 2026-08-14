import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { auditLog } from "../middlewares/auditLogger.js";
import { vehicleSchema } from "../validations/vehicle.validation.js";
import vehicleController from "../controllers/vehicle.controller.js";

const router = express.Router();

router.use(authenticate);

// --- Create vehicle ---
router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(vehicleSchema),
  auditLog("CREATE"),
  vehicleController.create,
);

// --- List vehicles ---
router.get(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD"]),
  vehicleController.findAll,
);

// --- Get vehicle by ID ---
router.get(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD"]),
  vehicleController.findById,
);

// --- Update vehicle ---
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  auditLog("UPDATE"),
  vehicleController.update,
);

// --- Delete vehicle ---
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  auditLog("DELETE"),
  vehicleController.delete,
);

export default router;
