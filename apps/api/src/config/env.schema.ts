import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  DATABASE_URL: z.url(),
  SWAGGER_ENABLED: z.stringbool().default(true),
  OBSERVE_APP_KEY: z.string().default(""),
  OBSERVE_APP_SECRET: z.string().default(""),
  OBSERVE_SERVICE_ID: z.string().min(1).default("api"),
});

export type Env = z.infer<typeof envSchema>;
