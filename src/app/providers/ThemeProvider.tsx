import { createContext, useContext, useEffect, useState } from "react";
import type { ColorTheme } from "@/app/config";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  targetElement?: HTMLElement | null;
}

interface ThemeContextState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
}

const colorThemeVars: Record<ColorTheme, Record<string, string>> = {
  default: {
    "--primary": "oklch(0.205 0 0)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--ring": "oklch(0.708 0 0)",
  },
  blue: {
    "--primary": "oklch(0.488 0.243 264.376)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.932 0.032 264)",
    "--accent-foreground": "oklch(0.288 0.143 264)",
    "--card": "oklch(0.97 0.01 264)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--ring": "oklch(0.488 0.243 264.376)",
  },
  green: {
    "--primary": "oklch(0.527 0.154 150.069)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.932 0.032 150)",
    "--accent-foreground": "oklch(0.327 0.114 150)",
    "--card": "oklch(0.97 0.01 150)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--ring": "oklch(0.527 0.154 150.069)",
  },
  orange: {
    "--primary": "oklch(0.769 0.188 70.08)",
    "--primary-foreground": "oklch(0.145 0 0)",
    "--accent": "oklch(0.962 0.044 70)",
    "--accent-foreground": "oklch(0.469 0.128 70)",
    "--card": "oklch(0.98 0.01 70)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--ring": "oklch(0.769 0.188 70.08)",
  },
  rose: {
    "--primary": "oklch(0.585 0.233 3.958)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--accent": "oklch(0.932 0.032 4)",
    "--accent-foreground": "oklch(0.385 0.133 4)",
    "--card": "oklch(0.97 0.01 4)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--ring": "oklch(0.585 0.233 3.958)",
  },
};

const ThemeContext = createContext<ThemeContextState>({
  theme: "light",
  setTheme: () => null,
  colorTheme: "orange",
  setColorTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultColorTheme = "orange",
  targetElement,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorTheme);

  useEffect(() => {
    const target = targetElement ?? document.documentElement;
    target.classList.remove("light", "dark");
    if (theme === "system") {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      target.classList.add(sys);
    } else {
      target.classList.add(theme);
    }
  }, [theme, targetElement]);

  useEffect(() => {
    const target = targetElement ?? document.documentElement;
    const vars = colorThemeVars[colorTheme];
    Object.entries(vars).forEach(([key, value]) => {
      target.style.setProperty(key, value);
    });
  }, [colorTheme, targetElement]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
