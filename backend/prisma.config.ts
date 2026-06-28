import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env(
      "postgresql://pms_user:12345678@localhost:5432/Property_Management_System",
    ),
  },
});
