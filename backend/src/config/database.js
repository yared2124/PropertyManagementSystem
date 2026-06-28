import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// Get the DATABASE_URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasourceUrl: databaseUrl, // Pass the URL here
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export default prisma;
