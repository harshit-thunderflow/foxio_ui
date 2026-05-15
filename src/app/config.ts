export type ColorTheme = "default" | "blue" | "green" | "orange" | "rose";

export interface FoxioConfig {
  title?: string;
  logo?: string;
  initialRoute?: string;
  theme?: "light" | "dark" | "system";
  colorTheme?: ColorTheme;
  onClose?: () => void;
}

export const defaultConfig: FoxioConfig = {
  title: "Foxio",
  logo: "/fox.png",
  initialRoute: "/tutorial",
  theme: "light",
  colorTheme: "green",
};
