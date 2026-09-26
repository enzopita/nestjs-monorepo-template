import { envSchema } from "./env.schema.js";

describe("envSchema", () => {
  it("rejects an empty PORT instead of coercing it to 0", () => {
    expect(envSchema.shape.PORT.safeParse("").success).toBe(false);
  });
});
