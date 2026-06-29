/**
 * Contract service – handles contract creation with business rules:
 * - Asset must be available.
 * - No overlapping active contracts for the same asset.
 * - Generates a unique contract number.
 * - Calculates total contract value.
 */

import contractRepository from "../repositories/contract.repository.js";
import propertyRepository from "../repositories/property.repository.js";
import vehicleRepository from "../repositories/vehicle.repository.js";
import { AppError } from "../middlewares/errorHandler.js";
import { generateContractNumber } from "../utils/dateHelpers.js";
import { calculateTotal } from "../utils/numberHelpers.js";

class ContractService {
  /**
   * Create a new contract.
   * @param {Object} data - Contract data.
   * @returns {Promise<Object>} Created contract.
   */
  async create(data) {
    // 1. Validate asset exists and is available
    const asset = await this.validateAsset(data.assetType, data.assetId);
    if (asset.status !== "AVAILABLE") {
      throw new AppError("Asset is not available for rent", 400);
    }

    // 2. Check for overlapping active contracts
    const overlapping = await contractRepository.findActiveByAsset(
      data.assetType,
      data.assetId,
    );
    if (overlapping) {
      throw new AppError("Asset already has an active contract", 400);
    }

    // 3. Generate contract number
    const contractNumber = generateContractNumber();

    // 4. Calculate total value
    const totalAmount = calculateTotal(
      data.monthlyRent,
      data.startDate,
      data.endDate,
    );

    // 5. Create the contract
    return contractRepository.create({
      ...data,
      contractNumber,
      totalAmount,
      status: "DRAFT", // initial status
    });
  }

  /**
   * Validate that an asset exists and return it.
   * @param {string} assetType - 'PROPERTY', 'VEHICLE', or 'LAND'.
   * @param {string} assetId - UUID of the asset.
   * @returns {Promise<Object>} Asset object.
   * @throws {AppError} If asset type is invalid or asset not found.
   */
  async validateAsset(assetType, assetId) {
    if (assetType === "PROPERTY") {
      const property = await propertyRepository.findById(assetId);
      if (!property || property.deletedAt)
        throw new AppError("Property not found", 404);
      return property;
    } else if (assetType === "VEHICLE") {
      const vehicle = await vehicleRepository.findById(assetId);
      if (!vehicle || vehicle.deletedAt)
        throw new AppError("Vehicle not found", 404);
      return vehicle;
    }
    throw new AppError("Invalid asset type", 400);
  }

  async findAll(filters = {}) {
    return contractRepository.findAll({ ...filters, deletedAt: null });
  }

  async findById(id) {
    const contract = await contractRepository.findById(id);
    if (!contract || contract.deletedAt) {
      throw new AppError("Contract not found", 404);
    }
    return contract;
  }

  async update(id, data) {
    await this.findById(id);
    return contractRepository.update(id, data);
  }

  async delete(id) {
    await this.findById(id);
    return contractRepository.softDelete(id);
  }
}

export default new ContractService();
