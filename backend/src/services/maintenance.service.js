/**
 * Maintenance service – handles maintenance requests.
 * Generates a unique ticket number.
 */

import maintenanceRepository from "../repositories/maintenance.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class MaintenanceService {
  async create(data) {
    const ticketNumber = `MNT-${Date.now()}`;
    return maintenanceRepository.create({ ...data, ticketNumber });
  }

  async findAll(filters = {}) {
    return maintenanceRepository.findAll({ ...filters, deletedAt: null });
  }

  async findById(id) {
    const req = await maintenanceRepository.findById(id);
    if (!req || req.deletedAt) {
      throw new AppError("Maintenance request not found", 404);
    }
    return req;
  }

  async updateStatus(id, status) {
    await this.findById(id);
    return maintenanceRepository.update(id, { status });
  }

  async delete(id) {
    await this.findById(id);
    return maintenanceRepository.softDelete(id);
  }
}

export default new MaintenanceService();
