import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { FoxioProvider } from "@/app/providers/FoxioProvider";
import { PageContextProvider } from "@/app/providers/PageContextProvider";
import { AuthProvider } from "@/hooks";
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
        <AuthProvider>
          <PageContextProvider>
            <MemoryRouter initialEntries={[config?.initialRoute ?? "/tutorial"]}>
              <AppRoutes />
            </MemoryRouter>
          </PageContextProvider>
        </AuthProvider>
      </FoxioProvider>
    </ThemeProvider>
  );
}
