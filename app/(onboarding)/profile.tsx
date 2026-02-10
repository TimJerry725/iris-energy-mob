import React, { useState } from "react";
import { View, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { useTheme } from "../../context/ThemeContext";
import { IrisLogo } from "../../components/IrisLogo";
import { ArrowLeft, Languages } from "lucide-react-native";

export default function ProfileSetupScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleContinue = () => {
        if (name.trim()) {
            router.push("/(onboarding)/user-type");
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
                    <IrisText variant="h1">{t("profile_title", "About You")}</IrisText>
                    <IrisText variant="muted">{t("profile_subtitle", "Tell us a bit about yourself to get started.")}</IrisText>
                </View>

                <View className="space-y-6 flex-1">
                    <View>
                        <IrisText variant="muted" className="mb-2 ml-1 text-xs uppercase tracking-widest">{t("full_name", "Full Name")}</IrisText>
                        <View
                            style={{ backgroundColor: colors.card, borderColor: colors.muted + "20" }}
                            className="p-4 rounded-3xl border"
                        >
                            <TextInput
                                className="text-xl font-semibold font-medium"
                                style={{ color: colors.foreground }}
                                placeholder="John Doe"
                                placeholderTextColor={colors.muted}
                                value={name}
                                onChangeText={setName}
                                autoFocus
                            />
                        </View>
                    </View>

                    <View className="mt-6">
                        <IrisText variant="muted" className="mb-2 ml-1 text-xs uppercase tracking-widest">{t("email_optional", "Email (Optional)")}</IrisText>
                        <View
                            style={{ backgroundColor: colors.card, borderColor: colors.muted + "20" }}
                            className="p-4 rounded-3xl border"
                        >
                            <TextInput
                                className="text-xl font-semibold font-medium"
                                style={{ color: colors.foreground }}
                                placeholder="john@example.com"
                                placeholderTextColor={colors.muted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>
                </View>

                <View className="pb-10">
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
