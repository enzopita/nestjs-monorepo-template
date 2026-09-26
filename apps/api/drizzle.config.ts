import { defineConfig } from "drizzle-kit";
import { envSchema } from "./src/config/env.schema.js";

const { DATABASE_URL } = envSchema.pick({ DATABASE_URL: true }).parse(process.env);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: DATABASE_URL },
});
