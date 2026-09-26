import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env.schema.js";
import { EnvService } from "./env.service.js";

@Global()
@Module({
  imports: [ConfigModule.forRoot({ cache: true, validationSchema: envSchema })],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
