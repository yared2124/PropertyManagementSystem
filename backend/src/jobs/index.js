/**
 * Background Job Scheduler
 * Runs all scheduled jobs at predefined intervals.
 */

import cron from "node-cron";
import { processRecurringPayments } from "./recurringPayments.job.js";
import { checkOverduePayments } from "./overduePayments.job.js";
import { sendContractReminders } from "./contractExpiryReminder.job.js";
import {
  checkMaintenanceReminders,
  sendScheduledMaintenanceReminders,
} from "./maintenanceReminder.job.js";

// ============================================
// Schedule: Daily at 6:00 AM
// ============================================
cron.schedule("0 6 * * *", async () => {
  console.log("⏰ [Daily Job] Running maintenance jobs...");
  try {
    await checkOverduePayments();
    await sendContractReminders(30);
    await checkMaintenanceReminders();
    await sendScheduledMaintenanceReminders();
  } catch (error) {
    console.error("❌ Daily job failed:", error);
  }
});

// ============================================
// Schedule: Every hour (for recurring payments)
// ============================================
cron.schedule("0 * * * *", async () => {
  console.log("⏰ [Hourly Job] Processing recurring payments...");
  try {
    await processRecurringPayments();
  } catch (error) {
    console.error("❌ Recurring payment job failed:", error);
  }
});

// ============================================
// Schedule: Every 15 minutes (for urgent reminders)
// ============================================
cron.schedule("*/15 * * * *", async () => {
  console.log("⏰ [Quick Job] Checking urgent maintenance...");
  try {
    await sendContractReminders(7); // Urgent expirations (7 days)
    await checkMaintenanceReminders();
  } catch (error) {
    console.error("❌ Quick job failed:", error);
  }
});

console.log("✅ All cron jobs scheduled.");
