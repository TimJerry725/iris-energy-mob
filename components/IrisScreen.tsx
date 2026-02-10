import React from "react";
import { View, StatusBar, ScrollView, Platform } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IrisScreenProps {
    children: React.ReactNode;
    scrollable?: boolean;
}

export const IrisScreen: React.FC<IrisScreenProps> = ({ children, scrollable = true }) => {
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right
            }}
        >
            <StatusBar
                barStyle={theme === "light" ? "dark-content" : "light-content"}
                backgroundColor="transparent"
                translucent
            />
            {scrollable ? (
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            ) : (
                <View className="flex-1 p-6">{children}</View>
            )}
        </View>
    );
};
