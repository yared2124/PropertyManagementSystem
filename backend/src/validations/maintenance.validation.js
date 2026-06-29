/**
 * Joi validation schema for maintenance request creation/update.
 */

import Joi from "joi";

export const maintenanceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  priority: Joi.string()
    .valid("LOW", "MEDIUM", "HIGH", "URGENT", "CRITICAL")
    .default("MEDIUM"),
  assetType: Joi.string().valid("PROPERTY", "VEHICLE", "LAND").required(),
  assetId: Joi.string().uuid().required(),
  reportedById: Joi.string().uuid().required(),
  assignedToId: Joi.string().uuid().optional(),
  estimatedCost: Joi.number().positive().optional(),
});
