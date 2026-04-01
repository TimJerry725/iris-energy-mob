import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IrisCard } from "../../components/IrisCard";
import { IrisLogo } from "../../components/IrisLogo";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { AppIcon } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";
import { CONTROL_RADIUS } from "../../components/controlStyles";

const BUYER_ORDERS = [
    { id: "1", title: "Rooftop Solar Block", status: "Active", quantity: "40 kWh", price: "Rs. 6.8/kWh", type: "pending" },
    { id: "2", title: "Evening Backup Purchase", status: "Ordered", quantity: "25 kWh", price: "Rs. 7.1/kWh", type: "pending" },
    { id: "3", title: "Apartment Grid Share", status: "Allocated", quantity: "45 kWh", price: "Rs. 6.6/kWh", type: "pending" },
    { id: "4", title: "Weekend Smart Buy", status: "Settled", quantity: "60 kWh", price: "Rs. 6.4/kWh", type: "settled" },
    { id: "5", title: "Solar Morning Slot", status: "Delivered", quantity: "15 kWh", price: "Rs. 6.2/kWh", type: "settled" },
];

const SELLER_ORDERS = [
    { id: "1", title: "Commercial Solar Batch", status: "Active", quantity: "55 kWh", price: "Rs. 7.4/kWh", type: "pending" },
    { id: "2", title: "Industrial Day Slot", status: "Ordered", quantity: "80 kWh", price: "Rs. 7.0/kWh", type: "pending" },
    { id: "3", title: "Community Feed #22", status: "Allocated", quantity: "120 kWh", price: "Rs. 6.9/kWh", type: "pending" },
    { id: "4", title: "Battery Reserve Listing", status: "Settled", quantity: "30 kWh", price: "Rs. 6.7/kWh", type: "settled" },
    { id: "5", title: "Grid Feed #402", status: "Delivered", quantity: "100 kWh", price: "Rs. 6.5/kWh", type: "settled" },
];

const STATUS_COLORS = {
    Active: "primary",
    Ordered: "tertiary",
    Delivered: "success",
    Allocated: "warning",
    Settled: "secondary",
} as const;

