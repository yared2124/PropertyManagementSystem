import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import auditController from "../controllers/audit.controller.js";
import auditService from "../services/audit.service.js"; // ✅ import service

const router = express.Router();

// All audit routes require authentication and admin role.
router.use(authenticate);
router.use(requireRole(["SYSTEM_ADMIN"]));

// --- Existing routes ---
router.get("/", auditController.findAll);
router.get("/:id", auditController.findById);

// --- Test route (for manual log creation) ---
router.post("/test", async (req, res, next) => {
  try {
    const log = await auditService.logAction({
      userId: req.user.userId,
      action: "TEST_ACTION",
      entityType: "Test",
      entityId: "test-123",
      changes: { message: "Test log entry" },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
});

export default router;
