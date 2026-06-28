/**
 * Power of Attorney (POA) repository – extends BaseRepository with POA‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class POARepository extends BaseRepository {
  constructor() {
    super(prisma.powerOfAttorney);
  }

  /**
   * Find an active POA for a given asset (within its valid date range).
   * @param {string} assetType - 'PROPERTY', 'VEHICLE', or 'LAND'.
   * @param {string} assetId - UUID of the asset.
   * @returns {Promise<Object|null>} POA or null.
   */
  async findActiveByAsset(assetType, assetId) {
    const now = new Date();
    return this.model.findFirst({
      where: {
        assetType,
        assetId,
        status: "ACTIVE",
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  }
}

export default new POARepository();
