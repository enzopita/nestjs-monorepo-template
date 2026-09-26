import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { createApp } from "./support/create-app.js";

describe("App (e2e)", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET / returns hello", async () => {
    const res = await app.inject({ method: "GET", url: "/" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("Hello World!");
  });
});
