/**
 * Property repository – extends BaseRepository with property‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class PropertyRepository extends BaseRepository {
  constructor() {
    super(prisma.property);
  }

  /**
   * Find all properties with a given status (e.g., 'AVAILABLE').
   * @param {string} status - Asset status.
   * @returns {Promise<Array>} List of properties.
   */
  async findByStatus(status) {
    return this.model.findMany({ where: { status, deletedAt: null } });
  }

  /**
   * Find all properties in a specific city.
   * @param {string} city - City name.
   * @returns {Promise<Array>} List of properties.
   */
  async findByCity(city) {
    return this.model.findMany({ where: { city, deletedAt: null } });
  }
}

export default new PropertyRepository();
