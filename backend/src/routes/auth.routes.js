/**
 * Authentication routes – public endpoints for login, register, refresh.
 */

import express from "express";
import { validate } from "../middlewares/validation.js";
import { authenticate } from "../middlewares/auth.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/auth.validation.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),

  
  authController.refreshToken,
);
router.post("/logout", authenticate, authController.logout);

export default router;
