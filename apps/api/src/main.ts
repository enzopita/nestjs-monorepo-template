import { NestFactory } from "@nestjs/core";
import { AppModule, ObserveInstrument } from "./app.module.js";

async function bootstrap() {
  const app = ObserveInstrument
    ? await NestFactory.create(AppModule, { instrument: ObserveInstrument })
    : await NestFactory.create(AppModule);

  await app.listen(process.env["PORT"] ?? 3000);
}

await bootstrap();
