/**
 * Authentication controller – handles HTTP requests for auth endpoints.
 */

import authService from "../services/auth.service.js";
import { successResponse } from "../utils/apiResponse.js";

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
