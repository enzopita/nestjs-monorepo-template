import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { HealthIndicatorService } from "@nestjs/terminus";
import { sql } from "drizzle-orm";
import type { Database } from "../database/database.js";

export const DATABASE_TIMEOUT_MS = 1500;

// /health/ready is public and polled by the web app; this keeps it from
// turning into a query per request.
const DATABASE_CACHE_MS = 5000;

@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    @InjectDrizzle() private readonly db: Database,
    private readonly health: HealthIndicatorService,
  ) {}

  isHealthy<const Key extends string>(key: Key) {
    return this.health
      .check(key)
      .attempt(async () => {
        try {
          await this.db.execute(sql`select 1`);
        } catch {
          // The endpoint is public: never echo driver errors (hosts, credentials).
          throw new Error("Database unreachable");
        }
      })
      .withTimeout(DATABASE_TIMEOUT_MS)
      .cacheFor(DATABASE_CACHE_MS);
  }
}
