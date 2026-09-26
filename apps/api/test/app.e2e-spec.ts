import { Body, Controller, Post } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { z } from "zod";

const echoSchema = z.object({ name: z.string().min(1) });

@Controller("echo")
class EchoController {
  @Post()
  echo(@Body({ schema: echoSchema }) body: z.infer<typeof echoSchema>) {
    return body;
  }
}

async function createApp(env: Record<string, string> = {}) {
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value);
  }

  // ConfigModule.forRoot validates the environment when app.module is
  // evaluated, so each environment needs a fresh module graph.
  vi.resetModules();

  const { AppModule } = await import("../src/app.module.js");
  const { configureApp } = await import("../src/app.setup.js");

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    controllers: [EchoController],
  }).compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  configureApp(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}

describe("App (e2e)", () => {
  let app: NestFastifyApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
    vi.unstubAllEnvs();
  });

  it("GET / returns hello", async () => {
    app = await createApp();

    const res = await app.inject({ method: "GET", url: "/" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("Hello World!");
  });

  it("validates bodies with Zod", async () => {
    app = await createApp();

    const ok = await app.inject({ method: "POST", url: "/echo", payload: { name: "a" } });
    const bad = await app.inject({ method: "POST", url: "/echo", payload: { name: "" } });

    expect(ok.statusCode).toBe(201);
    expect(ok.json()).toEqual({ name: "a" });
    expect(bad.statusCode).toBe(400);
    expect(bad.body).toContain("name");
  });

  it("serves the OpenAPI document", async () => {
    app = await createApp();

    const res = await app.inject({ method: "GET", url: "/docs-json" });

    expect(res.statusCode).toBe(200);

    const document = z
      .object({ openapi: z.string(), paths: z.record(z.string(), z.unknown()) })
      .parse(res.json());

    expect(document.paths).toHaveProperty("/");
  });

  it("hides the OpenAPI document when disabled", async () => {
    app = await createApp({ SWAGGER_ENABLED: "false" });

    const res = await app.inject({ method: "GET", url: "/docs-json" });

    expect(res.statusCode).toBe(404);
  });

  it("fails to boot with an invalid environment", async () => {
    await expect(createApp({ PORT: "abc" })).rejects.toThrow(/PORT/);
  });
});
