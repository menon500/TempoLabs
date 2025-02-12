import { createContext, useContext } from "react";

export const ThemeProviderContext = createContext<{
  theme: string | undefined;
  setTheme: (theme: string) => void;
}>({ theme: undefined, setTheme: () => null });

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
