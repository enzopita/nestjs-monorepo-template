import type { NestApplicationOptions } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule, ObserveInstrument } from "./app.module.js";
import { EnvService } from "./config/env.service.js";
import { configureApp } from "./configure-app.js";

async function bootstrap() {
  // Better Auth parses its own requests; AuthModule re-adds parsers elsewhere.
  const options: NestApplicationOptions = { bodyParser: false };

  if (ObserveInstrument) {
    options.instrument = ObserveInstrument;
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    options,
  );

  app.enableShutdownHooks();
  configureApp(app);

  const env = app.get(EnvService);

  await app.listen(env.get("PORT"), env.get("HOST"));
}

await bootstrap();
