import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import {
  updateProfileSchema,
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  userFilterSchema,
} from "../validations/user.validation.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ===== Self-service routes =====
router.get("/profile", userController.getProfile);
router.put(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile,
);
router.post(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword,
);

// ===== User directory: admin can manage, manager can view =====
router.get(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(userFilterSchema, "query"),
  userController.list,
);
router.get(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(userIdParamSchema, "params"),
  userController.getById,
);
router.post(
  "/",
  requireRole(["SYSTEM_ADMIN"]),
  validate(createUserSchema),
  userController.create,
);
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN"]),
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  userController.update,
);
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN"]),
  validate(userIdParamSchema, "params"),
  userController.delete,
);

export default router;
