/**
 * Password hashing and comparison utilities using bcrypt.
 */

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a plain‑text password.
 * @param {string} plainPassword - The password to hash.
 * @returns {Promise<string>} Hashed password.
 */
export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain‑text password with a hashed password.
 * @param {string} plainPassword - The plain password.
 * @param {string} hashedPassword - The stored hash.
 * @returns {Promise<boolean>} True if they match, false otherwise.
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
