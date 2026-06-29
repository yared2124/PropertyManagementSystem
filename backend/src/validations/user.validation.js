/**
 * Joi validation schemas for user management endpoints.
 * Includes validation for user creation, updates, password changes, and profile updates.
 */

import Joi from "joi";

// =============================================
// 1. User Profile Update Schema
// =============================================

/**
 * Schema for updating user profile information.
 * All fields are optional since it's a partial update.
 */
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional(),
  mobile: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  postalCode: Joi.string().max(20).optional(),
  dateOfBirth: Joi.date().iso().optional(),
  preferredLanguage: Joi.string().valid("en", "ar", "fr").default("en"),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
  }).optional(),
});

// =============================================
// 2. Admin User Creation Schema
// =============================================

/**
 * Schema for creating a new user (admin only).
 * All fields are required.
 */
export const createUserSchema = Joi.object({
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
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional(),
  mobile: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional(),
  nationalId: Joi.string().max(50).optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  postalCode: Joi.string().max(20).optional(),
});

// =============================================
// 3. Admin User Update Schema
// =============================================

/**
 * Schema for updating a user (admin only).
 * All fields are optional.
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
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
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional(),
  mobile: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  postalCode: Joi.string().max(20).optional(),
  isActive: Joi.boolean().optional(),
});

// =============================================
// 4. Change Password Schema
// =============================================

/**
 * Schema for changing user password.
 * Requires current password verification.
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
    }),
});

// =============================================
// 5. Admin Change Password Schema (without current password)
// =============================================

/**
 * Schema for admin to change a user's password.
 * No current password required.
 */
export const adminChangePasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
    }),
});

// =============================================
// 6. User ID Parameter Schema
// =============================================

/**
 * Schema for validating user ID in URL params.
 */
export const userIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

// =============================================
// 7. User Filter Query Schema
// =============================================

/**
 * Schema for filtering users in list queries.
 */
export const userFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional(),
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
  isActive: Joi.boolean().optional(),
  city: Joi.string().optional(),
});

// =============================================
// 8. Forgot Password Schema
// =============================================

/**
 * Schema for requesting password reset.
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// =============================================
// 9. Reset Password Schema
// =============================================

/**
 * Schema for resetting password with token.
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
    }),
});
