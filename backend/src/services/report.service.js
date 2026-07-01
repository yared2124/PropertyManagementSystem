// src/services/report.service.js
import prisma from "../config/database.js";
import { AppError } from "../middlewares/errorHandler.js";

class ReportService {
  /**
   * Get revenue report for a given period.
   * @param {Date} startDate - Start of the period.
   * @param {Date} endDate - End of the period.
   * @param {string} [groupBy] - 'month' or 'day' (optional).
   * @returns {Promise<Object>} Revenue summary and breakdown.
   */
  async getRevenueReport(startDate, endDate, groupBy = "month") {
    // Validate date range
    if (!startDate || !endDate) {
      throw new AppError("Start date and end date are required", 400);
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new AppError("Start date must be before end date", 400);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Total revenue summary
    const summary = await prisma.payment.aggregate({
      where: {
        paymentDate: { gte: start, lte: end },
        status: { in: ["PAID", "PARTIALLY_PAID"] },
      },
      _sum: {
        amount: true,
        totalAmount: true,
        tax: true,
      },
      _count: true,
    });

    // 2. Revenue by payment method
    const byMethod = await prisma.payment.groupBy({
      by: ["method"],
      where: {
        paymentDate: { gte: start, lte: end },
        status: { in: ["PAID", "PARTIALLY_PAID"] },
      },
      _sum: { amount: true },
      _count: true,
    });

    // 3. Revenue by month (or day) – using raw SQL with correct table/column names
    let byPeriod = [];
    if (groupBy === "month") {
      const queryResult = await prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', "paymentDate") as period,
          SUM(amount) as total_amount,
          COUNT(*) as payment_count
        FROM "Payment"
        WHERE "paymentDate" BETWEEN ${start} AND ${end}
          AND status IN ('PAID', 'PARTIALLY_PAID')
        GROUP BY DATE_TRUNC('month', "paymentDate")
        ORDER BY period ASC
      `;
      byPeriod = queryResult.map((row) => ({
        period: row.period,
        totalAmount: Number(row.total_amount),
        count: Number(row.payment_count),
      }));
    } else {
      // Group by day
      const queryResult = await prisma.$queryRaw`
        SELECT
          DATE("paymentDate") as period,
          SUM(amount) as total_amount,
          COUNT(*) as payment_count
        FROM "Payment"
        WHERE "paymentDate" BETWEEN ${start} AND ${end}
          AND status IN ('PAID', 'PARTIALLY_PAID')
        GROUP BY DATE("paymentDate")
        ORDER BY period ASC
      `;
      byPeriod = queryResult.map((row) => ({
        period: row.period,
        totalAmount: Number(row.total_amount),
        count: Number(row.payment_count),
      }));
    }

    // 4. Overdue payments in this period
    const overdueSummary = await prisma.payment.aggregate({
      where: {
        status: "OVERDUE",
        dueDate: { lte: end },
      },
      _sum: { amount: true },
      _count: true,
    });

    return {
      summary: {
        totalPaid: Number(summary._sum.amount || 0),
        totalTax: Number(summary._sum.tax || 0),
        totalIncludingTax: Number(summary._sum.totalAmount || 0),
        totalPayments: summary._count,
      },
      byMethod: byMethod.map((m) => ({
        method: m.method,
        totalAmount: Number(m._sum.amount || 0),
        count: m._count,
      })),
      byPeriod,
      overdue: {
        totalOverdue: Number(overdueSummary._sum.amount || 0),
        count: overdueSummary._count,
      },
      period: {
        startDate: start,
        endDate: end,
      },
    };
  }

  /**
   * Get contract report – active, expired, expiring soon, by asset type.
   * @returns {Promise<Object>} Contract statistics.
   */
  async getContractReport() {
    const now = new Date();
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    // 1. Overall contract status counts
    const statusCounts = await prisma.contract.groupBy({
      by: ["status"],
      _count: true,
    });

    // 2. Contracts expiring soon (within 30 days)
    const expiringSoon = await prisma.contract.count({
      where: {
        status: "ACTIVE",
        endDate: { gte: now, lte: thirtyDaysLater },
      },
    });

    // 3. Active contracts by asset type
    const byAssetType = await prisma.contract.groupBy({
      by: ["assetType"],
      where: { status: "ACTIVE" },
      _count: true,
    });

    // 4. Total contract value (active)
    const totalValue = await prisma.contract.aggregate({
      where: { status: "ACTIVE" },
      _sum: { totalAmount: true },
    });

    // 5. Average monthly rent
    const avgRent = await prisma.contract.aggregate({
      where: { status: "ACTIVE" },
      _avg: { monthlyRent: true },
    });

    return {
      statusBreakdown: statusCounts.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      expiringSoon,
      byAssetType: byAssetType.map((a) => ({
        assetType: a.assetType,
        count: a._count,
      })),
      totalValueActive: Number(totalValue._sum.totalAmount || 0),
      averageMonthlyRent: Number(avgRent._avg.monthlyRent || 0),
      asOf: now,
    };
  }

  /**
   * Get maintenance report – by status, priority, average resolution time.
   * @returns {Promise<Object>} Maintenance statistics.
   */
  async getMaintenanceReport() {
    // 1. Status breakdown
    const statusCounts = await prisma.maintenance.groupBy({
      by: ["status"],
      _count: true,
    });

    // 2. Priority breakdown
    const priorityCounts = await prisma.maintenance.groupBy({
      by: ["priority"],
      _count: true,
    });

    // 3. Average resolution time (for completed requests)
    // Using raw SQL with correct table "Maintenance" and camelCase columns
    const avgResolutionRaw = await prisma.$queryRaw`
      SELECT
        AVG(EXTRACT(EPOCH FROM ("completionDate" - "reportedDate")) / 86400) as avg_days
      FROM "Maintenance"
      WHERE status = 'COMPLETED'
        AND "completionDate" IS NOT NULL
        AND "reportedDate" IS NOT NULL
    `;
    const avgResolutionDays =
      avgResolutionRaw.length > 0
        ? Number(avgResolutionRaw[0].avg_days) || 0
        : 0;

    // 4. Total costs (actual and estimated) for completed
    const costs = await prisma.maintenance.aggregate({
      where: { status: "COMPLETED" },
      _sum: {
        estimatedCost: true,
        actualCost: true,
        laborCost: true,
        materialCost: true,
      },
    });

    return {
      statusBreakdown: statusCounts.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      priorityBreakdown: priorityCounts.map((p) => ({
        priority: p.priority,
        count: p._count,
      })),
      averageResolutionDays: Math.round(avgResolutionDays * 10) / 10,
      totalEstimatedCost: Number(costs._sum.estimatedCost || 0),
      totalActualCost: Number(costs._sum.actualCost || 0),
      totalLaborCost: Number(costs._sum.laborCost || 0),
      totalMaterialCost: Number(costs._sum.materialCost || 0),
      totalRequests: await prisma.maintenance.count(),
    };
  }

  /**
   * Get property occupancy report – by city, by asset type.
   * @returns {Promise<Object>} Property occupancy statistics.
   */
  async getPropertyOccupancyReport() {
    const totalProperties = await prisma.property.count({
      where: { deletedAt: null },
    });

    // 1. Occupancy by status
    const statusCounts = await prisma.property.groupBy({
      by: ["status"],
      _count: true,
    });

    // 2. Occupancy by city
    const byCity = await prisma.property.groupBy({
      by: ["city", "status"],
      _count: true,
    });

    // 3. Average rent and market value by city
    const cityStats = await prisma.$queryRaw`
      SELECT
        city,
        AVG("rentalRate") as avg_rent,
        AVG("marketValue") as avg_value,
        COUNT(*) as count
      FROM "Property"
      WHERE "deletedAt" IS NULL
      GROUP BY city
    `;

    return {
      totalProperties,
      statusBreakdown: statusCounts.map((s) => ({
        status: s.status,
        count: s._count,
        percentage:
          totalProperties > 0
            ? Math.round((s._count / totalProperties) * 100)
            : 0,
      })),
      byCity: byCity.map((c) => ({
        city: c.city,
        status: c.status,
        count: c._count,
      })),
      cityAverages: cityStats.map((c) => ({
        city: c.city,
        averageRent: Number(c.avg_rent || 0),
        averageValue: Number(c.avg_value || 0),
        count: Number(c.count),
      })),
    };
  }

  /**
   * Get user activity report – registrations, roles, logins (if tracked).
   * @returns {Promise<Object>} User statistics.
   */
  async getUserReport() {
    const totalUsers = await prisma.user.count({ where: { deletedAt: null } });

    const roleCounts = await prisma.user.groupBy({
      by: ["role"],
      where: { deletedAt: null },
      _count: true,
    });

    // New registrations in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newRegistrations = await prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        deletedAt: null,
      },
    });

    // Active users (logged in recently – last 30 days)
    const activeUsers = await prisma.user.count({
      where: {
        lastLogin: { gte: thirtyDaysAgo },
        deletedAt: null,
      },
    });

    return {
      totalUsers,
      roleBreakdown: roleCounts.map((r) => ({
        role: r.role,
        count: r._count,
        percentage:
          totalUsers > 0 ? Math.round((r._count / totalUsers) * 100) : 0,
      })),
      newRegistrationsLast30Days: newRegistrations,
      activeUsersLast30Days: activeUsers,
    };
  }

  async getProfitLoss(startDate, endDate) {
    // Revenue: all PAID payments in period
    const revenue = await prisma.payment.aggregate({
      where: {
        paymentDate: { gte: new Date(startDate), lte: new Date(endDate) },
        status: "PAID",
      },
      _sum: { amount: true },
    });

    // Expenses: actual cost of completed maintenance
    const expenses = await prisma.maintenance.aggregate({
      where: {
        completionDate: { gte: new Date(startDate), lte: new Date(endDate) },
        status: "COMPLETED",
      },
      _sum: { actualCost: true },
    });

    // Additional expenses could come from other tables (e.g., property taxes)
    return {
      period: { startDate, endDate },
      revenue: Number(revenue._sum.amount || 0),
      expenses: Number(expenses._sum.actualCost || 0),
      netIncome: (revenue._sum.amount || 0) - (expenses._sum.actualCost || 0),
    };
  }

  /**
   * Get dashboard summary (combined quick stats).
   * Used for the main dashboard.
   * @returns {Promise<Object>} Quick overview.
   */
  async getDashboardSummary() {
    const [
      totalProperties,
      totalVehicles,
      totalContracts,
      activeContracts,
      pendingMaintenance,
      overduePayments,
      totalPaidToday,
    ] = await Promise.all([
      prisma.property.count({ where: { deletedAt: null } }),
      prisma.vehicle.count({ where: { deletedAt: null } }),
      prisma.contract.count({ where: { deletedAt: null } }),
      prisma.contract.count({ where: { status: "ACTIVE" } }),
      prisma.maintenance.count({
        where: { status: { in: ["REPORTED", "APPROVED", "IN_PROGRESS"] } },
      }),
      prisma.payment.count({ where: { status: "OVERDUE" } }),
      prisma.payment.aggregate({
        where: {
          paymentDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: "PAID",
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalAssets: totalProperties + totalVehicles,
      activeContracts,
      pendingMaintenance,
      overduePayments,
      totalPaidToday: Number(totalPaidToday._sum.amount || 0),
      totalContracts,
    };
  }

  async getOccupancyAnalytics() {
    const total = await prisma.property.count({ where: { deletedAt: null } });
    const rented = await prisma.property.count({ where: { status: "RENTED" } });
    const available = await prisma.property.count({
      where: { status: "AVAILABLE" },
    });
    const maintenance = await prisma.property.count({
      where: { status: "UNDER_MAINTENANCE" },
    });

    // Rent collection rate: total paid / total due (sum of monthlyRent for active contracts)
    const totalDue = await prisma.contract.aggregate({
      where: { status: "ACTIVE" },
      _sum: { monthlyRent: true },
    });
    const totalPaid = await prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });

    const due = Number(totalDue._sum.monthlyRent || 0);
    const paid = Number(totalPaid._sum.amount || 0);

    return {
      occupancy: {
        total,
        rented,
        available,
        underMaintenance: maintenance,
        occupancyRate: total ? (rented / total) * 100 : 0,
      },
      rentCollection: {
        totalDue: due,
        totalPaid: paid,
        collectionRate: due ? (paid / due) * 100 : 0,
      },
    };
  }
}

export default new ReportService();
