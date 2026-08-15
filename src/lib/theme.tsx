import { createContext, useContext, useEffect, type ReactNode } from "react";

const ThemeCtx = createContext<{ theme: "dark"; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme: "dark", toggle: () => {} }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
