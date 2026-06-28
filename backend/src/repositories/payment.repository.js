/**
 * Payment repository – extends BaseRepository with payment‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class PaymentRepository extends BaseRepository {
  constructor() {
    super(prisma.payment);
  }

  /**
   * Find all payments for a specific contract, ordered by due date.
   * @param {string} contractId - UUID of the contract.
   * @returns {Promise<Array>} List of payments.
   */
  async findByContract(contractId) {
    return this.model.findMany({
      where: { contractId },
      orderBy: { dueDate: "asc" },
    });
  }

  /**
   * Find all overdue payments (status = 'OVERDUE' and due date < now).
   * @returns {Promise<Array>} List of overdue payments.
   */
  async findOverdue() {
    return this.model.findMany({
      where: {
        status: "OVERDUE",
        dueDate: { lt: new Date() },
      },
    });
  }
}

export default new PaymentRepository();
