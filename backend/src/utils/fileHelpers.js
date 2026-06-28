/**
 * File system utilities.
 */

import fs from "fs";
import path from "path";

/**
 * Delete a file from the filesystem.
 * @param {string} filePath - Absolute or relative path to the file.
 */
export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Get the file extension from a filename.
 * @param {string} filename - The filename.
 * @returns {string} File extension (e.g., '.pdf').
 */
export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Generate a unique filename.
 * @param {string} originalName - Original filename.
 * @param {string} prefix - Optional prefix.
 * @returns {string} Unique filename.
 */
export const generateUniqueFilename = (originalName, prefix = "") => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = getFileExtension(originalName);
  const baseName = path.basename(originalName, ext);
  return `${prefix}${baseName}-${timestamp}-${random}${ext}`;
};
