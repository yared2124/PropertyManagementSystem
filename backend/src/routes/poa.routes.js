import express from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
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
router.get("/", poaController.findAll);
router.get("/:id", poaController.findById);
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LEGAL_ADMIN"]),
  poaController.update,
);
router.delete("/:id", requireRole(["SYSTEM_ADMIN"]), poaController.delete);

export default router;
