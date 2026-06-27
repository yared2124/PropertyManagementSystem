/**
 * Multer configuration for file uploads.
 * Defines storage location, file naming, and file type validation.
 * Uses UUID for unique filenames to avoid collisions.
 */

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"; // <-- Added missing import

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";
    if (req.path.includes("property")) folder += "properties/";
    else if (req.path.includes("vehicle")) folder += "vehicles/";
    else if (req.path.includes("contract")) folder += "contracts/";
    else if (req.path.includes("poa")) folder += "poa/";
    else if (req.path.includes("profile")) folder += "profiles/";
    else folder += "misc/";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// File filter: only allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext) || allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Unsupported file type. Only JPEG, PNG, and PDF are allowed."),
      false,
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
