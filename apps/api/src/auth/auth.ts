import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import type { Env } from "../config/env.schema.js";
import type { Database } from "../database/database.js";
import * as schema from "../database/schema.js";

type AuthOptions = {
  db: Database;
  env: Pick<
    Env,
    | "NODE_ENV"
    | "BETTER_AUTH_SECRET"
    | "BETTER_AUTH_URL"
    | "BETTER_AUTH_TRUSTED_ORIGINS"
    | "BETTER_AUTH_COOKIE_PREFIX"
  >;
};

export function createAuth({ db, env }: AuthOptions) {
  const isProduction = env.NODE_ENV === "production";

  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS,
    emailAndPassword: { enabled: true },
    // Warn-level logs are client mistakes (e.g. "Invalid password"), not server faults.
    logger: { level: "error" },
    // Stored in Postgres so limits hold across instances.
    rateLimit: { enabled: isProduction, storage: "database" },
    advanced: {
      // Better Auth skips the origin check under NODE_ENV=test; keep it on.
      disableOriginCheck: false,
      cookiePrefix: env.BETTER_AUTH_COOKIE_PREFIX,
      // Client IP for rate limiting, set by Cloudflare at the edge.
      // X-Forwarded-For is client-controlled.
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
      // Force Secure cookies even when TLS terminates at a proxy.
      useSecureCookies: isProduction,
    },
    // Required by @thallesp/nestjs-better-auth to register @Hook providers.
    hooks: {},
    databaseHooks: {},
  });
}

export type Auth = ReturnType<typeof createAuth>;
