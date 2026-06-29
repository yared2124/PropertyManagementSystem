/**
 * User Service – manages user profiles and admin user management.
 * Includes self-profile updates, password changes, and admin CRUD operations.
 * Uses userRepository and bcrypt for password hashing.
 */

import userRepository from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { AppError } from "../middlewares/errorHandler.js";

class UserService {
  // =============================================
  // 1. Self-service methods (for the logged-in user)
  // =============================================

  /**
   * Get the profile of the currently logged-in user.
   * @param {string} userId - UUID of the user.
   * @returns {Promise<Object>} User object without password.
   * @throws {AppError} If user not found.
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found", 404);
    }
    const { password, refreshToken, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  }

  /**
   * Update the profile of the currently logged-in user.
   * @param {string} userId - UUID of the user.
   * @param {Object} data - Fields to update (firstName, lastName, phone, mobile, address, etc.)
   * @returns {Promise<Object>} Updated user without password.
   * @throws {AppError} If user not found or email conflict (if email update allowed).
   */
  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found", 404);
    }

    // If email is being updated, check uniqueness
    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new AppError("Email already in use", 400);
      }
    }

    const updated = await userRepository.update(userId, data);
    const { password, refreshToken, ...userWithoutSensitive } = updated;
    return userWithoutSensitive;
  }

  /**
   * Change the user's password by verifying current password.
   * @param {string} userId - UUID of the user.
   * @param {string} currentPassword - The current plain password.
   * @param {string} newPassword - The new plain password.
   * @returns {Promise<Object>} Success message.
   * @throws {AppError} If current password is incorrect.
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);
    await userRepository.update(userId, { password: hashedPassword });

    return { message: "Password changed successfully" };
  }

  // =============================================
  // 2. Admin CRUD methods
  // =============================================

  /**
   * List all users with optional filters and pagination.
   * @param {Object} filters - { page, limit, search, role, isActive, city }
   * @returns {Promise<Object>} { users, total, page, totalPages }.
   */
  async listUsers(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = { deletedAt: null };
    if (filters.role) where.role = filters.role;
    if (filters.isActive !== undefined)
      where.isActive = filters.isActive === "true";
    if (filters.city) where.city = filters.city;

    // Search across name, email, phone
    if (filters.search) {
      const searchTerm = filters.search.trim();
      where.OR = [
        { firstName: { contains: searchTerm, mode: "insensitive" } },
        { lastName: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      userRepository.findAll(where, {
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      userRepository.model.count({ where }),
    ]);

    // Remove sensitive fields
    const sanitizedUsers = users.map(
      ({ password, refreshToken, ...rest }) => rest,
    );

    return {
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single user by ID (admin).
   * @param {string} userId - UUID of the user.
   * @returns {Promise<Object>} User object without sensitive fields.
   * @throws {AppError} If user not found.
   */
  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found", 404);
    }
    const { password, refreshToken, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  }

  /**
   * Create a new user (admin only).
   * @param {Object} data - User data (email, password, firstName, lastName, role, etc.)
   * @returns {Promise<Object>} Created user without password.
   * @throws {AppError} If email already exists.
   */
  async createUser(data) {
    // Check if email already exists
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("Email already registered", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const { password, refreshToken, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  }

  /**
   * Update a user (admin only).
   * @param {string} userId - UUID of the user.
   * @param {Object} data - Fields to update.
   * @returns {Promise<Object>} Updated user without password.
   * @throws {AppError} If user not found or email conflict.
   */
  async updateUser(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found", 404);
    }

    // If email is being updated, check uniqueness
    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new AppError("Email already in use", 400);
      }
    }

    // If password is being updated, hash it
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const updated = await userRepository.update(userId, data);
    const { password, refreshToken, ...userWithoutSensitive } = updated;
    return userWithoutSensitive;
  }

  /**
   * Soft delete a user (admin only).
   * @param {string} userId - UUID of the user.
   * @returns {Promise<Object>} Deleted user metadata.
   * @throws {AppError} If user not found.
   */
  async deleteUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new AppError("User not found", 404);
    }
    await userRepository.softDelete(userId);
    return { id: userId, message: "User deleted successfully" };
  }
}

export default new UserService();
