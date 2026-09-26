import { defineRelations } from "drizzle-orm";
import { authRelations } from "../auth/auth.schema.js";
import * as schema from "./schema.js";

// Each feature declares its relations with `defineRelationsPart` next to its
// tables; spread every part here.
export const relations = { ...defineRelations(schema), ...authRelations };
