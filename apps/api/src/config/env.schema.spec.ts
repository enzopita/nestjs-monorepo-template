import { envSchema } from "./env.schema.js";

describe("envSchema", () => {
  it("applies defaults when variables are missing", () => {
    expect(envSchema.parse({})).toEqual({
      NODE_ENV: "development",
      HOST: "0.0.0.0",
      PORT: 3000,
      SWAGGER_ENABLED: true,
    });
  });

  it("coerces PORT from string", () => {
    expect(envSchema.parse({ PORT: "8080" }).PORT).toBe(8080);
  });

  it.each(["abc", "0", "70000", "3000.5"])("rejects invalid PORT %s", (port) => {
    expect(envSchema.safeParse({ PORT: port }).success).toBe(false);
  });

  it("rejects unknown NODE_ENV", () => {
    expect(envSchema.safeParse({ NODE_ENV: "staging" }).success).toBe(false);
  });

  it("parses SWAGGER_ENABLED as a boolean string", () => {
    expect(envSchema.parse({ SWAGGER_ENABLED: "false" }).SWAGGER_ENABLED).toBe(false);
    expect(envSchema.safeParse({ SWAGGER_ENABLED: "maybe" }).success).toBe(false);
  });

  it("ignores unrelated environment variables", () => {
    expect(envSchema.parse({ PATH: "/usr/bin" })).not.toHaveProperty("PATH");
  });
});
