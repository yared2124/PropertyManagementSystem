/**
 * Payment service – processes payments and refunds.
 * Generates a unique payment number for each transaction.
 */

import paymentRepository from "../repositories/payment.repository.js";
import contractRepository from "../repositories/contract.repository.js";
import { AppError } from "../middlewares/errorHandler.js";
import eventBus from "../events/eventBus.js";


class PaymentService {
  /**
   * Generate a unique payment number.
   * Format: PAY-{timestamp}-{random}
   */
  generatePaymentNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `PAY-${timestamp}-${random}`;
  }

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

    // Calculate remaining balance (simplified – you might want to sum existing payments)
    // For simplicity, we set remainingBalance as totalAmount - amount (but totalAmount may not exist)
    // Better: sum previous payments and subtract from totalAmount
    // For now, we set it as remaining balance after this payment
    const totalPaidResult = await paymentRepository.model.aggregate({
      where: { contractId, status: "PAID" },
      _sum: { amount: true },
    });
    const totalPaid = totalPaidResult._sum.amount || 0;
    const remainingBalance = contract.totalAmount - totalPaid - amount;

    // Generate a unique payment number
    const paymentNumber = this.generatePaymentNumber();

    // Create payment record
    const payment = await paymentRepository.create({
      paymentNumber, // <-- Add this
      contractId,
      amount,
      totalAmount: amount, // assuming no tax for now
      dueDate: new Date(),
      paymentDate: new Date(paymentDate),
      method,
      status: "PAID",
      paidAmount: amount,
      remainingBalance,
      ...rest,
    });

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

  async refund(paymentId) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment || payment.status !== "PAID") {
      throw new AppError("Payment not found or not paid", 404);
    }
    return paymentRepository.update(paymentId, { status: "REFUNDED" });
  }
  
}

export default new PaymentService();
