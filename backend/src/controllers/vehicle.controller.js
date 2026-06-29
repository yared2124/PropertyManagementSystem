import vehicleService from "../services/vehicle.service.js";
import { successResponse } from "../utils/apiResponse.js";

class VehicleController {
  async create(req, res, next) {
    try {
      const vehicle = await vehicleService.create(req.body);
      res.status(201).json(successResponse(vehicle, "Vehicle created", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const vehicles = await vehicleService.findAll(req.query);
      res.status(200).json(successResponse(vehicles));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const vehicle = await vehicleService.findById(req.params.id);
      res.status(200).json(successResponse(vehicle));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const vehicle = await vehicleService.update(req.params.id, req.body);
      res.status(200).json(successResponse(vehicle, "Vehicle updated"));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await vehicleService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new VehicleController();
