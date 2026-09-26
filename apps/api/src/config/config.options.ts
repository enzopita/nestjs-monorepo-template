import type { ConfigModuleOptions } from "@nestjs/config";
import { envSchema } from "./env.schema.js";

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  validationSchema: envSchema,
};
