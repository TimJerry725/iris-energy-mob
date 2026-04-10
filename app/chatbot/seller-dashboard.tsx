import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisCard } from "../../components/IrisCard";
import { Bell, Zap, Leaf, Wind, Droplet, Clock, Wallet, Plus, ChevronRight } from "../../components/AppIcons";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, Divider } from "react-native-paper";
import { CONTROL_RADIUS } from "../../components/controlStyles";

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
    hoursUntilStart: number;
    date: string;
}

const SELLER_LISTINGS: SellerListing[] = [
    {
        id: "101", name: "Rooftop Solar Unit", type: "solar",
        capacity: "5 kW", price: 6.25, quantity: "15 kWh",
        saleWindow: "06:00 – 07:00", location: "Home - Sector 45",
        status: "active", change: 0.15, hoursUntilStart: 6, date: "04/01/2026",
    },
    {
        id: "102", name: "Garden Wind Turbine", type: "wind",
        capacity: "2 kW", price: 5.80, quantity: "8 kWh",
        saleWindow: "11:00 – 12:00", location: "Backyard",
        status: "active", change: -0.05, hoursUntilStart: 14, date: "04/01/2026",
    },
    {
        id: "104", name: "Neighborhood Solar Share", type: "solar",
        capacity: "50 kW", price: 4.80, quantity: "100 kWh",
        saleWindow: "10:00 – 11:00", location: "Block C Common",
        status: "active", change: 0.10, hoursUntilStart: 32, date: "04/02/2026",
    },
    {
        id: "103", name: "EV Battery Reserve", type: "solar",
        capacity: "10 kW", price: 7.55, quantity: "12 kWh",
        saleWindow: "18:00 – 19:00", location: "Parking Garage",
        status: "active", change: 0.22, hoursUntilStart: 48, date: "04/03/2026",
    },
    {
        id: "105", name: "Solar - Morning Peak", type: "solar",
        capacity: "3 kW", price: 6.50, quantity: "10 kWh",
        saleWindow: "08:00 – 09:00", location: "Home",
        status: "sold", change: 0.0, hoursUntilStart: -2, date: "04/01/2026",
    },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    active:  { bg: "#00C76A20", text: "#00A55A", label: "Active" },
    pending: { bg: "#FFB34720", text: "#C97000", label: "Pending" },
    sold:    { bg: "#3B82F620", text: "#2563EB", label: "Sold" },
};

