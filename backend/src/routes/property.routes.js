import express from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { propertySchema } from "../validations/property.validation.js";
import propertyController from "../controllers/property.controller.js";

const router = express.Router();

// All property routes require authentication
router.use(authenticate);

router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(propertySchema),
  propertyController.create,
);
router.get("/", propertyController.findAll);
router.get("/:id", propertyController.findById);
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  propertyController.update,
);
router.delete("/:id", requireRole(["SYSTEM_ADMIN"]), propertyController.delete);

export default router;
