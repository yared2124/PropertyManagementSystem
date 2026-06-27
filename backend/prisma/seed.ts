/**
 * Seed script to populate the database with a default admin user.
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Upsert: create if not exists, otherwise update (prevents duplicates)
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      firstName: "System",
      lastName: "Admin",
      role: "SYSTEM_ADMIN",
      emailVerified: true,
    },
  });

  console.log("✅ Seeded admin user:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
