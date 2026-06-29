/**
 * Joi validation schema for payment processing.
 */

import Joi from "joi";

export const paymentSchema = Joi.object({
  contractId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string()
    .valid(
      "BANK_TRANSFER",
      "ONLINE_PAYMENT",
      "CASH",
      "CHECK",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "WALLET",
      "INSTALLMENT",
    )
    .required(),
  paymentDate: Joi.date().required(),
  methodDetails: Joi.object().optional(),
});
