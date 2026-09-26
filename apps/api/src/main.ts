import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule, ObserveInstrument } from "./app.module.js";
import { configureApp } from "./app.setup.js";
import type { Env } from "./config/env.schema.js";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    ObserveInstrument ? { instrument: ObserveInstrument } : {},
  );

  configureApp(app);

  const config = app.get<ConfigService<Env, true>>(ConfigService);

  await app.listen(config.get("PORT", { infer: true }), config.get("HOST", { infer: true }));
}

await bootstrap();
