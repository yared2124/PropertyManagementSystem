/**
 * Notification service – manages user notifications.
 */

import notificationRepository from "../repositories/notification.repository.js";

class NotificationService {
  async create(data) {
    return notificationRepository.create(data);
  }

  async markAsRead(notificationId) {
    return notificationRepository.update(notificationId, {
      read: true,
      readAt: new Date(),
    });
  }

  async getUnreadByUser(userId) {
    return notificationRepository.findUnreadByUser(userId);
  }
}

export default new NotificationService();
