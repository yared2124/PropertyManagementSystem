/**
 * Vehicle service – manages vehicle CRUD operations.
 * Includes validation for unique VIN and license plate.
 */

import vehicleRepository from "../repositories/vehicle.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class VehicleService {
  async create(data) {
    // Check VIN uniqueness
    const existingVIN = await vehicleRepository.findByVIN(data.vin);
    if (existingVIN) throw new AppError("VIN already exists", 400);

    // Check license plate uniqueness
    const existingPlate = await vehicleRepository.findByLicensePlate(
      data.licensePlate,
    );
    if (existingPlate) throw new AppError("License plate already exists", 400);

    return vehicleRepository.create(data);
  }

  async findAll(filters = {}) {
    return vehicleRepository.findAll({ ...filters, deletedAt: null });
  }

  async findById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle || vehicle.deletedAt) {
      throw new AppError("Vehicle not found", 404);
    }
    return vehicle;
  }

  async update(id, data) {
    await this.findById(id);
    return vehicleRepository.update(id, data);
  }

  async delete(id) {
    await this.findById(id);
    return vehicleRepository.softDelete(id);
  }
}

export default new VehicleService();
