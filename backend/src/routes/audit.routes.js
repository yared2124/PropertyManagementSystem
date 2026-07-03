import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import auditController from "../controllers/audit.controller.js";

const router = express.Router();
router.use(authenticate);
router.use(requireRole(["SYSTEM_ADMIN"]));

router.get("/", auditController.findAll);
router.get("/:id", auditController.findById);

export default router;
