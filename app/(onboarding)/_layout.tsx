import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";
import { IconButton } from "react-native-paper";
import { Languages } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";

export default function OnboardingLayout() {
    const router = useRouter();
    const { colors, paperTheme } = useTheme();

    const renderLanguageAction = () => (
        <IconButton
            icon={({ size, color }) => (
                <Languages
                    size={size}
                    color={typeof color === "string" ? color : colors.primary}
                />
            )}
            mode="contained-tonal"
            iconColor={colors.primary}
            size={18}
            containerColor={colors.primaryContainer}
            onPress={() => router.push("/(onboarding)/language")}
            accessibilityLabel="Change language"
            theme={paperTheme}
            style={{ marginRight: Platform.OS === "ios" ? 0 : 4 }}
        />
    );

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                contentStyle: { backgroundColor: colors.background },
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.foreground,
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontFamily: "IBMPlexSans_700Bold",
                    color: colors.foreground,
                },
                headerBackButtonDisplayMode: "minimal",
                headerTitleAlign: Platform.OS === "ios" ? "center" : "left",
                animation: Platform.OS === "ios" ? "default" : "slide_from_right",
            }}
        >
            <Stack.Screen name="language" options={{ title: "Language" }} />
            <Stack.Screen
                name="phone"
                options={{
                    title: "Phone Number",
                    headerRight: renderLanguageAction,
                }}
            />
            <Stack.Screen
                name="otp"
                options={{
                    title: "Verification",
                    headerRight: renderLanguageAction,
                }}
            />
            <Stack.Screen
                name="profile"
                options={{
                    title: "About You",
                    headerRight: renderLanguageAction,
                }}
            />
            <Stack.Screen
                name="user-type"
                options={{
                    title: "Choose Role",
                    headerRight: renderLanguageAction,
                }}
            />
            <Stack.Screen
                name="verification"
                options={{
                    title: "Verify Identity",
                    headerRight: renderLanguageAction,
                }}
            />
            <Stack.Screen
                name="vc-access"
                options={{
                    title: "Access",
                    headerRight: renderLanguageAction,
                }}
            />
        </Stack>
    );
}
