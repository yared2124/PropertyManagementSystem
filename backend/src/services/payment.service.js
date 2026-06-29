/**
 * Payment service – processes payments and refunds.
 * Validates that the contract is active and creates a payment record.
 */

import paymentRepository from "../repositories/payment.repository.js";
import contractRepository from "../repositories/contract.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class PaymentService {
  /**
   * Process a payment.
   * @param {Object} data - Payment data (contractId, amount, method, paymentDate, etc.)
   * @returns {Promise<Object>} Created payment.
   */
  async processPayment(data) {
    const { contractId, amount, method, paymentDate, ...rest } = data;

    // Validate contract exists and is active
    const contract = await contractRepository.findById(contractId);
    if (!contract || contract.status !== "ACTIVE") {
      throw new AppError("Contract not found or not active", 404);
    }

    // Create payment record (simplified – you might add balance calculations)
    const payment = await paymentRepository.create({
      contractId,
      amount,
      totalAmount: amount,
      dueDate: new Date(),
      paymentDate: new Date(paymentDate),
      method,
      status: "PAID",
      paidAmount: amount,
      remainingBalance: contract.totalAmount - amount, // simplified
      ...rest,
    });

    // Optionally update contract status if fully paid (omitted for brevity)

    return payment;
  }

  async findAll(filters = {}) {
    return paymentRepository.findAll({ ...filters, deletedAt: null });
  }

  async findById(id) {
    const payment = await paymentRepository.findById(id);
    if (!payment || payment.deletedAt) {
      throw new AppError("Payment not found", 404);
    }
    return payment;
  }

  /**
   * Refund a payment (change status to REFUNDED).
   * @param {string} paymentId - UUID of the payment.
   * @returns {Promise<Object>} Updated payment.
   */
  async refund(paymentId) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment || payment.status !== "PAID") {
      throw new AppError("Payment not found or not paid", 404);
    }
    return paymentRepository.update(paymentId, { status: "REFUNDED" });
  }
}

export default new PaymentService();
