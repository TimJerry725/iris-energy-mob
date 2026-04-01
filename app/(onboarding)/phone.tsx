import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { IrisTextInput, IrisTextInputAffix } from "../../components/IrisTextInput";

export default function PhoneInputScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [phone, setPhone] = useState("");

    const handleContinue = () => {
        if (phone.length === 10) {
            router.push("/(onboarding)/otp");
        }
    };

    return (
        <IrisScreen scrollable={false} topInset={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="mb-6">
                    <IrisText variant="h1">{t("phone_title", "What's your number?")}</IrisText>
                    <IrisText variant="muted">{t("phone_subtitle", "We'll send a verification code to your phone.")}</IrisText>
                </View>

                <IrisTextInput
                    label={t("phone_label", "Phone number")}
                    placeholder="00000 00000"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={(value) => setPhone(value.replace(/[^0-9]/g, ""))}
                    autoFocus
                    left={<IrisTextInputAffix text="🇮🇳 +91" />}
                    containerStyle={{ marginBottom: 16 }}
                />

                <IrisButton
                    variant="primary"
                    size="lg"
                    label={t("continue", "Continue")}
                    onPress={handleContinue}
                    disabled={phone.length !== 10}
                />
            </KeyboardAvoidingView>
        </IrisScreen>
    );
}
