import React from "react";
import { Text, TextProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface IrisTextProps extends TextProps {
    variant?: "h1" | "h2" | "h3" | "p" | "muted";
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

    const getVariantStyles = () => {
        switch (variant) {
            case "h1":
                return "text-4xl font-black font-black mb-4";
            case "h2":
                return "text-2xl font-bold font-bold mb-2";
            case "h3":
                return "text-xl font-medium font-medium mb-1";
            case "p":
                return "text-lg font-regular font-regular leading-7";
            case "muted":
                return "text-base font-regular font-regular text-slate-500 dark:text-slate-400";
            default:
                return "text-lg font-regular font-regular";
        }
    };

    return (
        <Text
            style={[{ color: colors.foreground }, style]}
            className={`${getVariantStyles()} text-${align} ${className}`}
            {...props}
        >
            {children}
        </Text>
    );
};
