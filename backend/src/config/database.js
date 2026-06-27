/**
 * Prisma client singleton.
 * Uses the default import workaround for CommonJS compatibility.
 */

import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export default prisma;
