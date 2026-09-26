import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { createApp } from "./support/create-app.js";

// Runs against the local Postgres (`docker compose up -d`).
describe("Health (e2e)", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("reports liveness without a session", async () => {
    const res = await app.inject({ method: "GET", url: "/health/live" });

    expect(res.statusCode).toBe(200);
  });

  it("reports the database as up without a session", async () => {
    const res = await app.inject({ method: "GET", url: "/health/ready" });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: "ok", details: { database: { status: "up" } } });
  });
});
