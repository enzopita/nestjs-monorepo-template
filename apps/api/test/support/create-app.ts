import type { Type } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";

interface CreateAppOptions {
  env?: Record<string, string>;
  controllers?: Type[];
}

export async function createApp(options: CreateAppOptions = {}): Promise<NestFastifyApplication> {
  for (const [key, value] of Object.entries(options.env ?? {})) {
    vi.stubEnv(key, value);
  }

  // ConfigModule.forRoot validates the environment when app.module is
  // evaluated, so each environment needs a fresh module graph.
  vi.resetModules();

  const { AppModule } = await import("../../src/app.module.js");
  const { configureApp } = await import("../../src/app.setup.js");

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    controllers: options.controllers ?? [],
  }).compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  configureApp(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}
