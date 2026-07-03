import auditService from "../services/audit.service.js";

export const auditLog = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      // Only log if response status is 2xx (success)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityType = req.baseUrl.split("/")[2] || "unknown";
        const entityId = req.params.id || null;
        const userId = req.user?.userId || null;
        const changes = req.body || {};
        auditService
          .logAction({
            userId,
            action: `${action}_${entityType}`,
            entityType,
            entityId,
            changes,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
          })
          .catch(console.error);
      }
      originalSend.call(this, data);
    };
    next();
  };
};
