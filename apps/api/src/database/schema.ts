// Barrel of every Drizzle table. Each feature owns its tables in
// `<feature>.schema.ts`; re-export it here so drizzle-kit, the relations and
// the Better Auth adapter see it.
export * from "../auth/auth.schema.js";
