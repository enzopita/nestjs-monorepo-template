import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { relations } from "./relations.js";

export type Database = NodePgDatabase<typeof relations>;

/** The `tx` that `db.transaction()` passes its callback. */
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
