import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { paymentSchema } from "../validations/payment.validation.js";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"]),
  validate(paymentSchema),
  paymentController.process,
);
router.get("/", paymentController.findAll);
router.get("/:id", paymentController.findById);
router.post(
  "/:id/refund",
  requireRole(["SYSTEM_ADMIN", "ACCOUNTANT"]),
  paymentController.refund,
);

export default router;
