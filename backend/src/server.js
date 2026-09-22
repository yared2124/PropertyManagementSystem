/**
 * Entry point of the application.
 * Starts the Express server on the port defined in environment variables.
 * Uses the app instance from app.js.
 */

import "dotenv/config";
import app from "./app.js";
import { closeRedisConnection } from "./config/redis.js";
import prisma from "./config/database.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
});

// =============================================
// Graceful Shutdown
// =============================================
const shutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    console.log("✅ HTTP server closed");
    try {
      await prisma.$disconnect();
      console.log("✅ Prisma disconnected");
      await closeRedisConnection();
    } catch (err) {
      console.error("❌ Error during shutdown:", err.message);
    } finally {
      process.exit(0);
    }
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error("⚠️  Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

