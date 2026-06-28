/**
 * Contract repository – extends BaseRepository with contract‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class ContractRepository extends BaseRepository {
  constructor() {
    super(prisma.contract);
  }

  /**
   * Find an active contract for a given asset.
   * @param {string} assetType - 'PROPERTY', 'VEHICLE', or 'LAND'.
   * @param {string} assetId - UUID of the asset.
   * @returns {Promise<Object|null>} Contract or null.
   */
  async findActiveByAsset(assetType, assetId) {
    return this.model.findFirst({
      where: {
        assetType,
        assetId,
        status: "ACTIVE",
      },
    });
  }

  /**
   * Find all active contracts that are expiring within a given number of days.
   * @param {number} days - Number of days to look ahead (default 30).
   * @returns {Promise<Array>} List of contracts.
   */
  async findExpiringSoon(days = 30) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    return this.model.findMany({
      where: {
        status: "ACTIVE",
        endDate: { lte: threshold },
      },
    });
  }
}

export default new ContractRepository();
