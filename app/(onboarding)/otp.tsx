import React, { useState, useRef } from "react";
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { useTheme } from "../../context/ThemeContext";

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
        <IrisScreen scrollable={false} topInset={false}>
            <View className="mb-6">
                <IrisText variant="h1">{t("otp_title", "Enter Code")}</IrisText>
                <IrisText variant="muted">{t("otp_subtitle", "We sent a 4-digit code. Use 0001 for testing.")}</IrisText>
            </View>

            <View className="flex-row justify-between mb-6">
                {otp.map((digit, index) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: colors.surfaceContainerLow,
                            borderColor: digit ? colors.primary : colors.outlineVariant,
                            borderWidth: 1.5,
                        }}
                        className="w-[22%] aspect-square rounded-[20px] items-center justify-center"
                    >
                        <TextInput
                            ref={(el) => { inputs.current[index] = el!; }}
                            className="text-2xl font-bold text-center w-full"
                            style={{ color: colors.foreground, fontFamily: "IBMPlexSans_700Bold" }}
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
