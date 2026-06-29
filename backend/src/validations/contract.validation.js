/**
 * Joi validation schema for contract creation/update.
 */

import Joi from "joi";

export const contractSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  assetType: Joi.string().valid("PROPERTY", "VEHICLE", "LAND").required(),
  assetId: Joi.string().uuid().required(),
  tenantId: Joi.string().uuid().required(),
  landlordId: Joi.string().uuid().required(),
  managerId: Joi.string().uuid().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  monthlyRent: Joi.number().positive().required(),
  securityDeposit: Joi.number().positive().required(),
  latePaymentPenalty: Joi.number().min(0).default(0),
  paymentFrequency: Joi.string()
    .valid("MONTHLY", "QUARTERLY", "ANNUALLY")
    .default("MONTHLY"),
  paymentDay: Joi.number().integer().min(1).max(31).optional(),
});
