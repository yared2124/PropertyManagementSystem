import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { auditLog } from "../middlewares/auditLogger.js";
import { inspectionSchema } from "../validations/inspection.validation.js";
import inspectionController from "../controllers/inspection.controller.js";

const router = express.Router();

router.use(authenticate);

// --- Create inspection ---
router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(inspectionSchema),
  auditLog("CREATE"),
  inspectionController.create,
);

// --- List inspections (with filters) ---
router.get("/", inspectionController.findAll);

// --- Get inspection by ID ---
router.get("/:id", inspectionController.findById);

// --- Update inspection ---
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  auditLog("UPDATE"),
  inspectionController.update,
);

// --- Delete inspection ---
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN"]),
  auditLog("DELETE"),
  inspectionController.delete,
);

export default router;
