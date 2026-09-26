import { readdir } from "node:fs/promises";
import { is } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { z } from "zod";
import { relations } from "./relations.js";
import * as schema from "./schema.js";

const moduleSchema = z.record(z.string(), z.unknown());

async function featureSchemaFiles(): Promise<string[]> {
  const entries = await readdir(new URL("..", import.meta.url), { recursive: true });

  return entries.filter((entry) => entry.endsWith(".schema.ts"));
}

describe("database schema", () => {
  it("re-exports every feature table from the barrel", async () => {
    const barrelTables = new Set<unknown>(
      Object.values(schema).filter((value) => is(value, PgTable)),
    );

    const files = await featureSchemaFiles();

    expect(files).toContain("auth/auth.schema.ts");

    for (const file of files) {
      const module = moduleSchema.parse(await import(new URL(`../${file}`, import.meta.url).href));

      for (const [name, value] of Object.entries(module)) {
        if (is(value, PgTable)) {
          expect(barrelTables.has(value), `${file} exports ${name}`).toBe(true);
        }
      }
    }
  });

  it("keeps the generated auth relations after merging parts", () => {
    expect(Object.keys(relations.users.relations)).toEqual(
      expect.arrayContaining(["sessions", "accounts"]),
    );
    expect(Object.keys(relations.sessions.relations)).toContain("user");
  });
});
