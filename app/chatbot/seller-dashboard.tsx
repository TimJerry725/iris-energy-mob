import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisCard } from "../../components/IrisCard";
import { Bell, Zap, Leaf, Wind, Droplet, TrendingUp, TrendingDown, Clock, Wallet, Plus } from "../../components/AppIcons";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface SellerListing {
    id: string;
    name: string;
    type: "solar" | "wind" | "hydro" | "grid";
    capacity: string;
    price: number;
    quantity: string;
    saleWindow: string;
    location: string;
    status: "active" | "pending" | "sold";
    change: number;
}

const SELLER_LISTINGS: SellerListing[] = [
    {
        id: "101", name: "Rooftop Solar Unit", type: "solar",
        capacity: "5 kW", price: 6.25, quantity: "15 kWh",
        saleWindow: "06:00 – 18:00", location: "Home - Sector 45",
        status: "active", change: 0.15,
    },
    {
        id: "102", name: "Garden Wind Turbine", type: "wind",
        capacity: "2 kW", price: 5.80, quantity: "8 kWh",
        saleWindow: "00:00 – 24:00", location: "Backyard",
        status: "active", change: -0.05,
    },
    {
        id: "103", name: "EV Battery Reserve", type: "solar",
        capacity: "10 kW", price: 7.55, quantity: "12 kWh",
        saleWindow: "18:00 – 22:00", location: "Parking Garage",
        status: "pending", change: 0.22,
    },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    active:  { bg: "#00C76A20", text: "#00A55A", label: "Active" },
    pending: { bg: "#FFB34720", text: "#C97000", label: "Pending" },
    sold:    { bg: "#3B82F620", text: "#2563EB", label: "Sold" },
};

const getEnergyIcon = (type: string, size: number, color: string) => {
    switch (type) {
        case "solar": return <Leaf size={size} color={color} />;
        case "wind":  return <Wind size={size} color={color} />;
        case "hydro": return <Droplet size={size} color={color} />;
        default:      return <Zap size={size} color={color} />;
    }
};

const TYPE_ACCENT: Record<string, string> = {
    solar: "#FFB347",
    wind:  "#56CCF2",
    hydro: "#43E97B",
    grid:  "#00E673",
};

