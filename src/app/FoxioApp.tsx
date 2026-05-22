import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { FoxioProvider } from "@/app/providers/FoxioProvider";
import { AppRoutes } from "@/app/router/AppRoutes";
import { type FoxioConfig } from "@/app/config";

interface FoxioAppProps {
  config?: Partial<FoxioConfig>;
  targetElement?: HTMLElement | null;
}

export function FoxioApp({ config, targetElement }: FoxioAppProps) {
  return (
    <ThemeProvider
      defaultTheme={config?.theme ?? "light"}
      defaultColorTheme={config?.colorTheme ?? "magenta"}
      targetElement={targetElement}
    >
      <FoxioProvider config={config}>
        <MemoryRouter initialEntries={[config?.initialRoute ?? "/tutorial"]}>
          <AppRoutes />
        </MemoryRouter>
      </FoxioProvider>
    </ThemeProvider>
  );
}
