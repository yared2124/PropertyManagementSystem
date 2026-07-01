import prisma from "../config/database.js";

export const processRecurringPayments = async () => {
  // Find active contracts with recurring payments enabled
  const contracts = await prisma.contract.findMany({
    where: { status: "ACTIVE", isRecurring: true },
    include: { tenant: true },
  });
  for (const contract of contracts) {
    // Create a new payment record for the current month
    await prisma.payment.create({
      data: {
        paymentNumber: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        contractId: contract.id,
        amount: contract.monthlyRent,
        totalAmount: contract.monthlyRent,
        dueDate: new Date(),
        method: "AUTOMATIC",
        status: "PENDING",
      },
    });
  }
};
