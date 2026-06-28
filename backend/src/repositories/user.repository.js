/**
 * User repository – extends BaseRepository with user‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(prisma.user);
  }

  /**
   * Find a user by email (unique).
   * @param {string} email - The user's email address.
   * @returns {Promise<Object|null>} User object or null.
   */
  async findByEmail(email) {
    return this.model.findUnique({ where: { email } });
  }

  /**
   * Find a user by national ID (unique).
   * @param {string} nationalId - The user's national ID.
   * @returns {Promise<Object|null>} User object or null.
   */
  async findByNationalId(nationalId) {
    return this.model.findUnique({ where: { nationalId } });
  }

  /**
   * Update the refresh token for a user.
   * @param {string} userId - UUID of the user.
   * @param {string} refreshToken - New refresh token.
   * @returns {Promise<Object>} Updated user.
   */
  async updateRefreshToken(userId, refreshToken) {
    return this.model.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  /**
   * Clear the refresh token (logout).
   * @param {string} userId - UUID of the user.
   * @returns {Promise<Object>} Updated user.
   */
  async clearRefreshToken(userId) {
    return this.model.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}

export default new UserRepository();
