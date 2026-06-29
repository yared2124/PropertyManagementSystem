import express from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { vehicleSchema } from "../validations/vehicle.validation.js";
import vehicleController from "../controllers/vehicle.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(vehicleSchema),
  vehicleController.create,
);
router.get("/", vehicleController.findAll);
router.get("/:id", vehicleController.findById);
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  vehicleController.update,
);
router.delete("/:id", requireRole(["SYSTEM_ADMIN"]), vehicleController.delete);

export default router;
