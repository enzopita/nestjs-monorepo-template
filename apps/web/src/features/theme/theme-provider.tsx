import {
  createContext,
  use,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export const THEME_STORAGE_KEY = "theme";

const themes = ["light", "dark", "system"] as const;

export type Theme = (typeof themes)[number];

type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return themes.some((theme) => theme === value);
}

// Storage can throw (private mode, blocked site data); the theme then lives in memory only.
function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Keep the in-memory choice.
  }
}

const darkQuery = "(prefers-color-scheme: dark)";

function subscribeToColorScheme(onChange: () => void) {
  const query = window.matchMedia(darkQuery);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function prefersDark() {
  return window.matchMedia(darkQuery).matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState(readStoredTheme);
  const systemDark = useSyncExternalStore(subscribeToColorScheme, prefersDark);
  const dark = theme === "dark" || (theme === "system" && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function setTheme(next: Theme) {
    storeTheme(next);
    setThemeState(next);
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  const value = use(ThemeContext);

  if (value === null) throw new Error("useTheme must be used inside ThemeProvider");

  return value;
}