export default function OrdersScreen() {
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";
    const [activeTab, setActiveTab] = React.useState<"pending" | "settled">("pending");

    const navRole: NavRole = role === "seller" ? "seller" : "buyer";
    const allOrders = navRole === "seller" ? SELLER_ORDERS : BUYER_ORDERS;
    const filteredOrders = allOrders.filter(o => o.type === activeTab);

    return (
        <IrisScreen scrollable={false} topInset={true}>
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: APP_BOTTOM_NAV_CLEARANCE + 40 }}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 0, paddingBottom: 24 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <View>
                                <IrisText style={{ fontSize: 22, fontWeight: "800", color: colors.onSurface }}>My Orders</IrisText>
                                <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: 2 }}>
                                    {navRole === "seller"
                                        ? "Manage your energy settlements."
                                        : "Track your energy purchases."}
                                </IrisText>
                            </View>
                            <TouchableOpacity style={{
                                width: 42, height: 42, borderRadius: 8,
                                backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant,
                                alignItems: "center", justifyContent: "center",
                            }}>
                                <AppIcon name="bell" size={20} color={colors.onSurface} />
                            </TouchableOpacity>
                        </View>

                        {navRole === "seller" && (
                            <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
                                {[
                                    { label: "Total Earnings", value: "₹0.09", color: "#00C76A", icon: "TrendingUp", desc: "Lifetime earnings from sales" },
                                    { label: "Energy Sold", value: "1 kWh", color: "#FFB347", icon: "Zap", desc: "Clean energy supplied to grid" },
                                    { label: "Active Orders", value: "12", color: "#4CC9F0", icon: "Activity", desc: "Orders currently in progress" },
                                ].map((m, i) => (
                                    <View key={i} style={{ 
                                        flex: 1, backgroundColor: isDark ? "#121212" : colors.surface, 
                                        borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.outlineVariant,
                                        elevation: 0, shadowOpacity: 0
                                    }}>
                                        <View style={{ 
                                            width: 32, height: 32, borderRadius: 10, 
                                            backgroundColor: m.color + "18", 
                                            alignItems: "center", justifyContent: "center",
                                            marginBottom: 12
                                        }}>
                                            <AppIcon 
                                                name={m.icon.toLowerCase() === "trendingup" ? "trending-up" : m.icon.toLowerCase()} 
                                                size={16} 
                                                color={m.color} 
                                            />
                                        </View>
                                        <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "600", marginBottom: 2 }}>{m.label}</IrisText>
                                        <IrisText style={{ fontSize: 20, fontWeight: "800", color: i === 0 ? "#00C76A" : colors.onSurface }}>{m.value}</IrisText>
                                        <IrisText style={{ fontSize: 9, color: colors.onSurfaceVariant, marginTop: 4, lineHeight: 12 }}>{m.desc}</IrisText>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Tab Switcher */}
                        <View style={{
                            flexDirection: "row",
                            backgroundColor: colors.surface,
                            borderRadius: CONTROL_RADIUS,
                            padding: 6,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: colors.outlineVariant,
                        }}>
                            {(["pending", "settled"] as const).map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setActiveTab(tab)}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 10,
                                            alignItems: "center",
                                            backgroundColor: isActive ? colors.primary : "transparent",
                                            borderRadius: CONTROL_RADIUS,
                                        }}
                                    >
                                        <IrisText style={{
                                            fontSize: 14,
                                            fontWeight: "700",
                                            color: isActive ? "#04150E" : colors.onSurfaceVariant,
                                            textTransform: "capitalize",
                                        }}>
                                            {tab === "settled" ? "Settled" : "Pending"}
                                        </IrisText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                            const toneKey = STATUS_COLORS[order.status as keyof typeof STATUS_COLORS];
                            const accent = toneKey === "primary"
                                ? colors.primary
                                : toneKey === "secondary"
                                    ? colors.secondary
                                    : toneKey === "warning"
                                        ? colors.warning
                                        : toneKey === "success"
                                            ? colors.success
                                            : colors.tertiary;

                            return (
                                <TouchableOpacity key={order.id} activeOpacity={0.7} className="mb-4">
                                    <IrisCard className="p-5" style={{ borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: CONTROL_RADIUS }}>
                                        <View className="flex-row items-start justify-between mb-4">
                                            <View className="flex-1 pr-3">
                                                <IrisText variant="h3" className="mb-1" style={{ fontSize: 16 }}>{order.title}</IrisText>
                                                <IrisText variant="muted" className="text-sm" style={{ fontWeight: "600" }}>{order.quantity}</IrisText>
                                            </View>
                                            <View
                                                className="px-3 py-1.5 rounded-lg"
                                                style={{ backgroundColor: accent + "18" }}
                                            >
                                                <IrisText style={{ color: accent, fontSize: 11, fontWeight: "800" }}>
                                                    {order.status.toUpperCase()}
                                                </IrisText>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center">
                                                <AppIcon name="bolt" size={14} color={colors.primary} />
                                                <IrisText className="ml-2" style={{ fontWeight: "700", fontSize: 14 }}>
                                                    {order.price}
                                                </IrisText>
                                            </View>
                                            <View className="flex-row items-center" style={{ backgroundColor: colors.surfaceVariant, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                                <AppIcon name="clock-rotate-left" size={12} color={colors.onSurfaceVariant} />
                                                <IrisText variant="muted" className="ml-2" style={{ fontSize: 11, fontWeight: "600" }}>
                                                    Recently
                                                </IrisText>
                                            </View>
                                        </View>
                                    </IrisCard>
                                </TouchableOpacity>
                            );
                        }) : (
                            <View style={{ alignItems: "center", paddingVertical: 60 }}>
                                <IrisText variant="muted">No {activeTab} orders found.</IrisText>
                            </View>
                        )}
                    </View>
                </ScrollView>

                <AppBottomNav role={navRole} activeTab="orders" />
            </View>
        </IrisScreen>
    );
}
