/**
 * Authentication middleware.
 * Verifies JWT access token from the Authorization header.
 * Attaches decoded user (userId, role) to req.user for downstream use.
 */

import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "./errorHandler.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
