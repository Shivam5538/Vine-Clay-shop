import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
