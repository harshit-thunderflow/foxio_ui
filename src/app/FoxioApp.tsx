import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { FoxioProvider } from "@/app/providers/FoxioProvider";
import { PageContextProvider } from "@/app/providers/PageContextProvider";
import { AuthProvider, PageTitleProvider } from "@/hooks";
import { AppRoutes } from "@/app/router/AppRoutes";
import { ToastProvider } from "@/components/ui/toast";
import { PortalContainerProvider } from "@/components/ui/portal-container";
import { NavigationGuardProvider } from "@/hooks/useNavigationGuard";
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
      <PortalContainerProvider container={targetElement || null}>
        <FoxioProvider config={config}>
          <ToastProvider>
            <NavigationGuardProvider>
              <AuthProvider>
                <PageContextProvider>
                  <PageTitleProvider>
                    <MemoryRouter initialEntries={[config?.initialRoute ?? "/tutorial"]}>
                      <AppRoutes />
                    </MemoryRouter>
                  </PageTitleProvider>
                </PageContextProvider>
              </AuthProvider>
            </NavigationGuardProvider>
          </ToastProvider>
        </FoxioProvider>
      </PortalContainerProvider>
    </ThemeProvider>
  );
}
