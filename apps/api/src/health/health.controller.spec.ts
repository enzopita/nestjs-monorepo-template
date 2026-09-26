import { ServiceUnavailableException } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { Test } from "@nestjs/testing";
import { DatabaseHealthIndicator } from "./database.health.js";
import { HealthController } from "./health.controller.js";

type Status = "up" | "down";

async function createController(status: Status) {
  const fake = {
    isHealthy: (key: string) => Promise.resolve({ [key]: { status } }),
  };

  const moduleRef = await Test.createTestingModule({
    imports: [TerminusModule.forRoot({ logger: false })],
    controllers: [HealthController],
    providers: [{ provide: DatabaseHealthIndicator, useValue: fake }],
  }).compile();

  return moduleRef.get(HealthController);
}

async function readyError(status: Status) {
  const controller = await createController(status);
  const ready = controller.ready();

  await expect(ready).rejects.toBeInstanceOf(ServiceUnavailableException);

  return ready.catch((error: Error) =>
    error instanceof ServiceUnavailableException ? error.getResponse() : undefined,
  );
}

describe("HealthController", () => {
  it("live is ok even when the database is down", async () => {
    const controller = await createController("down");

    await expect(controller.live()).resolves.toMatchObject({ status: "ok" });
  });

  it("ready is ok when the database is up", async () => {
    const controller = await createController("up");

    await expect(controller.ready()).resolves.toMatchObject({
      status: "ok",
      details: { database: { status: "up" } },
    });
  });

  it("ready returns 503 with the failing dependency", async () => {
    await expect(readyError("down")).resolves.toMatchObject({
      status: "error",
      error: { database: { status: "down" } },
    });
  });
});
