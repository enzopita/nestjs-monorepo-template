// Entry point for the Better Auth CLI (`nub run auth:generate`) only. The app
// builds its instance in AuthModule, reusing the Drizzle connection.
import { drizzle } from "drizzle-orm/node-postgres";
import { envSchema } from "../config/env.schema.js";
import { relations } from "../database/relations.js";
import { createAuth } from "./auth.js";

const env = envSchema.parse(process.env);

export const auth = createAuth({
  db: drizzle(env.DATABASE_URL, { relations }),
  env,
});
