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
