/**
 * Contract Expiry Reminder Job
 * Runs daily to check for contracts expiring in the next 7, 14, or 30 days.
 * Sends email notifications to tenants and landlords.
 */

import prisma from "../config/database.js";
import { sendEmail } from "../services/email.service.js";
import { getContractExpiryTemplate } from "../utils/emailTemplates.js";

/**
 * Check contracts expiring soon and send reminders.
 * @param {number} daysThreshold - Number of days to look ahead (default: 30)
 * @returns {Promise<Object>} Summary of reminders sent.
 */
export const sendContractReminders = async (daysThreshold = 30) => {
  try {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + daysThreshold);

    // Find active contracts expiring within the threshold period
    const expiringContracts = await prisma.contract.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        tenant: true,
        landlord: true,
      },
    });

    if (expiringContracts.length === 0) {
      console.log("📬 No contracts expiring soon.");
      return { sent: 0, contracts: [] };
    }

    console.log(
      `📬 Found ${expiringContracts.length} contracts expiring soon.`,
    );

    let sentCount = 0;
    const results = [];

    for (const contract of expiringContracts) {
      // Calculate days remaining
      const daysLeft = Math.ceil(
        (new Date(contract.endDate) - now) / (1000 * 60 * 60 * 24),
      );

      // Determine reminder type based on days left
      let reminderType = "standard";
      if (daysLeft <= 7) reminderType = "urgent";
      else if (daysLeft <= 14) reminderType = "warning";

      try {
        // 1. Send to Tenant
        if (contract.tenant?.email) {
          await sendEmail(
            contract.tenant.email,
            `📄 Contract ${contract.contractNumber} Expiring in ${daysLeft} Days`,
            getContractExpiryTemplate(
              contract,
              daysLeft,
              contract.tenant.firstName,
            ),
            [],
          );
          sentCount++;
        }

        // 2. Send to Landlord
        if (contract.landlord?.email) {
          await sendEmail(
            contract.landlord.email,
            `📄 Contract ${contract.contractNumber} Expiring in ${daysLeft} Days`,
            getContractExpiryTemplate(
              contract,
              daysLeft,
              contract.landlord.firstName,
            ),
            [],
          );
          sentCount++;
        }

        results.push({
          contractId: contract.id,
          contractNumber: contract.contractNumber,
          daysLeft,
          reminderType,
          tenantEmail: contract.tenant?.email || null,
          landlordEmail: contract.landlord?.email || null,
          status: "sent",
        });
      } catch (error) {
        console.error(
          `❌ Failed to send reminder for contract ${contract.contractNumber}:`,
          error.message,
        );
        results.push({
          contractId: contract.id,
          contractNumber: contract.contractNumber,
          daysLeft,
          error: error.message,
          status: "failed",
        });
      }
    }

    console.log(`📬 Sent ${sentCount} contract expiry reminders.`);
    return { sent: sentCount, contracts: results };
  } catch (error) {
    console.error("❌ Contract expiry reminder job failed:", error);
    throw error;
  }
};

/**
 * Get all contracts expiring soon (for API endpoints).
 * @param {number} days - Lookahead days.
 * @returns {Promise<Array>} List of expiring contracts.
 */
export const getExpiringContracts = async (days = 30) => {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + days);

  return prisma.contract.findMany({
    where: {
      status: "ACTIVE",
      endDate: {
        gte: now,
        lte: futureDate,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      landlord: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { endDate: "asc" },
  });
};
