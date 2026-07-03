import auditService from "../services/audit.service.js";

export const auditLog = (actionPrefix) => {
  return async (req, res, next) => {
    console.log(
      `🔍 [auditLog] Middleware triggered: ${req.method} ${req.originalUrl}`,
    );

    const originalSend = res.send;

    res.send = function (data) {
      console.log(`📤 [auditLog] Response status: ${res.statusCode}`);

      if (
        res.statusCode >= 200 &&
        res.statusCode < 300 &&
        req.method !== "GET"
      ) {
        console.log(`✅ [auditLog] Conditions met – logging action.`);

        const entityType = req.baseUrl.split("/")[2] || "unknown";
        const entityId = req.params.id || req.body?.id || null;
        const userId = req.user?.userId || null;
        const changes = req.method === "DELETE" ? { deleted: true } : req.body;

        const action = `${actionPrefix}_${req.method}_${entityType}`;
        console.log(
          `📝 [auditLog] Action: ${action}, Entity: ${entityType}, ID: ${entityId}, User: ${userId}`,
        );

        auditService
          .logAction({
            userId,
            action,
            entityType,
            entityId,
            changes,
            ipAddress: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers["user-agent"],
            metadata: {
              method: req.method,
              url: req.originalUrl,
              statusCode: res.statusCode,
            },
          })
          .then(() =>
            console.log(`✅ [auditLog] Log saved successfully for ${action}`),
          )
          .catch((error) =>
            console.error(
              `❌ [auditLog] Failed to save log for ${action}:`,
              error,
            ),
          );
      } else {
        console.log(
          `⏭️ [auditLog] Skipping audit log – status: ${res.statusCode}, method: ${req.method}`,
        );
      }

      originalSend.call(this, data);
    };

    next();
  };
};
