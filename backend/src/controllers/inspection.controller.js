import inspectionService from "../services/inspection.service.js";
import { successResponse } from "../utils/apiResponse.js";

class InspectionController {
  async create(req, res, next) {
    try {
      const inspection = await inspectionService.create(req.body);
      res
        .status(201)
        .json(successResponse(inspection, "Inspection created", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const inspections = await inspectionService.findAll(req.query);
      res.status(200).json(successResponse(inspections));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const inspection = await inspectionService.findById(req.params.id);
      res.status(200).json(successResponse(inspection));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const inspection = await inspectionService.update(
        req.params.id,
        req.body,
      );
      res.status(200).json(successResponse(inspection, "Inspection updated"));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await inspectionService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new InspectionController();
