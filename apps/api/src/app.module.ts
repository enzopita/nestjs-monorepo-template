import { Module, StandardSchemaValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { DrizzleModule } from "@nestjs/drizzle";
import { createObserveModule } from "@nestjs/observe";
import { drizzle } from "drizzle-orm/node-postgres";
import { EnvModule } from "./config/env.module.js";
import { EnvService } from "./config/env.service.js";
import { relations } from "./database/relations.js";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    EnvModule,
    ObserveModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        appKey: env.get("OBSERVE_APP_KEY"),
        appSecret: env.get("OBSERVE_APP_SECRET"),
        serviceId: env.get("OBSERVE_SERVICE_ID"),
      }),
    }),
    DrizzleModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        drizzle,
        connection: env.get("DATABASE_URL"),
        relations,
      }),
    }),
  ],
  providers: [{ provide: APP_PIPE, useClass: StandardSchemaValidationPipe }],
})
export class AppModule {}
