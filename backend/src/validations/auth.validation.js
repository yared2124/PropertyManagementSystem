/**
 * Joi validation schemas for authentication endpoints.
 */

import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string()
    .valid(
      "SYSTEM_ADMIN",
      "PROPERTY_MANAGER",
      "TENANT",
      "LANDLORD",
      "ACCOUNTANT",
      "LEGAL_ADMIN",
    )
    .optional(),
  phone: Joi.string().optional(),
  mobile: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
