import { createApp } from "./support/create-app.js";

describe("Config (e2e)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails to boot with an invalid environment", async () => {
    await expect(createApp({ env: { PORT: "abc" } })).rejects.toThrow(/PORT/);
  });
});
