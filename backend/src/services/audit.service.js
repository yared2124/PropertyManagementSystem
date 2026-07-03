import auditRepository from "../repositories/audit.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class AuditService {
  /**
   * Create a new audit log entry.
   */
  async logAction({
    userId,
    action,
    entityType,
    entityId,
    changes,
    ipAddress,
    userAgent,
    metadata,
  }) {
    return auditRepository.create({
      userId,
      action,
      entityType,
      entityId,
      changes: changes || {},
      ipAddress,
      userAgent,
      metadata: metadata || {},
    });
  }

  /**
   * List audit logs with filtering and pagination.
   * No soft‑delete filter – all logs are retained.
   */
  async findAll(filters = {}) {
    // Build the where clause without `deletedAt`
    const where = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.action) where.action = filters.action;

    const { page = 1, limit = 50 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [logs, total] = await Promise.all([
      auditRepository.findAll(where, {
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      auditRepository.model.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get a single audit log entry by ID.
   */
  async findById(id) {
    const log = await auditRepository.findById(id);
    if (!log) {
      throw new AppError("Audit log not found", 404);
    }
    return log;
  }
}

export default new AuditService();
