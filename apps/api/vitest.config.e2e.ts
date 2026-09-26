import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: "./",
    include: ["**/*.e2e-spec.ts"],
    // The pg pool connects lazily, so e2e tests need a URL but no database.
    env: { DATABASE_URL: "postgres://postgres:postgres@localhost:5432/api" },
  },
});
