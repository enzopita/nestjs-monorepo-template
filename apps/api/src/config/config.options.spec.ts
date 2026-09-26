import { ConfigModule } from "@nestjs/config";
import { configModuleOptions } from "./config.options.js";

describe("configModuleOptions", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects an invalid environment", async () => {
    vi.stubEnv("PORT", "abc");

    await expect(ConfigModule.forRoot(configModuleOptions)).rejects.toThrow(/PORT/);
  });
});
