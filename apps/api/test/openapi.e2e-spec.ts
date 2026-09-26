import { Controller, Get } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { z } from "zod";
import { createApp } from "./support/create-app.js";

@Controller("probe")
class ProbeController {
  @AllowAnonymous()
  @Get()
  probe() {
    return { ok: true };
  }
}

describe("OpenAPI (e2e)", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await createApp([ProbeController]);
  });

  afterEach(async () => {
    await app.close();
  });

  it("serves the document with every controller route", async () => {
    const res = await app.inject({ method: "GET", url: "/docs-json" });

    expect(res.statusCode).toBe(200);

    const document = z.object({ paths: z.record(z.string(), z.object({})) }).parse(res.json());

    expect(Object.keys(document.paths)).toContain("/probe");
  });
});
