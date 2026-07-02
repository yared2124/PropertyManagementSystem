import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { inspectionSchema } from "../validations/inspection.validation.js";
import inspectionController from "../controllers/inspection.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(inspectionSchema),
  inspectionController.create,
);
router.get("/", inspectionController.findAll);
router.get("/:id", inspectionController.findById);
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  inspectionController.update,
);
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN"]),
  inspectionController.delete,
);

export default router;
