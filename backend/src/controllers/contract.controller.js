/**
 * Contract Controller – handles HTTP requests for contract management.
 * Converts date strings to Date objects before passing to the service.
 */

import contractService from "../services/contract.service.js";
import { successResponse } from "../utils/apiResponse.js";

class ContractController {
  /**
   * Create a new contract.
   * Converts startDate, endDate, and firstPaymentDate from strings to Date objects.
   */
  async create(req, res, next) {
    try {
      // Convert date strings to Date objects for Prisma compatibility
      if (req.body.startDate) {
        req.body.startDate = new Date(req.body.startDate);
      }
      if (req.body.endDate) {
        req.body.endDate = new Date(req.body.endDate);
      }
      if (req.body.firstPaymentDate) {
        req.body.firstPaymentDate = new Date(req.body.firstPaymentDate);
      }

      const contract = await contractService.create(req.body);
      res.status(201).json(successResponse(contract, "Contract created", 201));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all contracts with optional filters.
   */
  async findAll(req, res, next) {
    try {
      const contracts = await contractService.findAll(req.query);
      res.status(200).json(successResponse(contracts));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single contract by ID.
   */
  async findById(req, res, next) {
    try {
      const contract = await contractService.findById(req.params.id);
      res.status(200).json(successResponse(contract));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a contract.
   */
  async update(req, res, next) {
    try {
      // If dates are provided in the update, convert them as well
      if (req.body.startDate) {
        req.body.startDate = new Date(req.body.startDate);
      }
      if (req.body.endDate) {
        req.body.endDate = new Date(req.body.endDate);
      }
      if (req.body.firstPaymentDate) {
        req.body.firstPaymentDate = new Date(req.body.firstPaymentDate);
      }

      const contract = await contractService.update(req.params.id, req.body);
      res.status(200).json(successResponse(contract, "Contract updated"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Soft delete a contract.
   */
  async delete(req, res, next) {
    try {
      await contractService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ContractController();
