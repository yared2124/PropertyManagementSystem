/**
 * Vehicle repository – extends BaseRepository with vehicle‑specific queries.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class VehicleRepository extends BaseRepository {
  constructor() {
    super(prisma.vehicle);
  }

  /**
   * Find a vehicle by VIN (unique).
   * @param {string} vin - Vehicle Identification Number.
   * @returns {Promise<Object|null>} Vehicle or null.
   */
  async findByVIN(vin) {
    return this.model.findUnique({ where: { vin } });
  }

  /**
   * Find a vehicle by license plate (unique).
   * @param {string} plate - License plate number.
   * @returns {Promise<Object|null>} Vehicle or null.
   */
  async findByLicensePlate(plate) {
    return this.model.findUnique({ where: { licensePlate: plate } });
  }
}

export default new VehicleRepository();
