"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getThemePreference } from "@/app/_actions/theme";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  systemTheme: "light" | "dark";
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  systemTheme: "light",
  resolvedTheme: "light",
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<Theme>("light");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Check system preference
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      setMounted(true);
      
      // Set initial system theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setSystemTheme(prefersDark ? "dark" : "light");
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Load theme from database when user is authenticated
  useEffect(() => {
    const loadThemeFromDB = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const result = await getThemePreference();
          if (result.success) {
            setTheme(result.theme as Theme);
          }
        } catch (error) {
          console.error("Failed to load theme from database:", error);
        }
      }
    };

    if (mounted && status === "authenticated") {
      loadThemeFromDB();
    }
  }, [mounted, status, session?.user?.email]);

  // Calculate resolved theme
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("light", "dark");
    
    // Add current theme class
    root.classList.add(resolvedTheme);
    
    // Update color-scheme
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, mounted]);

  // Provide theme context
  const contextValue: ThemeContextType = {
    theme,
    systemTheme,
    resolvedTheme,
  };

  // Return children directly when not mounted to prevent hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
} 