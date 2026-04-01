import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Switch } from "react-native-paper";
import { IrisCard } from "../../components/IrisCard";
import { IrisLogo } from "../../components/IrisLogo";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { AppIcon } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";

const ACCOUNT_ITEMS = [
    { id: "verified", icon: "shield-halved", title: "Verified Account", subtitle: "Credential access is active" },
    { id: "language", icon: "globe", title: "Language", subtitle: "English" },
    { id: "support", icon: "circle-question", title: "Support", subtitle: "Help center and onboarding" },
];

export default function ProfileScreen() {
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { theme, toggleTheme, colors, paperTheme } = useTheme();
    const navRole: NavRole = role === "seller" ? "seller" : "buyer";

    return (
        <IrisScreen scrollable={false}>
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: APP_BOTTOM_NAV_CLEARANCE }}>
                    <View className="flex-row items-center justify-between mb-8">
                        <IrisLogo width={120} height={40} />
                        <View
                            className="px-4 py-2 rounded-full"
                            style={{ backgroundColor: colors.secondary + "14" }}
                        >
                            <IrisText style={{ color: colors.secondary, fontSize: 12, fontWeight: "700" }}>
                                {navRole === "seller" ? "Seller Profile" : "Buyer Profile"}
                            </IrisText>
                        </View>
                    </View>

                    <View className="mb-6">
                        <IrisText variant="h1">Profile</IrisText>
                        <IrisText variant="muted">
                            Manage your account, appearance, and verified access settings.
                        </IrisText>
                    </View>

                    <IrisCard className="p-6 mb-5">
                        <View className="flex-row items-center">
                            <View
                                className="w-16 h-16 rounded-full items-center justify-center mr-4"
                                style={{ backgroundColor: colors.primary + "14" }}
                            >
                                <AppIcon name="circle-user" size={32} color={colors.primary} />
                            </View>
                            <View className="flex-1">
                                <IrisText variant="h3" className="mb-1">Rahul Sharma</IrisText>
                                <IrisText variant="muted">{navRole === "seller" ? "Verified Seller" : "Verified Buyer"}</IrisText>
                            </View>
                        </View>
                    </IrisCard>

                    <View className="mb-5">
                        <IrisCard className="p-5">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center flex-1 pr-4">
                                    <View
                                        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                        style={{ backgroundColor: colors.tertiary + "14" }}
                                    >
                                        <AppIcon
                                            name={theme === "dark" ? "moon" : "sun"}
                                            size={20}
                                            color={colors.tertiary}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <IrisText variant="h3" className="mb-1">Theme</IrisText>
                                        <IrisText variant="muted">
                                            {theme === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled"}
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
                        </IrisCard>
                    </View>

                    {ACCOUNT_ITEMS.map((item) => (
                        <TouchableOpacity key={item.id} className="mb-4">
                            <IrisCard className="p-5">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1 pr-4">
                                        <View
                                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                            style={{ backgroundColor: colors.primary + "12" }}
                                        >
                                            <AppIcon name={item.icon} size={20} color={colors.primary} />
                                        </View>
                                        <View className="flex-1">
                                            <IrisText variant="h3" className="mb-1">{item.title}</IrisText>
                                            <IrisText variant="muted">{item.subtitle}</IrisText>
                                        </View>
                                    </View>
                                    <AppIcon name="chevron-right" size={16} color={colors.muted} />
                                </View>
                            </IrisCard>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <AppBottomNav role={navRole} activeTab="profile" />
            </View>
        </IrisScreen>
    );
}
