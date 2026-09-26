import { Controller, Get } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { createApp } from "./support/create-app.js";

@Controller("probe")
class ProbeController {
  @AllowAnonymous()
  @Get()
  probe() {
    return { ok: true };
  }
}

const trustedOrigin = "http://localhost:5173";

function preflight(app: NestFastifyApplication, url: string, origin: string) {
  return app.inject({
    method: "OPTIONS",
    url,
    headers: { origin, "access-control-request-method": "GET" },
  });
}

describe("CORS (e2e)", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await createApp([ProbeController]);
  });

  afterEach(async () => {
    await app.close();
  });

  it.each(["/probe", "/api/auth/get-session"])(
    "allows credentialed requests to %s from a trusted origin",
    async (url) => {
      const res = await preflight(app, url, trustedOrigin);

      expect(res.headers["access-control-allow-origin"]).toBe(trustedOrigin);
      expect(res.headers["access-control-allow-credentials"]).toBe("true");
    },
  );

  it.each(["/probe", "/api/auth/get-session"])(
    "exposes the response of %s to a trusted origin",
    async (url) => {
      const res = await app.inject({ method: "GET", url, headers: { origin: trustedOrigin } });

      expect(res.headers["access-control-allow-origin"]).toBe(trustedOrigin);
      expect(res.headers["access-control-allow-credentials"]).toBe("true");
    },
  );

  it.each(["/probe", "/api/auth/get-session"])(
    "does not allow %s from an untrusted origin",
    async (url) => {
      const res = await preflight(app, url, "https://evil.example.com");

      expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    },
  );
});
