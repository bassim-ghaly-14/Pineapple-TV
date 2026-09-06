"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "pineapple-theme";

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
  }, [setTheme]);

  const applyTheme = useCallback((t: Theme) => {
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
    window.localStorage.setItem(STORAGE_KEY, t);
  }, [setTheme]);

  const toggle = useCallback(
    () => applyTheme(theme === "dark" ? "light" : "dark"),
    [applyTheme, theme],
  );

  const value = useMemo(
    () => ({ theme, toggle, setTheme: applyTheme }),
    [theme, toggle, applyTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
