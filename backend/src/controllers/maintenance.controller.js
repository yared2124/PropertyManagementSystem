/**
 * Maintenance controller – CRUD plus status update.
 */

import maintenanceService from "../services/maintenance.service.js";
import { successResponse } from "../utils/apiResponse.js";

class MaintenanceController {
  async create(req, res, next) {
    try {
      const reqObj = await maintenanceService.create(req.body);
      res
        .status(201)
        .json(successResponse(reqObj, "Maintenance request created", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const requests = await maintenanceService.findAll(req.query);
      res.status(200).json(successResponse(requests));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const reqObj = await maintenanceService.findById(req.params.id);
      res.status(200).json(successResponse(reqObj));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const result = await maintenanceService.updateStatus(
        req.params.id,
        req.body.status,
      );
      res.status(200).json(successResponse(result, "Status updated"));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await maintenanceService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new MaintenanceController();
