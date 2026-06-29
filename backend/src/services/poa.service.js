/**
 * Power of Attorney (POA) service – manages POA creation with overlap checks.
 */

import poaRepository from "../repositories/poa.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class POAService {
  async create(data) {
    // Check if there's already an active POA for the same asset
    const active = await poaRepository.findActiveByAsset(
      data.assetType,
      data.assetId,
    );
    if (active) {
      throw new AppError("An active POA already exists for this asset", 400);
    }
    return poaRepository.create(data);
  }

  async findAll(filters = {}) {
    return poaRepository.findAll({ ...filters, deletedAt: null });
  }

  async findById(id) {
    const poa = await poaRepository.findById(id);
    if (!poa || poa.deletedAt) {
      throw new AppError("POA not found", 404);
    }
    return poa;
  }

  async update(id, data) {
    await this.findById(id);
    return poaRepository.update(id, data);
  }

  async delete(id) {
    await this.findById(id);
    return poaRepository.softDelete(id);
  }
}

export default new POAService();
