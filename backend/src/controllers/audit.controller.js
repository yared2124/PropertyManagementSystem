import auditService from "../services/audit.service.js";
import { successResponse } from "../utils/apiResponse.js";

class AuditController {
  async findAll(req, res, next) {
    try {
      const result = await auditService.findAll(req.query);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const log = await auditService.findById(req.params.id);
      res.status(200).json(successResponse(log));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuditController();
