import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { EnvService } from "./config/env.service.js";

// Everything the app needs besides process lifecycle, shared by main.ts and the
// e2e tests so both run the same setup.
export function configureApp(app: NestFastifyApplication): void {
  const env = app.get(EnvService);

  // The web app lives on its own origin (e.g. app.x.com → api.x.com) and sends
  // the session cookie, so it needs credentialed CORS. AuthModule handles
  // /api/auth itself: its handler writes the raw response, which skips the
  // headers @fastify/cors sets on the reply.
  app.enableCors({ origin: env.get("BETTER_AUTH_TRUSTED_ORIGINS"), credentials: true });

  if (env.get("SWAGGER_ENABLED")) {
    const document = new DocumentBuilder().setTitle("API").setVersion("0.0.1").build();

    SwaggerModule.setup("docs", app, () => SwaggerModule.createDocument(app, document));
  }
}
