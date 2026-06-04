import { createContext, useContext, useRef, useCallback } from "react";

type BlockerFn = () => boolean;

interface NavigationGuardContextValue {
  registerBlocker: (fn: BlockerFn) => void;
  unregisterBlocker: () => void;
  canNavigate: () => boolean;
}

const NavigationGuardContext = createContext<NavigationGuardContextValue>({
  registerBlocker: () => {},
  unregisterBlocker: () => {},
  canNavigate: () => true,
});

export function NavigationGuardProvider({ children }: { children: React.ReactNode }) {
  const blockerRef = useRef<BlockerFn | null>(null);

  const registerBlocker = useCallback((fn: BlockerFn) => {
    blockerRef.current = fn;
  }, []);

  const unregisterBlocker = useCallback(() => {
    blockerRef.current = null;
  }, []);

  const canNavigate = useCallback(() => {
    if (blockerRef.current) return !blockerRef.current();
    return true;
  }, []);

  return (
    <NavigationGuardContext.Provider value={{ registerBlocker, unregisterBlocker, canNavigate }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export const useNavigationGuard = () => useContext(NavigationGuardContext);
