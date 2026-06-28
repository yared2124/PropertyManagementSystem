/**
 * Global error handler middleware.
 * Logs the error and sends a consistent JSON error response.
 * In development, includes the stack trace.
 */

import logger from "../config/logger.js";

/**
 * Custom application error class.
 * Extends native Error with a statusCode property.
 */
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
