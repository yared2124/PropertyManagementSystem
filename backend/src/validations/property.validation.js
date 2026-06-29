/**
 * Joi validation schema for property creation/update.
 */

import Joi from "joi";

export const propertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  assetType: Joi.string()
    .valid(
      "APARTMENT",
      "OFFICE",
      "VILLA",
      "WAREHOUSE",
      "LAND",
      "COMMERCIAL_SPACE",
      "RESIDENTIAL_COMPLEX",
    )
    .required(),
  area: Joi.number().positive().required(),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().positive().optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  marketValue: Joi.number().positive().required(),
  rentalRate: Joi.number().positive().required(),
  ownerId: Joi.string().uuid().required(),
  managerId: Joi.string().uuid().optional(),
});