export default function SellerDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = theme === "dark";
    const navRole: NavRole = "seller";

    const totalRevenue = SELLER_LISTINGS.reduce((sum, l) => sum + l.price, 0).toFixed(2);
    const activeCount = SELLER_LISTINGS.filter(l => l.status === "active").length;

    return (
        <IrisScreen scrollable={false} topInset={false} style={{ backgroundColor: colors.background }}>
            <View style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 0, paddingBottom: 16 }}>
                    <View>
                        <IrisText style={{ fontSize: 22, fontWeight: "800", color: colors.onSurface }}>My Listings</IrisText>
                        <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: 2 }}>
                            {activeCount} active · {SELLER_LISTINGS.length} total
                        </IrisText>
                    </View>
                    <TouchableOpacity style={{
                        width: 42, height: 42, borderRadius: 12,
                        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant,
                        alignItems: "center", justifyContent: "center",
                    }}>
                        <Bell size={20} color={colors.onSurface} />
                    </TouchableOpacity>
                </View>

                {/* Listings */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: APP_BOTTOM_NAV_CLEARANCE + 80 }}
                >
                    <IrisText style={{ fontSize: 15, fontWeight: "700", color: colors.onSurface, marginBottom: 14 }}>
                        Energy for Sale
                    </IrisText>
                    {SELLER_LISTINGS.map((listing) => {
                        const accent = TYPE_ACCENT[listing.type];
                        const statusStyle = STATUS_STYLE[listing.status];
                        const isPositive = listing.change >= 0;

                        return (
                            <View
                                key={listing.id}
                                style={{ marginBottom: 14 }}
                            >
                                <IrisCard style={{ padding: 0, overflow: "hidden", elevation: 2, shadowOpacity: 0.07, shadowRadius: 10 }}>
                                    <View style={{ padding: 16 }}>
                                        {/* Top Row */}
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <View style={{
                                                    width: 44, height: 44, borderRadius: 12,
                                                    backgroundColor: accent + "22",
                                                    alignItems: "center", justifyContent: "center",
                                                    marginRight: 12, borderWidth: 1, borderColor: accent + "44",
                                                }}>
                                                    {getEnergyIcon(listing.type, 22, accent)}
                                                </View>
                                                <View>
                                                    <IrisText style={{ fontSize: 15, fontWeight: "700", color: colors.onSurface }}>{listing.name}</IrisText>
                                                    <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, fontWeight: "500", marginTop: 2 }}>
                                                        {listing.type.toUpperCase()} • {listing.capacity}
                                                    </IrisText>
                                                </View>
                                            </View>
                                            {/* Status badge */}
                                            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: statusStyle.bg }}>
                                                <IrisText style={{ fontSize: 11, fontWeight: "700", color: statusStyle.text }}>{statusStyle.label}</IrisText>
                                            </View>
                                        </View>

                                        {/* Price row with change */}
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                            <View>
                                                <IrisText style={{ fontSize: 24, fontWeight: "800", color: colors.onSurface }}>₹{listing.price.toFixed(2)}</IrisText>
                                                <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, marginTop: 1 }}>per kWh · {listing.quantity} listed</IrisText>
                                            </View>
                                            <View style={{
                                                flexDirection: "row", alignItems: "center",
                                                backgroundColor: (isPositive ? colors.primary : colors.danger) + "18",
                                                paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
                                            }}>
                                                {isPositive
                                                    ? <TrendingUp size={12} color={colors.primary} />
                                                    : <TrendingDown size={12} color={colors.danger} />}
                                                <IrisText style={{ fontSize: 12, fontWeight: "700", color: isPositive ? colors.primary : colors.danger, marginLeft: 4 }}>
                                                    {isPositive ? "+" : ""}{listing.change.toFixed(1)}%
                                                </IrisText>
                                            </View>
                                        </View>

                                        {/* Divider */}
                                        <View style={{ height: 1, backgroundColor: colors.outline, opacity: 0.35, marginBottom: 12 }} />

                                        {/* Bottom: revenue + sale window */}
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Wallet size={12} color={colors.primary} />
                                                <View style={{ marginLeft: 6 }}>
                                                    <IrisText style={{ fontSize: 10, color: colors.onSurfaceVariant, fontWeight: "500" }}>Revenue</IrisText>
                                                    <IrisText style={{ fontSize: 13, color: colors.onSurface, fontWeight: "700" }}>
                                                        ₹{(listing.price * parseFloat(listing.quantity)).toFixed(2)}
                                                    </IrisText>
                                                </View>
                                            </View>
                                            <View style={{
                                                flexDirection: "row", alignItems: "center",
                                                backgroundColor: colors.surfaceVariant,
                                                paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
                                                borderWidth: 1, borderColor: colors.outlineVariant, gap: 5,
                                            }}>
                                                <Clock size={11} color={colors.onSurface} />
                                                <IrisText style={{ fontSize: 11, color: colors.onSurface, fontWeight: "700" }}>{listing.saleWindow}</IrisText>
                                            </View>
                                        </View>
                                    </View>
                                </IrisCard>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Publish Intent FAB */}
            <TouchableOpacity
                onPress={() => router.push({ pathname: "/chatbot/publish-intent", params: { role } })}
                style={{
                    position: "absolute",
                    bottom: APP_BOTTOM_NAV_CLEARANCE + 16 - insets.bottom,
                    right: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: 18,
                    shadowColor: colors.primary,
                    shadowOpacity: 0.45,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 8,
                    gap: 8,
                }}
            >
                <Plus size={18} color="#04150E" />
                <IrisText style={{ fontSize: 14, fontWeight: "800", color: "#04150E" }}>Publish Intent</IrisText>
            </TouchableOpacity>

            <AppBottomNav role={navRole} activeTab="home" />
        </IrisScreen>
    );
}
