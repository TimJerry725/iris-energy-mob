import * as SystemUI from "expo-system-ui";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
    MD3DarkTheme,
    MD3LightTheme,
    configureFonts,
    type MD3Theme,
} from "react-native-paper";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface ThemeColors {
    primary: string;
    secondary: string;
    tertiary: string;
    onPrimary: string;
    onSecondary: string;
    onTertiary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    background: string;
    foreground: string;
    surface: string;
    surfaceVariant: string;
    surfaceContainer: string;
    surfaceContainerLow: string;
    surfaceContainerHigh: string;
    card: string;
    muted: string;
    border: string;
    outline: string;
    outlineVariant: string;
    success: string;
    danger: string;
    warning: string;
    onSurface: string;
    onSurfaceVariant: string;
    inverseSurface: string;
    backdrop: string;
}

interface ThemeContextType {
    theme: Theme;
    themePreference: ThemePreference;
    setThemePreference: (pref: ThemePreference) => void;
    toggleTheme: () => void;
    colors: ThemeColors;
    paperTheme: MD3Theme;
}

const paperFonts = configureFonts({
    config: {
        default: {
            fontFamily: "IBMPlexSans_400Regular",
            fontWeight: "400",
            letterSpacing: 0,
            lineHeight: 20,
            fontSize: 14,
        },
        bodyLarge: {
            fontFamily: "IBMPlexSans_400Regular",
            fontWeight: "400",
            lineHeight: 24,
            fontSize: 16,
            letterSpacing: 0.15,
        },
        bodyMedium: {
            fontFamily: "IBMPlexSans_400Regular",
            fontWeight: "400",
            lineHeight: 20,
            fontSize: 14,
            letterSpacing: 0.25,
        },
        bodySmall: {
            fontFamily: "IBMPlexSans_400Regular",
            fontWeight: "400",
            lineHeight: 16,
            fontSize: 12,
            letterSpacing: 0.4,
        },
        titleLarge: {
            fontFamily: "IBMPlexSans_700Bold",
            fontWeight: "700",
            lineHeight: 28,
            fontSize: 22,
            letterSpacing: 0,
        },
        titleMedium: {
            fontFamily: "IBMPlexSans_500Medium",
            fontWeight: "500",
            lineHeight: 24,
            fontSize: 16,
            letterSpacing: 0.15,
        },
        titleSmall: {
            fontFamily: "IBMPlexSans_500Medium",
            fontWeight: "500",
            lineHeight: 20,
            fontSize: 14,
            letterSpacing: 0.1,
        },
        labelLarge: {
            fontFamily: "IBMPlexSans_700Bold",
            fontWeight: "700",
            lineHeight: 20,
            fontSize: 14,
            letterSpacing: 0.1,
        },
        labelMedium: {
            fontFamily: "IBMPlexSans_700Bold",
            fontWeight: "700",
            lineHeight: 16,
            fontSize: 12,
            letterSpacing: 0.5,
        },
        labelSmall: {
            fontFamily: "IBMPlexSans_700Bold",
            fontWeight: "700",
            lineHeight: 16,
            fontSize: 11,
            letterSpacing: 0.5,
        },
        headlineLarge: {
            fontFamily: "IBMPlexSans_700Bold",
            fontWeight: "700",
            lineHeight: 40,
            fontSize: 32,
            letterSpacing: 0,
        },
        headlineMedium: {
            fontFamily: "IBMPlexSans_700Bold",
            fontWeight: "700",
            lineHeight: 36,
            fontSize: 28,
            letterSpacing: 0,
        },
        headlineSmall: {
            fontFamily: "IBMPlexSans_700Bold",
            fontWeight: "700",
            lineHeight: 32,
            fontSize: 24,
            letterSpacing: 0,
        },
    },
});

const LIGHT_THEME: MD3Theme = {
    ...MD3LightTheme,
    roundness: 8,
    fonts: paperFonts,
    colors: {
        ...MD3LightTheme.colors,
        primary: "#00E673",
        onPrimary: "#04150E",
        primaryContainer: "#89F8CA",
        onPrimaryContainer: "#002116",
        secondary: "#1FD0B4",
        onSecondary: "#061514",
        secondaryContainer: "#E0F2F1",
        onSecondaryContainer: "#00201A",
        tertiary: "#3EBAF4",
        onTertiary: "#071823",
        tertiaryContainer: "#BEEAF9",
        onTertiaryContainer: "#001F28",
        surface: "#FFFFFF",
        surfaceVariant: "#F2F2F2",
        surfaceDisabled: "#151E1A1F",
        background: "#FAFBFA", // Premium off-white
        error: "#BA1A1A",
        errorContainer: "#FFDAD6",
        onSurface: "#152E24",
        onSurfaceVariant: "#4A5E5B",
        onSurfaceDisabled: "#151E1A61",
        onError: "#FFFFFF",
        onErrorContainer: "#410002",
        onBackground: "#152E24",
        outline: "#D6E4E2",
        outlineVariant: "#EBF2F1",
        inverseSurface: "#2A322E",
        inverseOnSurface: "#EBF2ED",
        inversePrimary: "#00E673",
        shadow: "#000000",
        scrim: "#000000",
        backdrop: "rgba(45, 54, 49, 0.4)",
        elevation: {
            level0: "transparent",
            level1: "#FFFFFF",
            level2: "#FFFFFF",
            level3: "#FFFFFF",
            level4: "#FFFFFF",
            level5: "#FFFFFF",
        },
    },
};

