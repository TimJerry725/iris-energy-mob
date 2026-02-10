import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { ThemeProvider } from "../context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, RedHatDisplay_400Regular, RedHatDisplay_500Medium, RedHatDisplay_700Bold, RedHatDisplay_900Black } from '@expo-google-fonts/red-hat-display';
import "../services/i18n";
import "../global.css";

function RootLayout() {
    const [fontsLoaded] = useFonts({
        RedHatDisplay_400Regular,
        RedHatDisplay_500Medium,
        RedHatDisplay_700Bold,
        RedHatDisplay_900Black,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#00E673" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <View className="flex-1 bg-white dark:bg-black">
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="chatbot/index" />
                        <Stack.Screen name="chatbot/settings" />
                        <Stack.Screen name="chatbot/marketplace" />
                        <Stack.Screen name="(onboarding)" />
                    </Stack>
                </View>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

export default RootLayout;
