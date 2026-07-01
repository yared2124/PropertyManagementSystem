import prisma from "../config/database.js";
import { sendEmail } from "../services/email.service.js";

export const checkOverduePayments = async () => {
  const now = new Date();
  const overdue = await prisma.payment.updateMany({
    where: {
      status: "PENDING",
      dueDate: { lt: now },
    },
    data: { status: "OVERDUE" },
  });
  if (overdue.count > 0) {
    console.log(`🔴 ${overdue.count} payments marked overdue.`);
    // Optionally send notification to tenants/landlords
  }
};
