import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { useTheme } from "../../context/ThemeContext";
import { IrisLogo } from "../../components/IrisLogo";
import { ArrowLeft, Languages } from "lucide-react-native";

export default function OtpScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputs = useRef<TextInput[]>([]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputs.current[index + 1].focus();
        }

        if (newOtp.join("") === "0001") {
            router.push("/(onboarding)/profile");
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <IrisScreen scrollable={false}>
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
                <IrisText variant="h1">{t("otp_title", "Enter Code")}</IrisText>
                <IrisText variant="muted">{t("otp_subtitle", "We sent a 4-digit code. Use 0001 for testing.")}</IrisText>
            </View>

            <View className="flex-row justify-between mb-10">
                {otp.map((digit, index) => (
                    <View
                        key={index}
                        style={{ backgroundColor: colors.card, borderColor: colors.muted + "20" }}
                        className="w-[22%] aspect-square rounded-3xl border items-center justify-center"
                    >
                        <TextInput
                            ref={(el) => { inputs.current[index] = el!; }}
                            className="text-4xl font-bold font-bold text-center w-full"
                            style={{ color: colors.foreground }}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(val) => handleOtpChange(val, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            autoFocus={index === 0}
                        />
                    </View>
                ))}
            </View>

            <View className="items-center">
                <TouchableOpacity>
                    <IrisText variant="h3" style={{ color: colors.primary }} className="font-semibold text-center">
                        {t("resend_code", "Resend Code")}
                    </IrisText>
                </TouchableOpacity>
            </View>
        </IrisScreen>
    );
}

