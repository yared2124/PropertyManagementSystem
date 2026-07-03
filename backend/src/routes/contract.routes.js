import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { auditLog } from "../middlewares/auditLogger.js";
import { contractSchema } from "../validations/contract.validation.js";
import contractController from "../controllers/contract.controller.js";

const router = express.Router();

// All contract routes require authentication
router.use(authenticate);

// --- Create contract ---
router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(contractSchema),
  auditLog("CREATE"),
  contractController.create,
);

// --- List contracts (optional filters) ---
router.get("/", contractController.findAll);

// --- Get contract by ID ---
router.get("/:id", contractController.findById);

// --- Update contract ---
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  auditLog("UPDATE"),
  contractController.update,
);

// --- Delete contract (soft delete) ---
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN"]),
  auditLog("DELETE"),
  contractController.delete,
);

export default router;