export default function SellerDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = theme === "dark";
    const navRole: NavRole = "seller";
    const [menuVisible, setMenuVisible] = useState(false);
    const [period, setPeriod] = useState("Last 3 Days");
    const [showAll, setShowAll] = useState(false);

    const periods = ["Today", "Yesterday", "Last 3 Days"];

    const activeCount = SELLER_LISTINGS.filter(l => l.status === "active").length;

    const activeListings = SELLER_LISTINGS.filter(l => l.hoursUntilStart >= 4 && l.hoursUntilStart <= 24);
    const remainingListings = SELLER_LISTINGS.filter(l => l.hoursUntilStart < 4 || l.hoursUntilStart > 24);
    const displayListings = showAll ? SELLER_LISTINGS : activeListings;

    return (
        <IrisScreen scrollable={false} topInset={true} style={{ backgroundColor: colors.background }}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, paddingBottom: 16 }}>
                    <View>
                        <IrisText style={{ fontSize: 22, fontWeight: "800", color: colors.onSurface }}>My Listings</IrisText>
                        <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: 2 }}>
                            {activeCount} active · {SELLER_LISTINGS.length} total
                        </IrisText>
                    </View>
                </View>

                {/* Listings Overlay */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: APP_BOTTOM_NAV_CLEARANCE + 80 }}
                >
                    {/* Metric Summary Section */}
                    <View className="mb-8 mt-2">
                        <View className="flex-row items-center justify-between mb-4">
                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={
                                    <TouchableOpacity 
                                        activeOpacity={0.7}
                                        onPress={() => setMenuVisible(true)}
                                        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                                    >
                                        <IrisText style={{ fontSize: 13, fontWeight: "700", color: colors.onSurface }}>Performance:</IrisText>
                                        <View style={{ 
                                            flexDirection: "row", alignItems: "center", 
                                            backgroundColor: isDark ? colors.surfaceVariant : colors.primary + "0D",
                                            borderWidth: 1, borderColor: isDark ? "transparent" : colors.primary + "30",
                                            paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 
                                        }}>
                                            <IrisText style={{ fontSize: 11, fontWeight: "800", color: colors.primary }}>{period}</IrisText>
                                            <ChevronRight size={14} color={colors.primary} style={{ transform: [{ rotate: "90deg" }], marginLeft: 2 }} />
                                        </View>
                                    </TouchableOpacity>
                                }
                                contentStyle={{ backgroundColor: colors.surface, borderRadius: 12, marginTop: 40 }}
                            >
                                {periods.map((p, i) => (
                                    <React.Fragment key={p}>
                                        <Menu.Item 
                                            onPress={() => {
                                                setPeriod(p);
                                                setMenuVisible(false);
                                            }} 
                                            title={p}
                                            titleStyle={{ fontSize: 13, fontWeight: "600", color: period === p ? colors.primary : colors.onSurface }}
                                        />
                                        {i < periods.length - 1 && <Divider style={{ opacity: 0.1 }} />}
                                    </React.Fragment>
                                ))}
                            </Menu>
                        </View>
                        
                        <View className="flex-row gap-3">
                            <IrisCard className="flex-1 p-3" style={{ backgroundColor: colors.surface, borderRadius: CONTROL_RADIUS }}>
                                <IrisText variant="muted" style={{ fontSize: 10, fontWeight: "700", marginBottom: 4, letterSpacing: 0.2 }}>UNITS LISTED</IrisText>
                                <IrisText style={{ fontSize: 17, fontWeight: "800", color: colors.onSurface }}>1,420 <IrisText style={{ fontSize: 11 }}>kWh</IrisText></IrisText>
                                <IrisText style={{ fontSize: 12, fontWeight: "700", color: colors.primary, marginTop: 4 }}>₹6,840.50</IrisText>
                            </IrisCard>

                            <IrisCard className="flex-1 p-3" style={{ backgroundColor: colors.surface, borderRadius: CONTROL_RADIUS }}>
                                <IrisText variant="muted" style={{ fontSize: 10, fontWeight: "700", marginBottom: 4, letterSpacing: 0.2 }}>UNITS DELIVERED</IrisText>
                                <IrisText style={{ fontSize: 17, fontWeight: "800", color: colors.onSurface }}>950 <IrisText style={{ fontSize: 11 }}>kWh</IrisText></IrisText>
                                <IrisText style={{ fontSize: 12, fontWeight: "700", color: colors.tertiary, marginTop: 4 }}>₹4,560.00</IrisText>
                            </IrisCard>
                        </View>
                    </View>

                    <View className="mb-6">
                        <IrisText style={{ fontSize: 16, fontWeight: "800", color: colors.onSurface }}>Energy for sales</IrisText>
                    </View>

                    {displayListings.map((listing) => {
                        const statusStyle = STATUS_STYLE[listing.status] || STATUS_STYLE.pending;

                        return (
                            <View
                                key={listing.id}
                                style={{ marginBottom: 14 }}
                            >
                                <TouchableOpacity 
                                    activeOpacity={0.85}
                                    onPress={() => router.push({
                                        pathname: "/chatbot/publish-intent",
                                        params: { 
                                            role,
                                            listingId: listing.id,
                                            name: listing.name,
                                            type: listing.type,
                                            quantity: listing.quantity.replace(" kWh", ""), 
                                            price: listing.price.toString(),
                                            date: listing.date,
                                            saleWindow: listing.saleWindow,
                                            status: listing.status
                                        }
                                    })}
                                >
                                    <IrisCard style={{ padding: 0, overflow: "hidden", elevation: 2, shadowOpacity: 0.07, shadowRadius: 10 }}>
                                        <View style={{ padding: 16 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                                <View>
                                                    <IrisText style={{ fontSize: 15, fontWeight: "700", color: colors.onSurface }}>{listing.name}</IrisText>
                                                    <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, fontWeight: "500", marginTop: 2 }}>
                                                        {listing.type.toUpperCase()} • {listing.capacity}
                                                    </IrisText>
                                                </View>
                                                <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: CONTROL_RADIUS, backgroundColor: statusStyle.bg }}>
                                                    <IrisText style={{ fontSize: 11, fontWeight: "700", color: statusStyle.text }}>{statusStyle.label}</IrisText>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                                <View>
                                                    <IrisText style={{ fontSize: 24, fontWeight: "800", color: colors.onSurface }}>₹{listing.price.toFixed(2)}</IrisText>
                                                    <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, marginTop: 1 }}>per kWh · {listing.quantity} listed</IrisText>
                                                </View>
                                            </View>

                                            <View style={{ height: 1, backgroundColor: colors.outline, opacity: 0.15, marginBottom: 12 }} />

                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Wallet size={12} color={colors.primary} />
                                                    <View style={{ marginLeft: 6 }}>
                                                        <IrisText style={{ fontSize: 10, color: colors.onSurfaceVariant, fontWeight: "500" }}>Estimate Revenue</IrisText>
                                                        <IrisText style={{ fontSize: 13, color: colors.onSurface, fontWeight: "700" }}>
                                                            ₹{(listing.price * parseFloat(listing.quantity)).toFixed(2)}
                                                        </IrisText>
                                                    </View>
                                                </View>
                                                    <View style={{
                                                        flexDirection: "row", alignItems: "center",
                                                        backgroundColor: colors.surfaceVariant,
                                                        paddingHorizontal: 10, paddingVertical: 6, borderRadius: CONTROL_RADIUS,
                                                        borderWidth: 1, borderColor: colors.outlineVariant, gap: 5,
                                                    }}>
                                                        <Clock size={11} color={colors.onSurface} />
                                                        <IrisText style={{ fontSize: 11, color: colors.onSurface, fontWeight: "700" }}>{listing.date} · {listing.saleWindow}</IrisText>
                                                    </View>
                                            </View>
                                        </View>
                                    </IrisCard>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                    {!showAll && remainingListings.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => setShowAll(true)} 
                            style={{ 
                                marginTop: 12, marginBottom: 24, paddingVertical: 12, 
                                borderRadius: CONTROL_RADIUS, backgroundColor: colors.surfaceVariant,
                                alignItems: "center", justifyContent: "center",
                                borderWidth: 1, borderColor: colors.outlineVariant,
                            }}
                        >
                            <IrisText style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}>Show all results</IrisText>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            {/* Publish Intent FAB */}
            <TouchableOpacity
                onPress={() => router.push({ pathname: "/chatbot/publish-intent", params: { role } })}
                style={{
                    position: "absolute",
                    bottom: APP_BOTTOM_NAV_CLEARANCE + 16 - insets.bottom,
                    right: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: CONTROL_RADIUS,
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
