/**
 * Property service – manages property CRUD operations.
 * Uses property repository and validates business rules.
 */

import propertyRepository from "../repositories/property.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class PropertyService {
  /**
   * Create a new property.
   * @param {Object} data - Property data.
   * @returns {Promise<Object>} Created property.
   */
  async create(data) {
    return propertyRepository.create(data);
  }

  /**
   * Get all properties with optional filters.
   * @param {Object} filters - Query filters (status, city, etc.).
   * @returns {Promise<Array>} List of properties.
   */
  async findAll(filters = {}) {
    return propertyRepository.findAll({ ...filters, deletedAt: null });
  }

  /**
   * Get a single property by ID.
   * @param {string} id - Property UUID.
   * @returns {Promise<Object>} Property object.
   * @throws {AppError} If property not found or soft‑deleted.
   */
  async findById(id) {
    const property = await propertyRepository.findById(id);
    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404);
    }
    return property;
  }

  /**
   * Update a property.
   * @param {string} id - Property UUID.
   * @param {Object} data - Fields to update.
   * @returns {Promise<Object>} Updated property.
   */
  async update(id, data) {
    await this.findById(id); // ensure exists
    return propertyRepository.update(id, data);
  }

  /**
   * Soft‑delete a property.
   * @param {string} id - Property UUID.
   * @returns {Promise<Object>} Updated property with deletedAt set.
   */
  async delete(id) {
    await this.findById(id);
    return propertyRepository.softDelete(id);
  }
}

export default new PropertyService();
