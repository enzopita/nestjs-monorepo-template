import { getDrizzleToken } from "@nestjs/drizzle";
import { TerminusModule } from "@nestjs/terminus";
import { Test } from "@nestjs/testing";
import { DATABASE_TIMEOUT_MS, DatabaseHealthIndicator } from "./database.health.js";

async function createIndicator(execute: () => Promise<{ rows: [] }>) {
  const moduleRef = await Test.createTestingModule({
    imports: [TerminusModule.forRoot({ logger: false })],
    providers: [DatabaseHealthIndicator, { provide: getDrizzleToken(), useValue: { execute } }],
  }).compile();

  return moduleRef.get(DatabaseHealthIndicator);
}

describe("DatabaseHealthIndicator", () => {
  it("reports up when the database answers", async () => {
    const indicator = await createIndicator(async () => ({ rows: [] }));

    await expect(indicator.isHealthy("database")).resolves.toMatchObject({
      database: { status: "up" },
    });
  });

  it("reports down without leaking the driver error", async () => {
    const indicator = await createIndicator(() =>
      Promise.reject(new Error("connect ECONNREFUSED 10.0.0.5:5432 password=secret")),
    );

    const result = await indicator.isHealthy("database");

    expect(result).toMatchObject({ database: { status: "down", message: "Database unreachable" } });
    expect(JSON.stringify(result)).not.toContain("ECONNREFUSED");
  });

  it("reports down when the database hangs", async () => {
    vi.useFakeTimers();
    const indicator = await createIndicator(() => new Promise(() => {}));

    const result = indicator.isHealthy("database");
    await vi.advanceTimersByTimeAsync(DATABASE_TIMEOUT_MS);

    await expect(result).resolves.toMatchObject({ database: { status: "down" } });
    vi.useRealTimers();
  });
});
