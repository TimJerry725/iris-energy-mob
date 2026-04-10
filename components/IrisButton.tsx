import React from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import { AppIcon, AppIconName } from "./AppIcons";
import { CONTROL_HEIGHT, CONTROL_RADIUS } from "./controlStyles";

interface IrisButtonProps extends Omit<React.ComponentProps<typeof Button>, "children" | "icon" | "mode"> {
    label: string;
    icon?: AppIconName;
    variant?: "primary" | "secondary" | "outline";
    size?: "lg" | "xl";
    textStyle?: StyleProp<TextStyle>;
    className?: string;
}

export const IrisButton: React.FC<IrisButtonProps> = ({
    label,
    icon,
    variant = "primary",
    size = "lg",
    style,
    textStyle,
    className,
    contentStyle,
    ...props
}) => {
    const { colors } = useTheme();

    const mode = variant === "outline"
        ? "outlined"
        : variant === "secondary"
            ? "contained-tonal"
            : "contained";

    const buttonColor = variant === "primary"
        ? colors.primary
        : variant === "secondary"
            ? colors.secondaryContainer
            : "transparent";

    const textColor = variant === "outline"
        ? colors.primary
        : variant === "secondary"
            ? colors.onSecondaryContainer
            : colors.onPrimary;

    return (
        <View
            className={className}
            style={{
                borderRadius: CONTROL_RADIUS,
                overflow: "hidden",
            }}
        >
            <Button
                mode={mode}
                icon={icon
                    ? ({ size: iconSize, color }) => (
                        <AppIcon
                            name={icon}
                            size={iconSize}
                            color={typeof color === "string" ? color : textColor}
                        />
                    )
                    : undefined}
                buttonColor={buttonColor}
                textColor={textColor}
                style={[
                    { borderRadius: CONTROL_RADIUS },
                    style
                ]}
                contentStyle={[
                    {
                        minHeight: CONTROL_HEIGHT,
                    },
                    contentStyle,
                ]}
                labelStyle={[
                    {
                        fontFamily: "IBMPlexSans_700Bold",
                        fontSize: 16,
                        letterSpacing: 0.2,
                    },
                    textStyle,
                ]}
                uppercase={false}
                theme={{
                    roundness: 2, // Forces paper to use lower baseline roundness scaling if applied
                }}
                {...props}
            >
                {label}
            </Button>
        </View>
    );
};
