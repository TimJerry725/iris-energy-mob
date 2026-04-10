import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface IrisTextProps extends TextProps {
    variant?: "h1" | "h2" | "h3" | "p" | "muted" | "metric";
    align?: "left" | "center" | "right";
    className?: string;
}

/**
 * Maps a fontWeight value to the correct IBM Plex Sans font family name.
 * In React Native, custom fonts require explicit font file names per weight.
 */
const resolveFontFamily = (weight?: TextStyle["fontWeight"]): string => {
    switch (weight) {
        case "bold":
        case "700":
        case "800":
        case "900":
            return "IBMPlexSans_700Bold";
        case "500":
        case "600":
            return "IBMPlexSans_500Medium";
        case "normal":
        case "100":
        case "200":
        case "300":
        case "400":
        default:
            return "IBMPlexSans_400Regular";
    }
};

const getVariantFontFamily = (variant: IrisTextProps["variant"]): string => {
    switch (variant) {
        case "metric":
        case "h1":
        case "h2":
            return "IBMPlexSans_700Bold";
        case "h3":
            return "IBMPlexSans_500Medium";
        case "p":
        case "muted":
        default:
            return "IBMPlexSans_400Regular";
    }
};

const getVariantStyles = (variant: IrisTextProps["variant"]): string => {
    switch (variant) {
        case "metric":
            return "text-4xl leading-tight tracking-tight";
        case "h1":
            return "text-2xl leading-tight mb-2";
        case "h2":
            return "text-xl leading-snug mb-1";
        case "h3":
            return "text-base leading-normal mb-0";
        case "p":
            return "text-base leading-relaxed";
        case "muted":
            return "text-sm leading-relaxed opacity-70";
        default:
            return "text-base leading-relaxed";
    }
};

export const IrisText: React.FC<IrisTextProps> = ({
    children,
    variant = "p",
    align = "left",
    className,
    style,
    ...props
}) => {
    const { colors } = useTheme();
    const textColor = variant === "muted" ? colors.muted : colors.foreground;

    // Resolve the flat style to extract fontWeight if provided
    const flatStyle = StyleSheet.flatten(style) as TextStyle | undefined;
    const inlineWeight = flatStyle?.fontWeight;

    // If the caller passed a fontWeight via style, use that to pick the font;
    // otherwise fall back to the variant default.
    const fontFamily = inlineWeight
        ? resolveFontFamily(inlineWeight)
        : getVariantFontFamily(variant);

    return (
        <Text
            style={[{ color: textColor, fontFamily }, style]}
            className={`${getVariantStyles(variant)} text-${align} ${className}`}
            {...props}
        >
            {children}
        </Text>
    );
};
