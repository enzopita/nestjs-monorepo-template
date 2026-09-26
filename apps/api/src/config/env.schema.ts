import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  // Comma-separated origins (e.g. the web app) allowed to call the API with
  // credentials; drives both Better Auth's origin check and CORS.
  BETTER_AUTH_TRUSTED_ORIGINS: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.url())),
  // Cookies ignore ports, so apps sharing localhost need distinct prefixes.
  BETTER_AUTH_COOKIE_PREFIX: z
    .string()
    .regex(/^[\w-]+$/)
    .default("better-auth"),
  SWAGGER_ENABLED: z.stringbool().default(true),
  OBSERVE_APP_KEY: z.string().default(""),
  OBSERVE_APP_SECRET: z.string().default(""),
  OBSERVE_SERVICE_ID: z.string().min(1).default("api"),
});

export type Env = z.infer<typeof envSchema>;
