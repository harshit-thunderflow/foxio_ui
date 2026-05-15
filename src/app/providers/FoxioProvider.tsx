import { createContext, useContext } from "react";
import { type FoxioConfig, defaultConfig } from "@/app/config";

const FoxioContext = createContext<FoxioConfig>(defaultConfig);

export function FoxioProvider({
  config,
  children,
}: {
  config?: Partial<FoxioConfig>;
  children: React.ReactNode;
}) {
  const merged = { ...defaultConfig, ...config };
  return <FoxioContext.Provider value={merged}>{children}</FoxioContext.Provider>;
}

export const useFoxio = () => useContext(FoxioContext);
