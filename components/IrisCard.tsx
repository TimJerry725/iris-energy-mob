import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface IrisCardProps extends ViewProps {
    children: React.ReactNode;
}

export const IrisCard: React.FC<IrisCardProps> = ({ children, className, style, ...props }) => {
    const { colors } = useTheme();

    return (
        <View
            style={[{ backgroundColor: colors.card, borderColor: colors.muted + "20" }, style]}
            className={`rounded-3xl p-6 shadow-sm border ${className}`}
            {...props}
        >
            {children}
        </View>
    );
};
