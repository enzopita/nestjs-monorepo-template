import { defineConfig } from "orval";

// Reads the spec from the running API (SWAGGER_ENABLED=true), so start it first.
export default defineConfig({
  api: {
    input: {
      target: process.env["OPENAPI_URL"] ?? "http://localhost:3000/docs-json",
    },
    output: {
      mode: "tags-split",
      target: "src/api/generated",
      schemas: { path: "src/api/generated/model", type: "zod" },
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        // Responses are parsed with the generated Zod schemas inside customFetch.
        mutator: { path: "src/api/fetcher.ts", name: "customFetch" },
        includeZodSchemaInArguments: true,
        fetch: { includeHttpResponseReturnType: false, runtimeValidation: true },
        query: { signal: true, shouldExportKeys: true },
      },
    },
    hooks: {
      afterAllFilesWrite: "oxfmt",
    },
  },
});
