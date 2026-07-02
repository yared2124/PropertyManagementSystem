/**
 * Payment controller – process payments, get payments, refund.
 */

import paymentService from "../services/payment.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { createPaymentIntent } from "../services/stripe.service.js";

class PaymentController {
  async process(req, res, next) {
    try {
      const payment = await paymentService.processPayment(req.body);
      res.status(201).json(successResponse(payment, "Payment processed", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const payments = await paymentService.findAll(req.query);
      res.status(200).json(successResponse(payments));
    } catch (error) {
      next(error);
    }
  }

  async createStripeIntent(req, res, next) {
    try {
      const { amount, contractId } = req.body;
      if (!amount || !contractId) {
        throw new AppError("Amount and contractId are required", 400);
      }
      const intent = await createPaymentIntent(amount, "sar", { contractId });
      res.status(200).json(
        successResponse(
          {
            clientSecret: intent.client_secret,
            paymentIntentId: intent.id,
          },
          "Payment intent created",
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const payment = await paymentService.findById(req.params.id);
      res.status(200).json(successResponse(payment));
    } catch (error) {
      next(error);
    }
  }

  async refund(req, res, next) {
    try {
      const result = await paymentService.refund(req.params.id);
      res.status(200).json(successResponse(result, "Refund processed"));
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
