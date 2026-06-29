import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { contractSchema } from "../validations/contract.validation.js";
import contractController from "../controllers/contract.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(contractSchema),
  contractController.create,
);
router.get("/", contractController.findAll);
router.get("/:id", contractController.findById);
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  contractController.update,
);
router.delete("/:id", requireRole(["SYSTEM_ADMIN"]), contractController.delete);

export default router;
