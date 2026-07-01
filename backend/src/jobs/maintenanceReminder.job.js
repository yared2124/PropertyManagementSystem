/**
 * Maintenance Reminder Job
 * Runs daily to check for overdue maintenance requests and send reminders.
 * Also checks for scheduled maintenance tasks.
 */

import prisma from "../config/database.js";
import { sendEmail } from "../services/email.service.js";

/**
 * Check overdue maintenance requests and send reminders to assignees.
 * @returns {Promise<Object>} Summary of reminders sent.
 */
export const checkMaintenanceReminders = async () => {
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find maintenance requests that are:
    // 1. In progress for more than 3 days, or
    // 2. Reported but not approved for more than 7 days, or
    // 3. Scheduled but not started past the scheduled date
    const overdueRequests = await prisma.maintenance.findMany({
      where: {
        status: { in: ["IN_PROGRESS", "REPORTED", "APPROVED", "SCHEDULED"] },
        OR: [
          // In progress for more than 3 days
          {
            status: "IN_PROGRESS",
            updatedAt: { lt: threeDaysAgo },
          },
          // Reported but not approved for more than 7 days
          {
            status: "REPORTED",
            createdAt: {
              lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          // Scheduled but past scheduled date
          {
            status: "APPROVED",
            scheduledDate: { lt: now },
          },
        ],
      },
      include: {
        reportedBy: true,
        assignedTo: true,
      },
    });

    if (overdueRequests.length === 0) {
      console.log("🔧 No overdue maintenance requests.");
      return { sent: 0, requests: [] };
    }

    console.log(
      `🔧 Found ${overdueRequests.length} overdue maintenance requests.`,
    );

    let sentCount = 0;
    const results = [];

    for (const request of overdueRequests) {
      try {
        // 1. Send reminder to assigned technician (if assigned)
        if (request.assignedTo?.email) {
          await sendEmail(
            request.assignedTo.email,
            `🔧 Urgent: Maintenance Request ${request.ticketNumber} is Overdue`,
            getMaintenanceOverdueTemplate(request),
            [],
          );
          sentCount++;
        }

        // 2. Send notification to reporter (if different from assignee)
        if (
          request.reportedBy?.email &&
          request.reportedBy.id !== request.assignedTo?.id
        ) {
          await sendEmail(
            request.reportedBy.email,
            `🔧 Update: Maintenance Request ${request.ticketNumber} Status`,
            getMaintenanceStatusTemplate(request),
            [],
          );
          sentCount++;
        }

        results.push({
          ticketNumber: request.ticketNumber,
          title: request.title,
          status: request.status,
          reportedBy: request.reportedBy?.email || null,
          assignedTo: request.assignedTo?.email || null,
          status: "sent",
        });
      } catch (error) {
        console.error(
          `❌ Failed to send maintenance reminder for ${request.ticketNumber}:`,
          error.message,
        );
        results.push({
          ticketNumber: request.ticketNumber,
          error: error.message,
          status: "failed",
        });
      }
    }

    console.log(`🔧 Sent ${sentCount} maintenance reminders.`);
    return { sent: sentCount, requests: results };
  } catch (error) {
    console.error("❌ Maintenance reminder job failed:", error);
    throw error;
  }
};

/**
 * Send scheduled maintenance reminders (for tasks scheduled today).
 * @returns {Promise<Object>} Summary of reminders sent.
 */
export const sendScheduledMaintenanceReminders = async () => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Find maintenance scheduled for today
    const scheduledToday = await prisma.maintenance.findMany({
      where: {
        status: "APPROVED",
        scheduledDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        reportedBy: true,
        assignedTo: true,
      },
    });

    if (scheduledToday.length === 0) {
      console.log("🔧 No maintenance scheduled for today.");
      return { sent: 0, requests: [] };
    }

    let sentCount = 0;

    for (const request of scheduledToday) {
      try {
        // Send reminder to assigned technician
        if (request.assignedTo?.email) {
          await sendEmail(
            request.assignedTo.email,
            `🔧 Reminder: Maintenance ${request.ticketNumber} Scheduled Today`,
            getScheduledReminderTemplate(request),
            [],
          );
          sentCount++;
        }
      } catch (error) {
        console.error(
          `❌ Failed to send scheduled reminder for ${request.ticketNumber}:`,
          error.message,
        );
      }
    }

    console.log(`🔧 Sent ${sentCount} scheduled maintenance reminders.`);
    return { sent: sentCount };
  } catch (error) {
    console.error("❌ Scheduled maintenance reminder job failed:", error);
    throw error;
  }
};

// ============================================
// Email Templates (inline for this file)
// ============================================

/**
 * Template for overdue maintenance requests.
 */
const getMaintenanceOverdueTemplate = (request) => {
  const daysOverdue = Math.ceil(
    (new Date() - new Date(request.updatedAt)) / (1000 * 60 * 60 * 24),
  );
  return `
    <h1>🔧 Maintenance Overdue: ${request.ticketNumber}</h1>
    <p><strong>Title:</strong> ${request.title}</p>
    <p><strong>Status:</strong> ${request.status}</p>
    <p><strong>Days Overdue:</strong> ${daysOverdue}</p>
    <p><strong>Description:</strong> ${request.description}</p>
    <p><strong>Asset:</strong> ${request.assetType} (ID: ${request.assetId})</p>
    <p>Please take immediate action.</p>
    <p><a href="${process.env.FRONTEND_URL}/maintenance/${request.id}">View Request</a></p>
  `;
};

/**
 * Template for maintenance status updates.
 */
const getMaintenanceStatusTemplate = (request) => {
  return `
    <h1>🔧 Maintenance Update: ${request.ticketNumber}</h1>
    <p><strong>Title:</strong> ${request.title}</p>
    <p><strong>Current Status:</strong> ${request.status}</p>
    <p><strong>Description:</strong> ${request.description}</p>
    <p><a href="${process.env.FRONTEND_URL}/maintenance/${request.id}">View Request</a></p>
  `;
};

/**
 * Template for scheduled maintenance reminders.
 */
const getScheduledReminderTemplate = (request) => {
  return `
    <h1>🔧 Reminder: Maintenance Scheduled Today</h1>
    <p><strong>Ticket:</strong> ${request.ticketNumber}</p>
    <p><strong>Title:</strong> ${request.title}</p>
    <p><strong>Scheduled Date:</strong> ${new Date(request.scheduledDate).toLocaleDateString()}</p>
    <p><strong>Location:</strong> ${request.location || "Not specified"}</p>
    <p><a href="${process.env.FRONTEND_URL}/maintenance/${request.id}">View Details</a></p>
  `;
};
