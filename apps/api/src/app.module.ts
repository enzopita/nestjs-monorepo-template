import { Module, StandardSchemaValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { createObserveModule } from "@nestjs/observe";
import { EnvModule } from "./config/env.module.js";
import { EnvService } from "./config/env.service.js";

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
  ],
  providers: [{ provide: APP_PIPE, useClass: StandardSchemaValidationPipe }],
})
export class AppModule {}
