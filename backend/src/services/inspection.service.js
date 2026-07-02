import inspectionRepository from "../repositories/inspection.repository.js";
import propertyRepository from "../repositories/property.repository.js";
import userRepository from "../repositories/user.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class InspectionService {
  async create(data) {
    // Validate property exists
    const property = await propertyRepository.findById(data.propertyId);
    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404);
    }

    // Validate inspector exists
    const inspector = await userRepository.findById(data.inspectorId);
    if (!inspector || inspector.deletedAt) {
      throw new AppError("Inspector not found", 404);
    }

    return inspectionRepository.create(data);
  }

  async findAll(filters = {}) {
    const where = { deletedAt: null };
    if (filters.propertyId) where.propertyId = filters.propertyId;
    if (filters.inspectorId) where.inspectorId = filters.inspectorId;
    if (filters.status) where.status = filters.status;
    return inspectionRepository.findAll(where);
  }

  async findById(id) {
    const inspection = await inspectionRepository.findById(id);
    if (!inspection || inspection.deletedAt) {
      throw new AppError("Inspection not found", 404);
    }
    return inspection;
  }

  async update(id, data) {
    await this.findById(id);
    return inspectionRepository.update(id, data);
  }

  async delete(id) {
    await this.findById(id);
    return inspectionRepository.softDelete(id);
  }
}

export default new InspectionService();
