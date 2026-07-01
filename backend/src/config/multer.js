/**
 * Multer configuration for file uploads.
 * Defines storage location, file naming, file type validation,
 * and automatically creates destination directories.
 * Updated to correctly detect route using baseUrl + path.
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

// ============================================
// 1. Helpers
// ============================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Ensure a directory exists; create it recursively if needed.
 * @param {string} dir - Directory path.
 */
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ============================================
// 2. Storage Configuration
// ============================================

const storage = multer.diskStorage({
  /**
   * Determine the destination folder based on the full request path.
   * Uses req.baseUrl + req.path to capture the entire route.
   * @param {Object} req - Express request object.
   * @param {Object} file - Multer file object.
   * @param {Function} cb - Callback function.
   */
  destination: (req, file, cb) => {
    // Build full path from baseUrl and route path
    const fullPath = (req.baseUrl + req.path).toLowerCase();
    // Optional debug: console.log('📁 Full upload path:', fullPath);

    let folder = "uploads/";

    // Check for specific route segments
    if (fullPath.includes("properties") || fullPath.includes("property")) {
      folder += "properties/";
    } else if (fullPath.includes("vehicles") || fullPath.includes("vehicle")) {
      folder += "vehicles/";
    } else if (
      fullPath.includes("contracts") ||
      fullPath.includes("contract")
    ) {
      folder += "contracts/";
    } else if (fullPath.includes("poa") || fullPath.includes("power")) {
      folder += "poa/";
    } else if (fullPath.includes("profile")) {
      folder += "profiles/";
    } else if (fullPath.includes("invoice")) {
      folder += "invoices/";
    } else {
      folder += "misc/";
    }

    // Ensure the folder exists before saving
    ensureDirectoryExists(folder);
    cb(null, folder);
  },

  /**
   * Generate a unique filename using UUID + original extension.
   * @param {Object} req - Express request object.
   * @param {Object} file - Multer file object.
   * @param {Function} cb - Callback function.
   */
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// ============================================
// 3. File Filter (Allowed Types)
// ============================================

const fileFilter = (req, file, cb) => {
  // Allowed MIME types and extensions
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx|txt/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  if (allowedTypes.test(ext) || allowedTypes.test(mimeType)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Allowed: JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX, TXT.",
      ),
      false,
    );
  }
};

// ============================================
// 4. Multer Instance
// ============================================

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

// ============================================
// 5. Convenience Middleware Wrappers
// ============================================

/**
 * Middleware for single file upload (field name: "file").
 * @param {string} fieldName - Name of the file field in the form-data.
 * @returns {Function} Multer middleware.
 */
export const uploadSingle = (fieldName = "file") => upload.single(fieldName);

/**
 * Middleware for multiple file uploads (field name: "files").
 * @param {string} fieldName - Name of the file field in the form-data.
 * @param {number} maxCount - Maximum number of files.
 * @returns {Function} Multer middleware.
 */
export const uploadMultiple = (fieldName = "files", maxCount = 5) =>
  upload.array(fieldName, maxCount);

/**
 * Middleware for multiple fields (e.g., images, documents).
 * @param {Array} fields - Array of { name, maxCount } objects.
 * @returns {Function} Multer middleware.
 */
export const uploadFields = (fields) => upload.fields(fields);

// ============================================
// 6. Default Export (optional)
// ============================================

export default upload;
