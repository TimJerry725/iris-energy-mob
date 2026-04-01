import React from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import { AppIcon, AppIconName } from "./AppIcons";
import { CONTROL_HEIGHT, CONTROL_RADIUS } from "./controlStyles";

interface IrisTextInputProps extends React.ComponentProps<typeof PaperTextInput> {
    className?: string;
    containerStyle?: StyleProp<ViewStyle>;
    icon?: AppIconName;
}

export const IrisTextInput: React.FC<IrisTextInputProps> = ({
    className,
    containerStyle,
    icon,
    style,
    contentStyle,
    outlineStyle,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <View className={className} style={containerStyle}>
            <PaperTextInput
                mode="outlined"
                style={[
                    {
                        backgroundColor: colors.surfaceContainerLow,
                        height: CONTROL_HEIGHT,
                    },
                    style,
                ]}
                contentStyle={[
                    {
                        color: colors.foreground,
                        fontFamily: "IBMPlexSans_500Medium",
                        fontSize: 16,
                        minHeight: CONTROL_HEIGHT,
                        paddingVertical: 0,
                    } as TextStyle,
                    contentStyle,
                ]}
                outlineStyle={[
                    {
                        borderRadius: CONTROL_RADIUS,
                        borderColor: colors.outlineVariant,
                    },
                    outlineStyle,
                ]}
                activeOutlineColor={colors.primary}
                outlineColor={colors.outlineVariant}
                textColor={colors.foreground}
                placeholderTextColor={colors.muted}
                selectionColor={colors.primary}
                cursorColor={colors.primary}
                left={icon
                    ? (
                        <PaperTextInput.Icon
                            icon={({ size, color }) => (
                                <AppIcon
                                    name={icon}
                                    size={size}
                                    color={typeof color === "string" ? color : colors.muted}
                                />
                            )}
                        />
                    )
                    : props.left}
                {...props}
            />
        </View>
    );
};

export const IrisTextInputAffix = PaperTextInput.Affix;
export const IrisTextInputIcon = PaperTextInput.Icon;
