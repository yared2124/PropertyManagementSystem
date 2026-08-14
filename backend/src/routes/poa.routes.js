import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { poaSchema } from "../validations/poa.validation.js";
import poaController from "../controllers/poa.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LEGAL_ADMIN"]),
  validate(poaSchema),
  poaController.create,
);
router.get(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LEGAL_ADMIN"]),
  poaController.findAll,
);
router.get(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LEGAL_ADMIN"]),
  poaController.findById,
);
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LEGAL_ADMIN"]),
  poaController.update,
);
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LEGAL_ADMIN"]),
  poaController.delete,
);

export default router;
