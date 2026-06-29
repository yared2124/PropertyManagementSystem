import poaService from "../services/poa.service.js";
import { successResponse } from "../utils/apiResponse.js";

class POAController {
  async create(req, res, next) {
    try {
      const poa = await poaService.create(req.body);
      res.status(201).json(successResponse(poa, "POA created", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const poas = await poaService.findAll(req.query);
      res.status(200).json(successResponse(poas));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const poa = await poaService.findById(req.params.id);
      res.status(200).json(successResponse(poa));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const poa = await poaService.update(req.params.id, req.body);
      res.status(200).json(successResponse(poa, "POA updated"));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await poaService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new POAController();
