import { envSchema } from "./env.schema.js";

describe("envSchema", () => {
  it("rejects an empty PORT instead of coercing it to 0", () => {
    expect(envSchema.shape.PORT.safeParse("").success).toBe(false);
  });
});

describe("BETTER_AUTH_TRUSTED_ORIGINS", () => {
  const origins = envSchema.shape.BETTER_AUTH_TRUSTED_ORIGINS;

  it("splits a comma-separated list and trims spaces", () => {
    expect(origins.parse("http://localhost:5173, https://app.example.com")).toEqual([
      "http://localhost:5173",
      "https://app.example.com",
    ]);
  });

  it("defaults to no extra origins", () => {
    expect(origins.parse(undefined)).toEqual([]);
  });

  it("rejects an entry that is not a URL", () => {
    expect(origins.safeParse("http://localhost:5173,nope").success).toBe(false);
  });
});

describe("BETTER_AUTH_COOKIE_PREFIX", () => {
  const prefix = envSchema.shape.BETTER_AUTH_COOKIE_PREFIX;

  it("rejects characters that are not valid in a cookie name", () => {
    expect(prefix.safeParse("my app;").success).toBe(false);
  });
});
