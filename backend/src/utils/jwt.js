/**
 * JWT (JSON Web Token) helpers.
 * Provides functions to generate and verify access and refresh tokens.
 * Uses secrets from environment variables.
 */

import jwt from "jsonwebtoken";

/**
 * Generate a short-lived access token.
 * @param {string} userId - The user's UUID.
 * @param {string} role - The user's role.
 * @returns {string} JWT access token.
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

/**
 * Generate a long-lived refresh token.
 * @param {string} userId - The user's UUID.
 * @returns {string} JWT refresh token.
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

/**
 * Verify an access token.
 * @param {string} token - The JWT to verify.
 * @returns {Object} Decoded payload.
 * @throws {Error} If token is invalid or expired.
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify a refresh token.
 * @param {string} token - The JWT to verify.
 * @returns {Object} Decoded payload.
 * @throws {Error} If token is invalid or expired.
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
