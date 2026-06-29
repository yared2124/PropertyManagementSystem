import express from "express";
import { authenticate } from "../middlewares/auth.js";
import notificationController from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/unread", notificationController.getUnread);
router.put("/:id/read", notificationController.markRead);

export default router;
