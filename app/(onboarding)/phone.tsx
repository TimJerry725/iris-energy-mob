import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { IrisTextInput, IrisTextInputAffix } from "../../components/IrisTextInput";

import { IrisLogo } from "../../components/IrisLogo";

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
        <IrisScreen scrollable={false} topInset={false} bottomInset={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 8, paddingBottom: 80 }}>
                    <View style={{ alignItems: "center", marginBottom: 40 }}>
                        <IrisLogo width={240} height={80} />
                    </View>

                    <IrisTextInput
                        label={t("phone_label", "Phone number")}
                        placeholder="00000 00000"
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={phone}
                        onChangeText={(value) => setPhone(value.replace(/[^0-9]/g, ""))}
                        autoFocus={false}
                        left={<IrisTextInputAffix text="🇮🇳 +91" />}
                        containerStyle={{ marginBottom: 20 }}
                    />

                    <IrisButton
                        variant="primary"
                        size="lg"
                        label={t("continue", "Continue")}
                        onPress={handleContinue}
                        disabled={phone.length !== 10}
                    />
                </View>
            </KeyboardAvoidingView>
        </IrisScreen>
    );
}
