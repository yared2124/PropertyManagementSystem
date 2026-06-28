/**
 * Maintenance repository – extends BaseRepository with maintenance‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class MaintenanceRepository extends BaseRepository {
  constructor() {
    super(prisma.maintenance);
  }

  /**
   * Find all maintenance requests with a given status.
   * @param {string} status - Maintenance status (e.g., 'REPORTED').
   * @returns {Promise<Array>} List of requests.
   */
  async findByStatus(status) {
    return this.model.findMany({ where: { status } });
  }

  /**
   * Find pending maintenance requests for a specific asset.
   * @param {string} assetType - 'PROPERTY', 'VEHICLE', or 'LAND'.
   * @param {string} assetId - UUID of the asset.
   * @returns {Promise<Array>} List of pending requests.
   */
  async findPendingByAsset(assetType, assetId) {
    return this.model.findMany({
      where: {
        assetType,
        assetId,
        status: { in: ["REPORTED", "APPROVED", "IN_PROGRESS"] },
      },
    });
  }
}

export default new MaintenanceRepository();
