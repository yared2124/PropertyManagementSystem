/**
 * Joi validation schema for vehicle creation/update.
 */

import Joi from "joi";

export const vehicleSchema = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required(),
  vin: Joi.string().length(17).required(),
  licensePlate: Joi.string().required(),
  dailyRate: Joi.number().positive().required(),
  monthlyRate: Joi.number().positive().required(),
  purchasePrice: Joi.number().positive().required(),
  ownerId: Joi.string().uuid().required(),
});
