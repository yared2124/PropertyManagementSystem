/**
 * Authentication controller – handles HTTP requests for auth endpoints.
 */

import authService from "../services/auth.service.js";
import { successResponse } from "../utils/apiResponse.js";
 // src/controllers/auth.controller.js
import { verifyAccessToken } from '../utils/jwt.js';

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res
        .status(201)
        .json(successResponse(user, "User registered successfully", 201));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(successResponse(result, "Login successful"));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.status(200).json(successResponse(result, "Token refreshed"));
    } catch (error) {
      next(error);
    }
  }

 

async verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) {
      throw new AppError('Verification token is required', 400);
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token); // reuse your JWT verify
    } catch (error) {
      throw new AppError('Invalid or expired token', 400);
    }

    // Find user and update emailVerified
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.emailVerified) {
      return res.status(200).json({ success: true, message: 'Email already verified' });
    }

    await userRepository.update(user.id, { emailVerified: true });

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
}

  async logout(req, res, next) {
    try {
      const userId = req.user.userId;
      await authService.logout(userId);
      res.status(200).json(successResponse(null, "Logged out successfully"));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
