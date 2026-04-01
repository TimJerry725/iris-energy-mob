import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { Switch } from "react-native-paper";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Languages as LanguagesIcon, User } from "../../components/AppIcons";

const LANGUAGES = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
];

export default function SettingsScreen() {
    const { i18n } = useTranslation();
    const { theme, toggleTheme, colors, paperTheme } = useTheme();

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
    };

    return (
        <IrisScreen topInset={false}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View className="mb-8">
                    <IrisText variant="h2" className="mb-4">Profile</IrisText>
                    <View
                        className="flex-row items-center p-5 rounded-3xl"
                        style={{ backgroundColor: colors.card }}
                    >
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center mr-4"
                            style={{ backgroundColor: colors.primary + "20" }}
                        >
                            <User size={32} color={colors.primary} />
                        </View>
                        <View className="flex-1">
                            <IrisText variant="h3" className="mb-0">Rahul Sharma</IrisText>
                            <IrisText variant="muted" className="text-sm">Platinum Trader</IrisText>
                        </View>
                    </View>
                </View>

                {/* Theme Section */}
                <View className="mb-8">
                    <IrisText variant="h2" className="mb-4">Appearance</IrisText>
                    <View
                        className="flex-row items-center justify-between p-5 rounded-3xl"
                        style={{ backgroundColor: colors.surfaceContainerLow }}
                    >
                        <View className="flex-row items-center">
                            <View
                                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: colors.primary + "20" }}
                            >
                                {theme === "dark" ? (
                                    <Moon size={20} color={colors.primary} />
                                ) : (
                                    <Sun size={20} color={colors.primary} />
                                )}
                            </View>
                            <View>
                                <IrisText variant="h3" className="mb-0">Theme</IrisText>
                                <IrisText variant="muted" className="text-sm">
                                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                                </IrisText>
                            </View>
                        </View>
                        <Switch
                            value={theme === "dark"}
                            onValueChange={toggleTheme}
                            color={colors.primary}
                            theme={paperTheme}
                        />
                    </View>
                </View>

                {/* Language Section */}
                <View className="mb-8">
                    <IrisText variant="h2" className="mb-4">Language</IrisText>
                    {LANGUAGES.map((language) => (
                        <TouchableOpacity
                            key={language.code}
                            onPress={() => handleLanguageChange(language.code)}
                            className="flex-row items-center justify-between p-5 rounded-3xl mb-3"
                            style={{
                                backgroundColor: i18n.language === language.code ? colors.primary + "10" : colors.card
                            }}
                        >
                            <View className="flex-row items-center">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                                    style={{ backgroundColor: colors.primary + "20" }}
                                >
                                    <LanguagesIcon size={20} color={colors.primary} />
                                </View>
                                <View>
                                    <IrisText variant="h3" className="mb-0">{language.name}</IrisText>
                                    <IrisText variant="muted" className="text-sm">{language.nativeName}</IrisText>
                                </View>
                            </View>
                            {i18n.language === language.code && (
                                <View
                                    className="w-6 h-6 rounded-full items-center justify-center"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <View className="w-2 h-2 rounded-full bg-white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </IrisScreen>
    );
}
