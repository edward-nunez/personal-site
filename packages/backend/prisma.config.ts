// Prisma CLI config: must live at package root (next to package.json).
// Used by: prisma migrate, prisma generate, prisma db pull, prisma studio, etc.
// Application code uses the Prisma Client from src/infrastructure/persistence/prismaClient.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
