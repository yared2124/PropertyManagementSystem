/**
 * Authentication service – handles registration, login, token refresh, and logout.
 * Uses repositories and utility functions.
 * Throws AppError for business rule violations.
 */

import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import userRepository from "../repositories/user.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class AuthService {
  /**
   * Register a new user.
   * @param {Object} userData - User registration data.
   * @returns {Promise<Object>} Created user (without password).
   */
  async register(userData) {
    const { email, password, firstName, lastName, role, ...rest } = userData;

    // Check if email already exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email already registered", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || "TENANT",
      ...rest,
    });

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login a user.
   * @param {string} email - User's email.
   * @param {string} password - Plain password.
   * @returns {Promise<Object>} { user (without password), accessToken, refreshToken }.
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in DB
    await userRepository.updateRefreshToken(user.id, refreshToken);

    // Remove password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh an expired access token using a valid refresh token.
   * @param {string} oldRefreshToken - The refresh token sent by the client.
   * @returns {Promise<Object>} New accessToken and refreshToken.
   */
  async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw new AppError("Refresh token required", 401);
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // Update refresh token in DB
    await userRepository.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout – clear the refresh token from the database.
   * @param {string} userId - UUID of the logged‑in user.
   * @returns {Promise<Object>} Confirmation message.
   */
  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
    return { message: "Logged out successfully" };
  }
}

export default new AuthService();
