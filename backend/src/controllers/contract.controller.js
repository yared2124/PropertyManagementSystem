import contractService from "../services/contract.service.js";
import { successResponse } from "../utils/apiResponse.js";

class ContractController {
  async create(req, res, next) {
    try {
      const contract = await contractService.create(req.body);
      res.status(201).json(successResponse(contract, "Contract created", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const contracts = await contractService.findAll(req.query);
      res.status(200).json(successResponse(contracts));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const contract = await contractService.findById(req.params.id);
      res.status(200).json(successResponse(contract));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const contract = await contractService.update(req.params.id, req.body);
      res.status(200).json(successResponse(contract, "Contract updated"));
    } catch (error) {
      next(error);
    }
  }

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
