import maintenanceRepository from "../repositories/maintenance.repository.js";
import auditService from "./audit.service.js";
import { AppError } from "../middlewares/errorHandler.js";

class MaintenanceService {
  /**
   * Find a maintenance request by ID (excluding soft‑deleted by default).
   * @param {string} id - UUID of the request.
   * @param {boolean} includeDeleted - If true, includes soft‑deleted records.
   */
  async findById(id, includeDeleted = false) {
    const where = { id };
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    const request = await maintenanceRepository.findOne(where);
    if (!request) {
      throw new AppError("Maintenance request not found", 404);
    }
    return request;
  }

  /**
   * Create a new maintenance request.
   */
  async create(data, userId = null, ipAddress = null, userAgent = null) {
    const ticketNumber = `MNT-${Date.now()}`;
    const request = await maintenanceRepository.create({
      ...data,
      ticketNumber,
    });

    // Audit logging
    try {
      await auditService.logAction({
        userId,
        action: "CREATE_POST_Maintenance",
        entityType: "Maintenance",
        entityId: request.id,
        changes: request,
        ipAddress,
        userAgent,
        metadata: {
          method: "POST",
          url: "/api/v1/maintenance",
          statusCode: 201,
        },
      });
    } catch (error) {
      console.error("❌ Audit log failed:", error.message);
    }

    return request;
  }

  /**
   * List all maintenance requests with filters.
   */
  async findAll(filters = {}) {
    const where = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assetType) where.assetType = filters.assetType;
    if (filters.assetId) where.assetId = filters.assetId;
    // Additional filters can be added
    return maintenanceRepository.findAll(where);
  }

  /**
   * Update the status of a maintenance request.
   */
  async updateStatus(
    id,
    status,
    userId = null,
    ipAddress = null,
    userAgent = null,
  ) {
    const request = await this.findById(id); // ensures it exists and is not deleted
    const updated = await maintenanceRepository.update(id, { status });

    // Audit logging
    try {
      await auditService.logAction({
        userId,
        action: "UPDATE_PUT_Maintenance",
        entityType: "Maintenance",
        entityId: updated.id,
        changes: { status },
        ipAddress,
        userAgent,
        metadata: {
          method: "PUT",
          url: `/api/v1/maintenance/${id}/status`,
          statusCode: 200,
        },
      });
    } catch (error) {
      console.error("❌ Audit log failed:", error.message);
    }

    return updated;
  }

  /**
   * Soft delete a maintenance request.
   * Checks if already deleted before attempting.
   */
  async delete(id, userId = null, ipAddress = null, userAgent = null) {
    // Find including deleted records to check status
    const request = await this.findById(id, true);
    if (request.deletedAt) {
      throw new AppError("Maintenance request already deleted", 400);
    }
    const deleted = await maintenanceRepository.softDelete(id);

    // Audit logging
    try {
      await auditService.logAction({
        userId,
        action: "DELETE_DELETE_Maintenance",
        entityType: "Maintenance",
        entityId: deleted.id,
        changes: { deleted: true },
        ipAddress,
        userAgent,
        metadata: {
          method: "DELETE",
          url: `/api/v1/maintenance/${id}`,
          statusCode: 204,
        },
      });
    } catch (error) {
      console.error("❌ Audit log failed:", error.message);
    }

    return deleted;
  }
}

export default new MaintenanceService();
