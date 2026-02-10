import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisLogo } from "../../components/IrisLogo";
import { useTheme } from "../../context/ThemeContext";

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
];

export default function LanguageSelectionScreen() {
    const router = useRouter();
    const { i18n } = useTranslation();
    const { colors } = useTheme();

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        router.push("/(onboarding)/phone");
    };

    return (
        <IrisScreen>
            <View className="mt-8 mb-12 items-center">
                <IrisLogo width={160} height={50} />
            </View>

            <View className="mb-10">
                <IrisText variant="h1">Choose Language</IrisText>
                <IrisText variant="muted">Select your preferred language to continue.</IrisText>
            </View>

            <View className="space-y-4">
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        onPress={() => handleSelect(lang.code)}
                        activeOpacity={0.7}
                        style={{ backgroundColor: colors.card, borderColor: colors.muted + "20" }}
                        className="p-6 rounded-3xl border flex-row items-center mb-4"
                    >
                        <IrisText className="text-3xl mr-6">{lang.flag}</IrisText>
                        <IrisText variant="h3" className="mb-0">{lang.name}</IrisText>
                    </TouchableOpacity>
                ))}
            </View>
        </IrisScreen>
    );
}
