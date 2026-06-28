/**
 * Logger utility.
 * Simple wrapper around console with timestamps.
 * For production, use Winston or Pino instead.
 */

/**
 * Log an info message.
 * @param {string} message - The message to log.
 * @param {*} data - Optional data to include.
 */
export const logInfo = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] INFO: ${message}`);
  if (data) console.log(data);
};

/**
 * Log an error message.
 * @param {string} message - The error message.
 * @param {Error|*} error - Optional error object.
 */
export const logError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`);
  if (error) console.error(error);
};

/**
 * Log a warning message.
 * @param {string} message - The warning message.
 * @param {*} data - Optional data.
 */
export const logWarning = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] WARNING: ${message}`);
  if (data) console.warn(data);
};
