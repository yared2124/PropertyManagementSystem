/**
 * Request validation middleware using Joi.
 * Validates the request body against a Joi schema.
 * Returns a 400 error with detailed validation messages if validation fails.
 */

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ success: false, errors });
    }
    next();
  };
};
