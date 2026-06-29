/**
 * Notification controller – get unread notifications and mark as read.
 */

import notificationService from "../services/notification.service.js";
import { successResponse } from "../utils/apiResponse.js";

class NotificationController {
  async getUnread(req, res, next) {
    try {
      const notifications = await notificationService.getUnreadByUser(
        req.user.userId,
      );
      res.status(200).json(successResponse(notifications));
    } catch (error) {
      next(error);
    }
  }

  async markRead(req, res, next) {
    try {
      const result = await notificationService.markAsRead(req.params.id);
      res.status(200).json(successResponse(result, "Marked as read"));
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
