import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IrisScreen } from "../../components/IrisScreen";

/**
 * Redirect Root - This is the index for /chatbot/
 * It now handles role-based routing to ensure sellers see the Dashboard
 * and buyers see their specific marketplace dashboard instead of the chat screen.
 */
export default function ChatbotRootRedirect() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: string }>();

    useEffect(() => {
        // Enforce role-based routing
        if (role === "seller") {
            router.replace({ pathname: "/chatbot/seller-dashboard", params: { role } });
        } else {
            // Default to buyer dashboard for buyers or unknown roles
            router.replace({ pathname: "/chatbot/buyer-dashboard", params: { role: role || "buyer" } });
        }
    }, [role]);

    return (
        <IrisScreen scrollable={false}>
            <View style={{ flex: 1, backgroundColor: "#000" }} />
        </IrisScreen>
    );
}
