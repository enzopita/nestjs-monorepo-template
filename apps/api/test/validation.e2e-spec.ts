import { Body, Controller, Post } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { z } from "zod";
import { createApp } from "./support/create-app.js";

const echoSchema = z.object({ name: z.string().min(1) });

@AllowAnonymous()
@Controller("echo")
class EchoController {
  @Post()
  echo(@Body({ schema: echoSchema }) body: z.infer<typeof echoSchema>) {
    return body;
  }
}

describe("Validation (e2e)", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    app = await createApp([EchoController]);
  });

  afterEach(async () => {
    await app.close();
  });

  it("accepts a valid body", async () => {
    const res = await app.inject({ method: "POST", url: "/echo", payload: { name: "a" } });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({ name: "a" });
  });

  it("rejects an invalid body with 400", async () => {
    const res = await app.inject({ method: "POST", url: "/echo", payload: { name: "" } });

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain("name");
  });
});
