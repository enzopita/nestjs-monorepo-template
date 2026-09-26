import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { z } from "zod";
import { createApp } from "./support/create-app.js";

const openApiDocumentSchema = z.object({
  openapi: z.string(),
  paths: z.record(z.string(), z.unknown()),
});

describe("Swagger (e2e)", () => {
  let app: NestFastifyApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
    vi.unstubAllEnvs();
  });

  it("serves the OpenAPI document", async () => {
    app = await createApp();

    const res = await app.inject({ method: "GET", url: "/docs-json" });

    expect(res.statusCode).toBe(200);

    const document = openApiDocumentSchema.parse(res.json());

    expect(document.paths).toHaveProperty("/");
  });

  it("hides the OpenAPI document when disabled", async () => {
    app = await createApp({ env: { SWAGGER_ENABLED: "false" } });

    const res = await app.inject({ method: "GET", url: "/docs-json" });

    expect(res.statusCode).toBe(404);
  });
});
