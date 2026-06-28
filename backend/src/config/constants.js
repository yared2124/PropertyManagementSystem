/**
 * Application‑wide constants.
 * Includes user roles, contract statuses, payment statuses, and asset types.
 * Using these constants ensures consistency and prevents magic strings.
 */

export const USER_ROLES = {
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  PROPERTY_MANAGER: "PROPERTY_MANAGER",
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
  ACCOUNTANT: "ACCOUNTANT",
  LEGAL_ADMIN: "LEGAL_ADMIN",
};

export const CONTRACT_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  TERMINATED: "TERMINATED",
  RENEWED: "RENEWED",
  CANCELLED: "CANCELLED",
  UNDER_REVIEW: "UNDER_REVIEW",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
};

export const ASSET_TYPES = {
  PROPERTY: "PROPERTY",
  VEHICLE: "VEHICLE",
  LAND: "LAND",
};
