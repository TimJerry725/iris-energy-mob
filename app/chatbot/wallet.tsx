import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IrisButton } from "../../components/IrisButton";
import { IrisCard } from "../../components/IrisCard";
import { IrisLogo } from "../../components/IrisLogo";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { AppIcon } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";

const TRANSACTIONS = [
    { id: "1", title: "Solar Purchase", amount: "-Rs. 2,450", meta: "Today, 12:30 PM", tone: "debit" as const },
    { id: "2", title: "Grid Savings Credit", amount: "+Rs. 840", meta: "Yesterday, 06:10 PM", tone: "credit" as const },
    { id: "3", title: "Wallet Top-Up", amount: "+Rs. 5,000", meta: "28 Mar, 09:15 AM", tone: "credit" as const },
];

export default function WalletScreen() {
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors, theme } = useTheme();
    const navRole: NavRole = role === "seller" ? "seller" : "buyer";

    return (
        <IrisScreen scrollable={false}>
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: APP_BOTTOM_NAV_CLEARANCE }}>
                    <View style={{ paddingTop: 10, paddingBottom: 24 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <View>
                                <IrisText style={{ fontSize: 22, fontWeight: "800", color: colors.onSurface }}>My Wallet</IrisText>
                                <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: 2 }}>
                                    {navRole === "seller"
                                        ? "Manage your earnings and payouts."
                                        : "Track your balances and spending."}
                                </IrisText>
                            </View>
                        </View>
                    </View>

                    <View
                        className="rounded-[28px] p-6 mb-5"
                        style={{
                            backgroundColor: theme === "dark" ? "#10332C" : colors.primary + "16",
                            borderWidth: 1,
                            borderColor: colors.primary + "30",
                        }}
                    >
                        <IrisText variant="muted" style={{ color: colors.primary }}>Available Balance</IrisText>
                        <IrisText
                            className="mt-3 mb-2"
                            style={{ color: colors.foreground, fontSize: 32, fontWeight: "800" }}
                        >
                            Rs. 18,450
                        </IrisText>
                        <IrisText variant="muted">
                            {navRole === "seller" ? "Next payout in 2 days" : "Use wallet balance for instant checkout"}
                        </IrisText>

                        <View className="mt-5">
                            <IrisButton label="Add Funds" icon="money-bill-wave" />
                        </View>
                    </View>

                    <View className="mb-4">
                        <IrisText variant="h2">Recent Activity</IrisText>
                    </View>

                    {TRANSACTIONS.map((transaction) => {
                        const positive = transaction.tone === "credit";
                        const accent = positive ? colors.primary : colors.tertiary;

                        return (
                            <TouchableOpacity key={transaction.id} className="mb-4">
                                <IrisCard className="p-5">
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center flex-1 pr-3">
                                            <View
                                                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                                style={{ backgroundColor: accent + "14" }}
                                            >
                                                <AppIcon
                                                    name={positive ? "arrow-trend-up" : "receipt"}
                                                    size={20}
                                                    color={accent}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <IrisText variant="h3" className="mb-1">{transaction.title}</IrisText>
                                                <IrisText variant="muted" className="text-sm">{transaction.meta}</IrisText>
                                            </View>
                                        </View>
                                        <IrisText style={{ color: accent, fontSize: 16, fontWeight: "700" }}>
                                            {transaction.amount}
                                        </IrisText>
                                    </View>
                                </IrisCard>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <AppBottomNav role={navRole} activeTab="wallet" />
            </View>
        </IrisScreen>
    );
}
