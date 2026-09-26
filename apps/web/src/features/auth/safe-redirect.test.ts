import { describe, expect, it } from "vitest";

import { safeRedirect } from "./safe-redirect";

describe("safeRedirect", () => {
  it("keeps same-origin relative paths", () => {
    expect(safeRedirect("/settings?tab=profile")).toBe("/settings?tab=profile");
  });

  it.each([
    undefined,
    "",
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "/\t/evil.com",
    " //evil.com",
    "javascript:alert(1)",
  ])("falls back to / for %s", (value) => {
    expect(safeRedirect(value)).toBe("/");
  });
});
