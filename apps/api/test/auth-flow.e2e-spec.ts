import { randomUUID } from "node:crypto";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { getDrizzleToken } from "@nestjs/drizzle";
import { eq } from "drizzle-orm";
import type { Database } from "../src/database/database.js";
import { users } from "../src/database/schema.js";
import { createApp } from "./support/create-app.js";

// Runs against the local Postgres (`docker compose up -d`, `nub run db:migrate`).
describe("Auth flow (e2e)", () => {
  let app: NestFastifyApplication;
  const email = `e2e-${randomUUID()}@example.com`;
  const password = "correct-horse-battery";

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.get<Database>(getDrizzleToken()).delete(users).where(eq(users.email, email));
    await app.close();
  });

  it("signs up, signs in and reads the session from the cookie", async () => {
    const signUp = await app.inject({
      method: "POST",
      url: "/api/auth/sign-up/email",
      payload: { name: "E2E", email, password },
    });

    expect(signUp.statusCode).toBe(200);

    const signIn = await app.inject({
      method: "POST",
      url: "/api/auth/sign-in/email",
      // Cloudflare sets this; a client-supplied X-Forwarded-For must be ignored.
      headers: { "cf-connecting-ip": "203.0.113.7", "x-forwarded-for": "198.51.100.1" },
      payload: { email, password },
    });

    expect(signIn.statusCode).toBe(200);

    const cookie = signIn.headers["set-cookie"];
    expect(cookie).toBeDefined();

    const session = await app.inject({
      method: "GET",
      url: "/api/auth/get-session",
      headers: { cookie: [cookie].flat().join("; ") },
    });

    expect(session.statusCode).toBe(200);
    expect(session.json()).toMatchObject({
      user: { email },
      session: { ipAddress: "203.0.113.7" },
    });
  });

  it("rejects an untrusted origin", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/sign-in/email",
      headers: { origin: "https://evil.example.com", cookie: "x=1" },
      payload: { email, password },
    });

    expect(res.statusCode).toBe(403);
  });
});
