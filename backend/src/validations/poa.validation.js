/**
 * Joi validation schema for Power of Attorney creation/update.
 */

import Joi from "joi";

export const poaSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  scope: Joi.string().valid("FULL", "LIMITED", "SPECIFIC").required(),
  grantorId: Joi.string().uuid().required(),
  granteeId: Joi.string().uuid().required(),
  assetType: Joi.string().valid("PROPERTY", "VEHICLE", "LAND").required(),
  assetId: Joi.string().uuid().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  notaryName: Joi.string().optional(),
  notaryNumber: Joi.string().optional(),
});
