import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_STORAGE_KEY, ThemeProvider, useTheme } from "./theme-provider";

function stubColorScheme(prefersDark: boolean) {
  const listeners = new Set<() => void>();

  const query = {
    matches: prefersDark,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  };

  vi.stubGlobal("matchMedia", () => query);

  return {
    change(next: boolean) {
      query.matches = next;

      for (const listener of listeners) listener();
    },
  };
}

function Probe() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <p>theme:{theme}</p>
      <button onClick={() => setTheme("dark")}>dark</button>
      <button onClick={() => setTheme("system")}>system</button>
    </>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    vi.unstubAllGlobals();
  });

  it("defaults to system and follows the OS preference", () => {
    const scheme = stubColorScheme(true);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    expect(screen.getByText("theme:system")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");

    act(() => scheme.change(false));
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("persists the chosen theme", async () => {
    stubColorScheme(false);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "dark" }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("works when storage is unavailable", async () => {
    stubColorScheme(false);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "dark" }));

    expect(screen.getByText("theme:dark")).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
