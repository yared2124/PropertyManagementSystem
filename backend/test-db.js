import prisma from "./src/config/database.js";

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("✅ Database connection successful!");
    console.log("Result:", result);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
