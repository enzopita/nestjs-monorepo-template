import { defineRelations } from "drizzle-orm";
import { authRelations } from "./auth-schema.js";
import * as schema from "./schema.js";

export const relations = { ...defineRelations(schema), ...authRelations };
