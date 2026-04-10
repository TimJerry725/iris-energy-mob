import React, { useState, useCallback } from "react";
import { ScrollView, TouchableOpacity, View, Animated, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IrisCard } from "../../components/IrisCard";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { AppIcon } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";
import { CONTROL_RADIUS } from "../../components/controlStyles";
import { Swipeable } from "react-native-gesture-handler";
import { Check, X } from "../../components/AppIcons";

const getOrderBucket = (status: string): "pending" | "settled" =>
    status === "Settled" || status === "Rejected" ? "settled" : "pending";

const INITIAL_BUYER_ORDERS = [
    { id: "b1", title: "Rooftop Solar Block", status: "Active", quantity: "40 kWh", price: "Rs. 6.8/kWh", type: getOrderBucket("Active") },
    { id: "b2", title: "Evening Backup Purchase", status: "Ordered", quantity: "25 kWh", price: "Rs. 7.1/kWh", type: getOrderBucket("Ordered") },
    { id: "b3", title: "Apartment Grid Share", status: "Allocated", quantity: "45 kWh", price: "Rs. 6.6/kWh", type: getOrderBucket("Allocated") },
    { id: "b4", title: "Weekend Smart Buy", status: "Settled", quantity: "60 kWh", price: "Rs. 6.4/kWh", type: getOrderBucket("Settled") },
    { id: "b5", title: "Solar Morning Slot", status: "Delivered", quantity: "15 kWh", price: "Rs. 6.2/kWh", type: getOrderBucket("Delivered") },
];

const INITIAL_SELLER_ORDERS = [
    { id: "s1", title: "Commercial Solar Batch", status: "Active", quantity: "55 kWh", price: "Rs. 7.4/kWh", type: getOrderBucket("Active") },
    { id: "s2", title: "Industrial Day Slot", status: "Ordered", quantity: "80 kWh", price: "Rs. 7.0/kWh", type: getOrderBucket("Ordered") },
    { id: "s3", title: "Community Feed #22", status: "Allocated", quantity: "120 kWh", price: "Rs. 6.9/kWh", type: getOrderBucket("Allocated") },
    { id: "s4", title: "Battery Reserve Listing", status: "Settled", quantity: "30 kWh", price: "Rs. 6.7/kWh", type: getOrderBucket("Settled") },
    { id: "s5", title: "Grid Feed #402", status: "Delivered", quantity: "100 kWh", price: "Rs. 6.5/kWh", type: getOrderBucket("Delivered") },
];

const STATUS_COLORS = {
    Active: "primary",
    Ordered: "tertiary",
    Delivered: "success",
    Allocated: "warning",
    Settled: "secondary",
    Accepted: "success",
    Rejected: "danger",
} as const;

