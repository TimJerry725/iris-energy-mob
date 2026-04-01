import React from "react";
import { View, StatusBar, ScrollView, Platform, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IrisScreenProps {
    children: React.ReactNode;
    scrollable?: boolean;
    topInset?: boolean;
    bottomInset?: boolean;
    style?: ViewStyle;
    className?: string;
}

const SCREEN_HORIZONTAL_PADDING = 16;

export const IrisScreen: React.FC<IrisScreenProps> = ({
    children,
    scrollable = true,
    topInset = true,
    bottomInset = true,
    style,
    className,
}) => {
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            className={className}
            style={[
                {
                    flex: 1,
                    backgroundColor: colors.background,
                    paddingTop: topInset ? insets.top : 0,
                    paddingBottom: bottomInset ? insets.bottom : 0,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                },
                style,
            ]}
        >
            <StatusBar
                barStyle={theme === "light" ? "dark-content" : "light-content"}
                backgroundColor="transparent"
                translucent
            />
            {scrollable ? (
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 16,
                        paddingVertical: 16
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            ) : (
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
                        paddingVertical: 0 // Allow custom padding in fixed screens
                    }}
                >
                    {children}
                </View>
            )}
        </View>
    );
};
