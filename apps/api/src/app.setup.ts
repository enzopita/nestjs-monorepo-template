import { StandardSchemaValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { Env } from "./config/env.schema.js";

export function configureApp(app: NestFastifyApplication): void {
  app.useGlobalPipes(new StandardSchemaValidationPipe());

  const config = app.get<ConfigService<Env, true>>(ConfigService);

  if (config.get("SWAGGER_ENABLED", { infer: true })) {
    const document = new DocumentBuilder().setTitle("API").setVersion("0.0.1").build();

    SwaggerModule.setup("docs", app, () => SwaggerModule.createDocument(app, document));
  }
}
