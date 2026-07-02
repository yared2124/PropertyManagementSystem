import Joi from "joi";

export const inspectionSchema = Joi.object({
  propertyId: Joi.string().uuid().required(),
  inspectorId: Joi.string().uuid().required(),
  inspectionDate: Joi.date().iso().required(),
  type: Joi.string()
    .valid("INITIAL", "ROUTINE", "EXIT", "MAINTENANCE")
    .required(),
  status: Joi.string()
    .valid("SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED")
    .default("SCHEDULED"),
  condition: Joi.string().valid("EXCELLENT", "GOOD", "FAIR", "POOR").optional(),
  findings: Joi.object().optional(),
  photos: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().optional(),
  recommendations: Joi.string().optional(),
});
