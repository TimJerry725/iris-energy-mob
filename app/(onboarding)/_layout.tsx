import { Stack } from "expo-router";

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="language" />
            <Stack.Screen name="phone" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="user-type" />
            <Stack.Screen name="verification" />
        </Stack>
    );
}
