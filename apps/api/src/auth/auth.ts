import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import type { Database } from "../database/database.js";
import * as schema from "../database/schema.js";

type AuthOptions = {
  db: Database;
  secret: string;
  baseURL: string;
};

export function createAuth({ db, secret, baseURL }: AuthOptions) {
  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
    emailAndPassword: { enabled: true },
    secret,
    baseURL,
  });
}

export type Auth = ReturnType<typeof createAuth>;
