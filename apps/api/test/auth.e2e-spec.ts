import { Controller, Get } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { createApp } from "./support/create-app.js";

@Controller("probe")
class ProbeController {
  @Get("private")
  private() {
    return { ok: true };
  }

  @AllowAnonymous()
  @Get("public")
  public() {
    return { ok: true };
  }
}

describe("Auth (e2e)", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await createApp([ProbeController]);
  });

  afterEach(async () => {
    await app.close();
  });

  it("rejects a protected route without a session", async () => {
    const res = await app.inject({ method: "GET", url: "/probe/private" });

    expect(res.statusCode).toBe(401);
  });

  it("allows an anonymous route without a session", async () => {
    const res = await app.inject({ method: "GET", url: "/probe/public" });

    expect(res.statusCode).toBe(200);
  });

  it("mounts the Better Auth handler", async () => {
    const res = await app.inject({ method: "GET", url: "/api/auth/ok" });

    expect(res.statusCode).toBe(200);
  });
});
