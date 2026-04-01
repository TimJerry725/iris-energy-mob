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
            style={[
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    shadowColor: "#000000",
                    shadowOpacity: 0.08,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 4,
                },
                style,
            ]}
            className={`rounded-[20px] p-4 border ${className}`}
            {...props}
        >
            {children}
        </View>
    );
};
