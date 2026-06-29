/**
 * User Controller – handles HTTP requests for user management.
 */

import userService from "../services/user.service.js";
import { successResponse } from "../utils/apiResponse.js";

class UserController {
  // ===== Self-service endpoints =====
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.userId);
      res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.userId, req.body);
      res.status(200).json(successResponse(user, "Profile updated"));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword,
      );
      res.status(200).json(successResponse(result, "Password changed"));
    } catch (error) {
      next(error);
    }
  }

  // ===== Admin endpoints =====
  async list(req, res, next) {
    try {
      const result = await userService.listUsers(req.query);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(successResponse(user, "User created", 201));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(successResponse(user, "User updated"));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.status(200).json(successResponse(result, "User deleted"));
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
