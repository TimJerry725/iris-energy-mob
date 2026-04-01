import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { ShoppingCart, Zap } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";

type LoginRole = "buyer" | "seller";

export default function VCAccessScreen() {
    const router = useRouter();
    const { colors } = useTheme();

    const handleEnterApp = (role: LoginRole) => {
        router.replace({
            pathname: role === "buyer" ? "/chatbot/buyer-dashboard" : "/chatbot",
            params: { role }
        });
    };

    return (
        <IrisScreen scrollable={false} topInset={false}>
            <View className="flex-1">
                <View className="mb-6">
                    <IrisText variant="h1">VC Verified</IrisText>
                    <IrisText variant="muted">
                        Choose how you want to enter the app.
                    </IrisText>
                </View>

                <View>
                    <View
                        className="rounded-xl p-4 mb-3"
                        style={{ backgroundColor: colors.card }}
                    >
                        <View
                            className="w-10 h-10 rounded-lg items-center justify-center mb-3"
                            style={{ backgroundColor: colors.tertiary + "15" }}
                        >
                            <ShoppingCart size={20} color={colors.tertiary} />
                        </View>
                        <IrisText variant="h3" className="mb-0.5">Login as Buyer</IrisText>
                        <IrisText variant="muted" className="mb-3">
                            Browse and purchase energy.
                        </IrisText>
                        <IrisButton
                            variant="primary"
                            label="Continue as Buyer"
                            onPress={() => handleEnterApp("buyer")}
                            style={{ backgroundColor: colors.tertiary }}
                            textStyle={{ color: colors.onTertiary }}
                        />
                    </View>

                    <View
                        className="rounded-xl p-4 mb-3"
                        style={{ backgroundColor: colors.card }}
                    >
                        <View
                            className="w-10 h-10 rounded-lg items-center justify-center mb-3"
                            style={{ backgroundColor: colors.primary + "15" }}
                        >
                            <Zap size={20} color={colors.primary} />
                        </View>
                        <IrisText variant="h3" className="mb-0.5">Login as Seller</IrisText>
                        <IrisText variant="muted" className="mb-3">
                            List and manage your energy supply.
                        </IrisText>
                        <IrisButton
                            variant="primary"
                            label="Continue as Seller"
                            onPress={() => handleEnterApp("seller")}
                        />
                    </View>
                </View>
            </View>
        </IrisScreen>
    );
}
