import 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_700Bold } from '@expo-google-fonts/ibm-plex-sans';
import "../services/i18n";
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function AppShell() {
    const { colors, paperTheme } = useTheme();

    return (
        <PaperProvider theme={paperTheme}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
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
                    <Stack.Screen name="index" />
                    <Stack.Screen name="chatbot/index" />
                    <Stack.Screen name="chatbot/buyer-dashboard" />
                    <Stack.Screen name="chatbot/wallet" />
                    <Stack.Screen name="chatbot/orders" />
                    <Stack.Screen name="chatbot/profile" />
                    <Stack.Screen
                        name="chatbot/settings"
                        options={{
                            headerShown: true,
                            title: "Settings",
                        }}
                    />
                    <Stack.Screen
                        name="chatbot/buyer-filters"
                        options={{
                            headerShown: true,
                            title: "Filters",
                            headerTransparent: true,
                            headerShadowVisible: false,
                            presentation: Platform.OS === "ios" ? "card" : "modal",
                        }}
                    />
                    <Stack.Screen
                        name="chatbot/asset/[id]"
                        options={{
                            headerShown: true,
                            title: "Asset Details",
                        }}
                    />
                    <Stack.Screen name="chatbot/marketplace" />
                    <Stack.Screen name="chatbot/seller-dashboard" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="chatbot/publish-intent"
                        options={{
                            headerShown: false,
                            presentation: "transparentModal",
                            contentStyle: { backgroundColor: "transparent" },
                            animation: "slide_from_bottom",
                        }}
                    />
                    <Stack.Screen name="(onboarding)" />
                </Stack>
            </View>
        </PaperProvider>
    );
}

function RootLayout() {
    const [fontsLoaded] = useFonts({
        IBMPlexSans_400Regular,
        IBMPlexSans_500Medium,
        IBMPlexSans_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0B0C' }}>
                <ActivityIndicator size="large" color="#00E673" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <AppShell />
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

export default RootLayout;
