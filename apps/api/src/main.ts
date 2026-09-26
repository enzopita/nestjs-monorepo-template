import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule, ObserveInstrument } from "./app.module.js";
import { EnvService } from "./config/env.service.js";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    ObserveInstrument ? { instrument: ObserveInstrument } : {},
  );

  const env = app.get(EnvService);

  if (env.get("SWAGGER_ENABLED")) {
    const document = new DocumentBuilder().setTitle("API").setVersion("0.0.1").build();

    SwaggerModule.setup("docs", app, () => SwaggerModule.createDocument(app, document));
  }

  await app.listen(env.get("PORT"), env.get("HOST"));
}

await bootstrap();
