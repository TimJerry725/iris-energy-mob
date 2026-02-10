import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { useTheme } from "../../context/ThemeContext";
import { IrisLogo } from "../../components/IrisLogo";
import { ArrowLeft, Languages } from "lucide-react-native";

export default function PhoneInputScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [phone, setPhone] = useState("");

    const handleContinue = () => {
        if (phone.length === 10) {
            router.push("/(onboarding)/otp");
        }
    };

    return (
        <IrisScreen scrollable={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                {/* Header with Back Button and Language Switcher */}
                <View className="flex-row items-center justify-between mb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 rounded-full bg-gray-500/10 items-center justify-center"
                    >
                        <ArrowLeft size={24} color={colors.foreground} />
                    </TouchableOpacity>

                    <IrisLogo width={120} height={40} />

                    <TouchableOpacity
                        onPress={() => router.push("/(onboarding)/language")}
                        className="w-12 h-12 rounded-full bg-gray-500/10 items-center justify-center"
                    >
                        <Languages size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View className="mb-10">
                    <IrisText variant="h1">{t("phone_title", "What's your number?")}</IrisText>
                    <IrisText variant="muted">{t("phone_subtitle", "We'll send a verification code to your phone.")}</IrisText>
                </View>

                <View
                    style={{ backgroundColor: colors.card, borderColor: colors.muted + "20" }}
                    className="flex-row items-center p-4 rounded-3xl border mb-8"
                >
                    <View className="flex-row items-center border-r border-gray-500/20 pr-4 mr-4">
                        <IrisText className="text-2xl mr-2">🇮🇳</IrisText>
                        <IrisText variant="h3" className="mb-0">+91</IrisText>
                    </View>
                    <TextInput
                        className="flex-1 text-2xl font-bold font-bold"
                        style={{ color: colors.foreground }}
                        placeholder="00000 00000"
                        placeholderTextColor={colors.muted}
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={phone}
                        onChangeText={setPhone}
                        autoFocus
                    />
                </View>

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
