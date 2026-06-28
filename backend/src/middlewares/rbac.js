/**
 * Role‑Based Access Control (RBAC) middleware.
 * Checks if the authenticated user's role is allowed to access the route.
 * Must be used after authenticate.
 */

import { AppError } from "./errorHandler.js";

/**
 * Create a middleware that requires the user to have one of the specified roles.
 * @param {string[]} roles - Array of allowed roles (e.g., ['SYSTEM_ADMIN', 'PROPERTY_MANAGER']).
 * @returns {Function} Express middleware.
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403));
    }
    next();
  };
};
