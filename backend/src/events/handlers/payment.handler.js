import auditService from "../../services/audit.service.js";
import { sendEmail } from "../../services/email.service.js";

export const setupPaymentHandlers = (eventBus) => {
  eventBus.on("payment:processed", async (payment) => {
    console.log("🔔 Payment event received:", payment.id);

    // 1. Send confirmation email
    if (payment.contract?.tenant?.email) {
      await sendEmail(
        payment.contract.tenant.email,
        "Payment Confirmation",
        `<h1>Payment of ${payment.amount} received</h1>`,
      );
    }

    // 2. Audit log
    await auditService.logAction({
      userId: payment.processedBy,
      action: "EVENT_PaymentProcessed",
      entityType: "Payment",
      entityId: payment.id,
      changes: { status: "PAID" },
    });
  });
};
