/**
 * Dashboard controller – provides overview metrics.
 */

import dashboardService from "../services/dashboard.service.js";
import { successResponse } from "../utils/apiResponse.js";

class DashboardController {
  async getOverview(req, res, next) {
    try {
      const data = await dashboardService.getOverview();
      res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
