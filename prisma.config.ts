
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.REPORTER_DATABASE_URL ||
      process.env.DATABASE_URL!,
  },
});
