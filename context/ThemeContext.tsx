import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as useNativeColorScheme } from "react-native";
import { useColorScheme as useNWColorScheme } from "nativewind";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: {
        primary: string;
        background: string;
        foreground: string;
        card: string;
        muted: string;
    };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useNativeColorScheme();
    const { setColorScheme } = useNWColorScheme();

    // Default to dark theme
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        // Set NativeWind color scheme to match our theme
        setColorScheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    };

    const colors = {
        primary: theme === "light" ? "#00E673" : "#00FF7F",
        background: theme === "light" ? "#FFFFFF" : "#000000",
        foreground: theme === "light" ? "#0F172A" : "#FFFFFF",
        card: theme === "light" ? "#F8FAFC" : "#111111",
        muted: theme === "light" ? "#64748B" : "#666666",
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback for safety during initialization
        return {
            theme: "dark" as Theme,
            toggleTheme: () => { },
            colors: {
                primary: "#00FF7F",
                background: "#000000",
                foreground: "#FFFFFF",
                card: "#111111",
                muted: "#666666",
            }
        };
    }
    return context;
};
