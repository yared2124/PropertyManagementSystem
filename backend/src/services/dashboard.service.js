/**
 * Dashboard service – aggregates key metrics for the dashboard overview.
 */

import prisma from "../config/database.js";

class DashboardService {
  /**
   * Get overall dashboard metrics.
   * @returns {Promise<Object>} { totalAssets, activeContracts, pendingMaintenance, totalPaid, totalOwed }
   */
  async getOverview() {
    const [
      totalProperties,
      totalVehicles,
      activeContracts,
      pendingMaintenance,
      totalPaid,
      totalOwed,
    ] = await Promise.all([
      prisma.property.count({ where: { deletedAt: null } }),
      prisma.vehicle.count({ where: { deletedAt: null } }),
      prisma.contract.count({ where: { status: "ACTIVE" } }),
      prisma.maintenance.count({
        where: { status: { in: ["REPORTED", "APPROVED", "IN_PROGRESS"] } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "PAID" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "OVERDUE" },
      }),
    ]);

    return {
      totalAssets: totalProperties + totalVehicles,
      activeContracts,
      pendingMaintenance,
      totalPaid: totalPaid._sum.amount || 0,
      totalOwed: totalOwed._sum.amount || 0,
    };
  }
}

export default new DashboardService();
