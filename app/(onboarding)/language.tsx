import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
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
        router.replace("/(onboarding)/phone");
    };

    return (
        <IrisScreen topInset={false}>
            <View className="mb-6">
                <IrisText variant="h1">Choose Language</IrisText>
                <IrisText variant="muted">Select your preferred language to continue.</IrisText>
            </View>

            <View>
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        onPress={() => handleSelect(lang.code)}
                        activeOpacity={0.7}
                        style={{
                            backgroundColor: colors.surfaceContainerLow,
                            borderColor: i18n.language === lang.code ? colors.primary : colors.outlineVariant,
                            borderWidth: 1.5,
                        }}
                        className="p-4 rounded-[20px] flex-row items-center mb-3"
                    >
                        <IrisText className="text-2xl mr-4">{lang.flag}</IrisText>
                        <View className="flex-1">
                            <IrisText variant="h3" className="mb-0">{lang.name}</IrisText>
                        </View>
                        {i18n.language === lang.code && (
                            <View
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colors.primary }}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </IrisScreen>
    );
}
