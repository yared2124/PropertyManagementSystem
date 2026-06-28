/**
 * Notification repository – extends BaseRepository with notification‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class NotificationRepository extends BaseRepository {
  constructor() {
    super(prisma.notification);
  }

  /**
   * Find all unread notifications for a user.
   * @param {string} userId - UUID of the user.
   * @returns {Promise<Array>} List of unread notifications.
   */
  async findUnreadByUser(userId) {
    return this.model.findMany({ where: { userId, read: false } });
  }
}

export default new NotificationRepository();
