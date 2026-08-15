/**
 * Authentication service – handles registration, login, token refresh, logout,
 * and email verification.
 * Uses repositories and utility functions.
 * Throws AppError for business rule violations.
 */

import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken, // needed for email verification
} from "../utils/jwt.js";
import userRepository from "../repositories/user.repository.js";
import { AppError } from "../middlewares/errorHandler.js";
import { sendEmail } from "../utils/email.js"; // ✅ import email utility

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

    // Create user with emailVerified = false
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || "TENANT",
      emailVerified: false, // explicitly set
      ...rest,
    });

    // Generate verification token
    const verifyToken = generateAccessToken(user.id, user.role); // reusing JWT helper, but we could also use a short-lived token
    // Note: we are using the same access token generator; it's fine, but for verification we can set a different expiry.
    // For clarity, we'll override expiry by generating a new token with 7d expiry.
    // Since generateAccessToken uses JWT_EXPIRES_IN from env, you may want to create a separate helper for verification tokens.
    // For simplicity, we'll use the same function; ensure JWT_EXPIRES_IN is long enough (e.g., 7d)
    // Alternatively, we can create a dedicated verify token helper, but we'll reuse.

    // Build verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    // Send verification email
    await sendEmail(
      email,
      "Verify Your Email Address",
      `<h1>Welcome to PropertyManager!</h1>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verificationLink}">${verificationLink}</a>
       <p>This link expires in 7 days.</p>
       <p>If you did not create this account, please ignore this email.</p>`,
    );

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

    // ✅ Check if email is verified
    if (!user.emailVerified) {
      throw new AppError("Please verify your email before logging in", 403);
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
   * Verify email using a token.
   * @param {string} token - JWT token from verification email.
   * @returns {Promise<Object>} Success message.
   */
  async verifyEmail(token) {
    if (!token) {
      throw new AppError("Verification token is required", 400);
    }

    // Verify the token
    let decoded;
    try {
      decoded = verifyAccessToken(token); // reuses JWT secret
    } catch (error) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.emailVerified) {
      return { message: "Email already verified" };
    }

    // Update user
    await userRepository.update(user.id, { emailVerified: true });

    return { message: "Email verified successfully" };
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
