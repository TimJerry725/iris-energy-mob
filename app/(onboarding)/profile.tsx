import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { IrisTextInput } from "../../components/IrisTextInput";

export default function ProfileSetupScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleContinue = () => {
        if (name.trim()) {
            router.push("/(onboarding)/verification");
        }
    };

    return (
        <IrisScreen scrollable={false} topInset={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="mb-6">
                    <IrisText variant="h1">{t("profile_title", "About You")}</IrisText>
                    <IrisText variant="muted">{t("profile_subtitle", "Tell us a bit about yourself to get started.")}</IrisText>
                </View>

                <View className="flex-1" style={{ gap: 16 }}>
                    <IrisTextInput
                        label={t("full_name", "Full Name")}
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />

                    <IrisTextInput
                        label={t("email_optional", "Email (Optional)")}
                        placeholder="john@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View className="pb-4">
                    <IrisButton
                        variant="primary"
                        size="lg"
                        label={t("continue", "Continue")}
                        onPress={handleContinue}
                        disabled={!name.trim()}
                    />
                </View>
            </KeyboardAvoidingView>
        </IrisScreen>
    );
}
