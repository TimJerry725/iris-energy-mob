import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { FontAwesome } from "@expo/vector-icons";

interface IrisButtonProps extends TouchableOpacityProps {
    label: string;
    icon?: keyof typeof FontAwesome.glyphMap;
    variant?: "primary" | "secondary" | "outline";
    size?: "lg" | "xl";
}

export const IrisButton: React.FC<IrisButtonProps> = ({
    label,
    icon,
    variant = "primary",
    size = "lg",
    style,
    ...props
}) => {
    const { colors } = useTheme();

    const getVariantStyles = () => {
        switch (variant) {
            case "primary":
                return "bg-primary-light dark:bg-primary-dark";
            case "secondary":
                return "bg-slate-200 dark:bg-slate-800";
            case "outline":
                return "border-2 border-primary-light dark:border-primary-dark";
            default:
                return "bg-primary-light dark:bg-primary-dark";
        }
    };

    const getTextStyles = () => {
        if (variant === "outline") return "text-primary-light dark:text-primary-dark";
        if (variant === "secondary") return "text-slate-900 dark:text-slate-100";
        return "text-slate-900 font-bold";
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={`rounded-2xl flex-row items-center justify-center ${size === "xl" ? "p-6" : "p-4"} ${getVariantStyles()}`}
            style={style}
            {...props}
        >
            {icon && (
                <FontAwesome
                    name={icon}
                    size={24}
                    color={variant === "outline" ? colors.primary : "#0F172A"}
                    className="mr-3"
                />
            )}
            <Text className={`text-xl text-center font-bold font-bold ${getTextStyles()}`}>{label}</Text>
        </TouchableOpacity>
    );
};
