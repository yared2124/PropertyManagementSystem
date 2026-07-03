import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validation.js";
import { uploadSingle } from "../middlewares/upload.js";
import { auditLog } from "../middlewares/auditLogger.js"; // ✅ import audit logger
import { propertySchema } from "../validations/property.validation.js";
import propertyController from "../controllers/property.controller.js";

const router = express.Router();

// ============================================
// All property routes require authentication
// ============================================
router.use(authenticate);

// ============================================
// Create a new property
// ============================================
router.post(
  "/",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  validate(propertySchema),
  auditLog("CREATE"),
  propertyController.create,
);

// ============================================
// List properties (with optional filters)
// ============================================
router.get("/", propertyController.findAll);

// ============================================
// Get a single property by ID
// ============================================
router.get("/:id", propertyController.findById);

// ============================================
// Update a property
// ============================================
router.put(
  "/:id",
  requireRole(["SYSTEM_ADMIN", "PROPERTY_MANAGER"]),
  auditLog("UPDATE"), // ✅ log update action
  propertyController.update,
);

// ============================================
// Delete a property (soft delete)
// ============================================
router.delete(
  "/:id",
  requireRole(["SYSTEM_ADMIN"]),
  auditLog("DELETE"), // ✅ log delete action
  propertyController.delete,
);

// ============================================
// Upload an image for a property
// ============================================
router.post(
  "/:id/images",
  uploadSingle("image"),
  auditLog("UPLOAD_IMAGE"), // ✅ log image upload
  propertyController.uploadImage,
);

// ============================================
// (Optional) Get all images for a property
// ============================================
router.get("/:id/images", propertyController.getImages);

export default router;
