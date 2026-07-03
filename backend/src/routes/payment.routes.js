import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { auditLog } from "../middlewares/auditLogger.js";
import { paymentSchema } from "../validations/payment.validation.js";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.use(authenticate);

// --- Create Stripe payment intent (audited) ---
router.post(
  "/create-intent",
  auditLog("CREATE_INTENT"),
  paymentController.createStripeIntent,
);

// --- Process a payment (manual) ---
router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"]),
  validate(paymentSchema),
  auditLog("CREATE"),
  paymentController.process,
);

// --- List payments ---
router.get("/", paymentController.findAll);

// --- Get payment by ID ---
router.get("/:id", paymentController.findById);

// --- Refund a payment ---
router.post(
  "/:id/refund",
  requireRole(["SYSTEM_ADMIN", "ACCOUNTANT"]),
  auditLog("REFUND"),
  paymentController.refund,
);

export default router;