const DARK_THEME: MD3Theme = {
    ...MD3DarkTheme,
    roundness: 8,
    fonts: paperFonts,
    colors: {
        ...MD3DarkTheme.colors,
        primary: "#00E673",
        onPrimary: "#04150E",
        primaryContainer: "#00513B",
        onPrimaryContainer: "#89F8CA",
        secondary: "#1FD0B4",
        onSecondary: "#061514",
        secondaryContainer: "#344B43",
        onSecondaryContainer: "#CEE9DD",
        tertiary: "#3EBAF4",
        onTertiary: "#071823",
        tertiaryContainer: "#214C5A",
        onTertiaryContainer: "#BEEAF9",
        surface: "#121214",
        surfaceVariant: "#1A1A1D",
        surfaceDisabled: "#FFFFFF1F",
        background: "#0B0B0C",
        error: "#FFB4AB",
        errorContainer: "#93000A",
        onSurface: "#E2E2E6",
        onSurfaceVariant: "#8C929D",
        onSurfaceDisabled: "#FFFFFF3D",
        onError: "#690005",
        onErrorContainer: "#FFDAD6",
        onBackground: "#E2E2E6",
        outline: "#3A3D42",
        outlineVariant: "#1A1A1D",
        inverseSurface: "#E2E2E6",
        inverseOnSurface: "#1B1B1F",
        inversePrimary: "#00E673",
        shadow: "#000000",
        scrim: "#000000",
        backdrop: "rgba(0, 0, 0, 0.6)",
        elevation: {
            level0: "transparent",
            level1: "#121214",
            level2: "#161619",
            level3: "#1A1A1D",
            level4: "#1E1E22",
            level5: "#242428",
        },
    },
};

const getExtendedColors = (paperTheme: MD3Theme): ThemeColors => {
    const isDark = paperTheme.dark;

    return {
        primary: paperTheme.colors.primary,
        secondary: paperTheme.colors.secondary,
        tertiary: paperTheme.colors.tertiary,
        onPrimary: paperTheme.colors.onPrimary,
        onSecondary: paperTheme.colors.onSecondary,
        onTertiary: paperTheme.colors.onTertiary,
        primaryContainer: paperTheme.colors.primaryContainer,
        onPrimaryContainer: paperTheme.colors.onPrimaryContainer,
        secondaryContainer: paperTheme.colors.secondaryContainer,
        onSecondaryContainer: paperTheme.colors.onSecondaryContainer,
        tertiaryContainer: paperTheme.colors.tertiaryContainer,
        onTertiaryContainer: paperTheme.colors.onTertiaryContainer,
        background: paperTheme.colors.background,
        foreground: paperTheme.colors.onBackground,
        surface: paperTheme.colors.surface,
        surfaceVariant: paperTheme.colors.surfaceVariant,
        surfaceContainer: isDark ? "#121214" : "#E8F0EA",
        surfaceContainerLow: isDark ? "#0B0B0C" : "#FFFFFF",
        surfaceContainerHigh: isDark ? "#1A1A1D" : "#E1EAE4",
        card: isDark ? "#121214" : "#FFFFFF",
        muted: paperTheme.colors.onSurfaceVariant,
        border: isDark ? "#1A1A1D" : paperTheme.colors.outlineVariant,
        outline: paperTheme.colors.outline,
        outlineVariant: paperTheme.colors.outlineVariant,
        success: paperTheme.colors.primary,
        danger: paperTheme.colors.error,
        warning: isDark ? "#F7C974" : "#8B5E00",
        onSurface: paperTheme.colors.onSurface,
        onSurfaceVariant: paperTheme.colors.onSurfaceVariant,
        inverseSurface: paperTheme.colors.inverseSurface,
        backdrop: paperTheme.colors.backdrop,
    };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const fallbackPaperTheme = LIGHT_THEME;
const fallbackContextValue: ThemeContextType = {
    theme: "light",
    themePreference: "light",
    setThemePreference: () => { },
    toggleTheme: () => { },
    colors: getExtendedColors(LIGHT_THEME),
    paperTheme: fallbackPaperTheme,
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themePreference, setThemePreference] = useState<ThemePreference>("light");

    const systemTheme: Theme = systemColorScheme === "dark" ? "dark" : "light";
    const theme = themePreference === "system" ? systemTheme : themePreference;

    const paperTheme = useMemo(
        () => (theme === "dark" ? DARK_THEME : LIGHT_THEME),
        [theme]
    );
    const colors = useMemo(() => getExtendedColors(paperTheme), [paperTheme]);

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colors.background).catch(() => undefined);
    }, [colors.background]);

    const toggleTheme = () => {
        setThemePreference((current) => {
            const effectiveTheme = current === "system" ? systemTheme : current;
            return effectiveTheme === "dark" ? "light" : "dark";
        });
    };

    const value = useMemo(
        () => ({
            theme,
            themePreference,
            setThemePreference,
            toggleTheme,
            colors,
            paperTheme,
        }),
        [colors, paperTheme, theme, themePreference]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    return context ?? fallbackContextValue;
};
