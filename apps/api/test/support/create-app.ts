import type { Type } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "../../src/app.module.js";
import { configureApp } from "../../src/configure-app.js";

export async function createApp(controllers: Type[] = []): Promise<NestFastifyApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    controllers,
  }).compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter(), {
    bodyParser: false,
  });

  configureApp(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}
