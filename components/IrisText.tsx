import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface IrisTextProps extends TextProps {
    variant?: "h1" | "h2" | "h3" | "p" | "muted" | "metric";
    align?: "left" | "center" | "right";
}

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

    const getVariantStyles = () => {
        switch (variant) {
            case "metric":
                return "text-4xl font-bold leading-tight tracking-tight";
            case "h1":
                return "text-2xl font-bold leading-tight mb-2";
            case "h2":
                return "text-xl font-bold leading-snug mb-1";
            case "h3":
                return "text-base font-medium leading-normal mb-0";
            case "p":
                return "text-base font-regular leading-relaxed";
            case "muted":
                return "text-sm font-regular leading-relaxed opacity-70";
            default:
                return "text-base font-regular font-regular";
        }
    };

    return (
        <Text
            style={[{ color: textColor }, style]}
            className={`${getVariantStyles()} text-${align} ${className}`}
            {...props}
        >
            {children}
        </Text>
    );
};
