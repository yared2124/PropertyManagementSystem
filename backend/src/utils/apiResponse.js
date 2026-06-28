/**
 * Standard API response formatters.
 * Ensures consistent response structure across the application.
 */

/**
 * Success response wrapper.
 * @param {*} data - The data payload.
 * @param {string} message - Success message.
 * @param {number} statusCode - HTTP status code (default 200).
 * @returns {Object} Standard success response.
 */
export const successResponse = (
  data,
  message = "Success",
  statusCode = 200,
) => ({
  success: true,
  message,
  statusCode,
  data,
});

/**
 * Error response wrapper.
 * @param {string} message - Error message.
 * @param {number} statusCode - HTTP status code (default 400).
 * @param {Array} errors - Optional array of validation errors.
 * @returns {Object} Standard error response.
 */
export const errorResponse = (message, statusCode = 400, errors = null) => ({
  success: false,
  message,
  statusCode,
  ...(errors && { errors }),
});
