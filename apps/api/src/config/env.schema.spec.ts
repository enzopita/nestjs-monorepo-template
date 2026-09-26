import { envSchema } from "./env.schema.js";

describe("envSchema", () => {
  it('parses SWAGGER_ENABLED="false" as false, not as a truthy string', () => {
    expect(envSchema.parse({ SWAGGER_ENABLED: "false" }).SWAGGER_ENABLED).toBe(false);
  });

  it("rejects an empty PORT instead of coercing it to 0", () => {
    expect(envSchema.safeParse({ PORT: "" }).success).toBe(false);
  });
});
