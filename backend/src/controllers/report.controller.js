import reportService from "../services/report.service.js";
import { successResponse } from "../utils/apiResponse.js";

class ReportController {
  async getRevenue(req, res, next) {
    try {
      const { startDate, endDate, groupBy } = req.query;
      const data = await reportService.getRevenueReport(
        startDate,
        endDate,
        groupBy,
      );
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getContracts(req, res, next) {
    try {
      const data = await reportService.getContractReport();
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getMaintenance(req, res, next) {
    try {
      const data = await reportService.getMaintenanceReport();
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getOccupancy(req, res, next) {
    try {
      const data = await reportService.getPropertyOccupancyReport();
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const data = await reportService.getUserReport();
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getDashboardSummary(req, res, next) {
    try {
      const data = await reportService.getDashboardSummary();
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
  async getProfitLoss(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        throw new AppError("startDate and endDate are required", 400);
      }
      const data = await reportService.getProfitLoss(startDate, endDate);
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getOccupancyAnalytics(req, res, next) {
    try {
      const data = await reportService.getOccupancyAnalytics();
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
