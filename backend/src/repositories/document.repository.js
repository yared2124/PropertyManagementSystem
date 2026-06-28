/**
 * Document repository – extends BaseRepository with document‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class DocumentRepository extends BaseRepository {
  constructor() {
    super(prisma.document);
  }

  /**
   * Find all documents linked to a specific entity (e.g., contract, property).
   * @param {string} referenceType - Type of the parent entity.
   * @param {string} referenceId - UUID of the parent entity.
   * @returns {Promise<Array>} List of documents.
   */
  async findByReference(referenceType, referenceId) {
    return this.model.findMany({ where: { referenceType, referenceId } });
  }
}

export default new DocumentRepository();
