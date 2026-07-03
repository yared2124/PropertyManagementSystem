import propertyService from "../services/property.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { AppError } from "../middlewares/errorHandler.js";

class PropertyController {
  async create(req, res, next) {
    try {
      const property = await propertyService.create(
        req.body,
        req.user?.userId,
        req.ip || req.connection?.remoteAddress,
        req.headers["user-agent"],
      );
      res.status(201).json(successResponse(property, "Property created", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const properties = await propertyService.findAll(req.query);
      res.status(200).json(successResponse(properties));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const property = await propertyService.findById(req.params.id);
      res.status(200).json(successResponse(property));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const property = await propertyService.update(
        req.params.id,
        req.body,
        req.user?.userId,
        req.ip || req.connection?.remoteAddress,
        req.headers["user-agent"],
      );
      res.status(200).json(successResponse(property, "Property updated"));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await propertyService.delete(
        req.params.id,
        req.user?.userId,
        req.ip || req.connection?.remoteAddress,
        req.headers["user-agent"],
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req, res, next) {
    try {
      const propertyId = req.params.id;
      const file = req.file;
      if (!file) throw new AppError("No file uploaded", 400);
      const image = await propertyService.addImage(propertyId, file);
      res.status(201).json(successResponse(image, "Image uploaded", 201));
    } catch (error) {
      next(error);
    }
  }

  async getImages(req, res, next) {
    try {
      const images = await propertyService.getImages(req.params.id);
      res.status(200).json(successResponse(images));
    } catch (error) {
      next(error);
    }
  }
}

export default new PropertyController();
