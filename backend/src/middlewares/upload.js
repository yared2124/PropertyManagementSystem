/**
 * Multer upload middleware wrapper.
 * Simplifies usage of single and multiple file uploads.
 */

import { upload } from "../config/multer.js";

export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);
