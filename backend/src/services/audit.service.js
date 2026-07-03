import auditRepository from "../repositories/audit.repository.js";

class AuditService {
  async logAction({
    userId,
    action,
    entityType,
    entityId,
    changes,
    ipAddress,
    userAgent,
  }) {
    return auditRepository.create({
      userId,
      action,
      entityType,
      entityId,
      changes,
      ipAddress,
      userAgent,
    });
  }

  async findAll(filters = {}) {
    return auditRepository.findAll({ ...filters, deletedAt: null });
  }

  async findById(id) {
    return auditRepository.findById(id);
  }
}

export default new AuditService();