export default function OrdersScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";
    const [activeTab, setActiveTab] = useState<"pending" | "settled">("pending");
    const [buyerOrders, setBuyerOrders] = useState(INITIAL_BUYER_ORDERS);
    const [sellerOrders, setSellerOrders] = useState(INITIAL_SELLER_ORDERS);

    const navRole: NavRole = role === "seller" ? "seller" : "buyer";
    const currentOrders = navRole === "seller" ? sellerOrders : buyerOrders;
    const setOrders = navRole === "seller" ? setSellerOrders : setBuyerOrders;

    const filteredOrders = currentOrders.filter(o => o.type === activeTab);

    const handleAction = useCallback((id: string, action: "Accepted" | "Rejected") => {
        setOrders(prev => prev.map(order => 
            order.id === id ? { ...order, status: action, type: getOrderBucket(action) } : order
        ));
        
        Alert.alert(
            `Order ${action}`,
            `The order has been ${action.toLowerCase()} successfully.`
        );
    }, [setOrders]);

    const openOrderSheet = useCallback((order: { id: string; title: string; quantity: string; price: string; status: string }) => {
        router.push({
            pathname: "/chatbot/publish-intent",
            params: {
                source: "orders",
                listingId: order.id,
                name: order.title,
                quantity: order.quantity.replace(" kWh", ""),
                price: order.price.replace(/^Rs\.\s*/i, "").replace("/kWh", ""),
                status: order.status.toLowerCase(),
            },
        });
    }, [router]);

    const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, orderId: string) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleAction(orderId, "Rejected")}
                style={[styles.actionButton, { backgroundColor: colors.danger, borderTopLeftRadius: CONTROL_RADIUS, borderBottomLeftRadius: CONTROL_RADIUS }]}
            >
                <Animated.View style={{ transform: [{ translateX: trans }] }}>
                    <X size={24} color="#FFF" />
                    <IrisText style={{ color: "#FFF", fontSize: 10, fontWeight: "800", marginTop: 4 }}>REJECT</IrisText>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, orderId: string) => {
        const trans = dragX.interpolate({
            inputRange: [-101, -100, -50, 0],
            outputRange: [-1, 0, 0, 20],
        });
        return (
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleAction(orderId, "Accepted")}
                style={[styles.actionButton, { backgroundColor: colors.primary, borderTopRightRadius: CONTROL_RADIUS, borderBottomRightRadius: CONTROL_RADIUS }]}
            >
                <Animated.View style={{ transform: [{ translateX: trans }] }}>
                    <Check size={24} color="#04150E" />
                    <IrisText style={{ color: "#04150E", fontSize: 10, fontWeight: "800", marginTop: 4 }}>ACCEPT</IrisText>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <IrisScreen scrollable={false} topInset={true}>
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: APP_BOTTOM_NAV_CLEARANCE + 40 }}>
                        <View style={{ paddingTop: 10, paddingBottom: 24 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <View>
                                    <IrisText style={{ fontSize: 22, fontWeight: "800", color: colors.onSurface }}>My Orders</IrisText>
                                    <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: 2 }}>
                                        {navRole === "seller"
                                            ? "Manage your energy settlements."
                                            : "Track your energy purchases."}
                                    </IrisText>
                                </View>
                            </View>

                            {navRole === "seller" && (
                                <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
                                    {[
                                        { label: "Total Earnings", value: "₹0.09", color: "#00C76A", icon: "TrendingUp" },
                                        { label: "Energy Sold", value: "1 kWh", color: "#FFB347", icon: "Zap" },
                                        { label: "Active Orders", value: "12", color: "#4CC9F0", icon: "Activity" },
                                    ].map((m, i) => (
                                        <View key={i} style={{ 
                                            flex: 1, backgroundColor: isDark ? "#121212" : colors.surface, 
                                            borderRadius: CONTROL_RADIUS, padding: 8, borderWidth: 1, borderColor: colors.outlineVariant,
                                            elevation: 0, shadowOpacity: 0
                                        }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                                <View style={{ 
                                                    width: 22, height: 22, borderRadius: 6, 
                                                    backgroundColor: m.color + "18", 
                                                    alignItems: "center", justifyContent: "center",
                                                    marginRight: 6
                                                }}>
                                                    <AppIcon 
                                                        name={m.icon.toLowerCase() === "trendingup" ? "trending-up" : m.icon.toLowerCase()} 
                                                        size={12} 
                                                        color={m.color} 
                                                    />
                                                </View>
                                                <IrisText style={{ fontSize: 9, color: colors.onSurfaceVariant, fontWeight: "700", flex: 1 }} numberOfLines={1}>{m.label.toUpperCase()}</IrisText>
                                            </View>
                                            <IrisText style={{ fontSize: 16, fontWeight: "800", color: i === 0 ? "#00C76A" : colors.onSurface, paddingLeft: 2 }}>{m.value}</IrisText>
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
                                                : toneKey === "danger"
                                                    ? colors.danger
                                                    : colors.tertiary;

                                const isSwipeable = order.status === "Ordered";

                                const CardBody = (
                                    <View style={{ marginHorizontal: isSwipeable ? 0 : 0 }}>
                                        <IrisCard className="p-4" style={{ borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: CONTROL_RADIUS }}>
                                            <View className="flex-row items-start justify-between mb-3">
                                                <View className="flex-1 pr-3">
                                                    <IrisText style={{ fontSize: 14, fontWeight: "700", color: colors.onSurface }}>{order.title}</IrisText>
                                                    <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "600", marginTop: 1 }}>{order.quantity}</IrisText>
                                                </View>
                                                <View
                                                    className="px-2 py-1 rounded-lg"
                                                    style={{ backgroundColor: accent + "18" }}
                                                >
                                                    <IrisText style={{ color: accent, fontSize: 9, fontWeight: "800" }}>
                                                        {order.status.toUpperCase()}
                                                    </IrisText>
                                                </View>
                                            </View>

                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center">
                                                    <IrisText style={{ fontWeight: "700", fontSize: 13, color: colors.onSurface }}>
                                                        {order.price}
                                                    </IrisText>
                                                </View>
                                                <View className="flex-row items-center" style={{ backgroundColor: colors.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                                                    <IrisText style={{ fontSize: 9, fontWeight: "700", color: colors.onSurfaceVariant }}>
                                                        Recently
                                                    </IrisText>
                                                </View>
                                            </View>
                                        </IrisCard>
                                    </View>
                                );

                                if (isSwipeable) {
                                    return (
                                        <View key={order.id} style={{ marginBottom: 12 }}>
                                            <Swipeable
                                                renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, order.id)}
                                                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, order.id)}
                                                friction={2}
                                                leftThreshold={30}
                                                rightThreshold={40}
                                            >
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => openOrderSheet(order)}>
                                                    {CardBody}
                                                </TouchableOpacity>
                                            </Swipeable>
                                        </View>
                                    );
                                }

                                return (
                                    <TouchableOpacity key={order.id} activeOpacity={0.7} className="mb-3" onPress={() => openOrderSheet(order)}>
                                        {CardBody}
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

const styles = StyleSheet.create({
    actionButton: {
        width: 80,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
});
