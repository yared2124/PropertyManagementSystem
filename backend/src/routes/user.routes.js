import express from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import {
  updateProfileSchema,
  changePasswordSchema,
  userIdParamSchema,
  userFilterSchema,
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User profile routes (self)
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

// Admin routes
router.use(requireRole(["SYSTEM_ADMIN"]));
router.get("/", validate(userFilterSchema, "query"), userController.list);
router.get(
  "/:id",
  validate(userIdParamSchema, "params"),
  userController.getById,
);
router.post("/", validate(createUserSchema), userController.create);
router.put(
  "/:id",
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  userController.update,
);
router.delete(
  "/:id",
  validate(userIdParamSchema, "params"),
  userController.delete,
);

export default router;
