import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Image, TextInput, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisCard } from "../../components/IrisCard";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { Bell, Search, SlidersHorizontal, Zap, Leaf, Wind, Droplet, MapPin, Clock } from "../../components/AppIcons";
import { CONTROL_HEIGHT, CONTROL_RADIUS } from "../../components/controlStyles";
import { useTheme } from "../../context/ThemeContext";
import { MARKET_DATA, EnergyAsset } from "../../constants/marketData";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock DISCOM data for demo
const DISCOM_DATA: Record<string, { logo: string, region: string, saleWindow: string }> = {
    "1": { logo: "RP", region: "Rajasthan Vedyut", saleWindow: "06:00 – 18:00" },
    "2": { logo: "TN", region: "TANGEDCO",          saleWindow: "08:00 – 20:00" },
    "3": { logo: "NG", region: "National Grid",     saleWindow: "00:00 – 24:00" },
    "4": { logo: "KA", region: "BESCOM",            saleWindow: "07:00 – 19:00" },
    "5": { logo: "MH", region: "MAVADISC",          saleWindow: "09:00 – 21:00" },
};

export default function BuyerDashboardScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors, theme } = useTheme();
    const navRole: NavRole = role === "seller" ? "seller" : "buyer";
    const [searchQuery, setSearchQuery] = useState("");

    const userName = "Sajibur Rahman";

    const getEnergyIcon = (type: string, size = 20, color?: string) => {
        const iconColor = color || colors.primary;
        switch (type) {
            case "solar": return <Leaf size={size} color={iconColor} />;
            case "wind": return <Wind size={size} color={iconColor} />;
            case "hydro": return <Droplet size={size} color={iconColor} />;
            default: return <Zap size={size} color={iconColor} />;
        }
    };

    return (
        <IrisScreen scrollable={false} topInset={true}>
            <View className="flex-1">
                {/* Header Section */}
                <View className="px-5 pt-0 pb-2 bg-background">
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full overflow-hidden bg-primaryContainer items-center justify-center mr-3">
                                <IrisText style={{ color: colors.primary, fontWeight: '700' }}>SR</IrisText>
                            </View>
                            <View>
                                <IrisText variant="muted" style={{ fontSize: 12 }}>Welcome back,</IrisText>
                                <IrisText style={{ fontSize: 16, fontWeight: '700', color: colors.onSurface }}>{userName}</IrisText>
                            </View>
                        </View>
                        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-outlineVariant">
                            <Bell size={20} color={colors.onSurface} />
                        </TouchableOpacity>
                    </View>

                    {/* Search & Filter Bar */}
                    <View className="flex-row items-center mb-4">
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: CONTROL_HEIGHT,
                                borderRadius: CONTROL_RADIUS,
                                backgroundColor: colors.surface,
                                borderWidth: 1.5,
                                borderColor: colors.outline,
                                paddingHorizontal: 14,
                                shadowColor: '#000',
                                shadowOpacity: 0.08,
                                shadowRadius: 8,
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 2,
                            }}
                        >
                            <Search size={18} color={colors.onSurface} />
                            <TextInput
                                placeholder="Search energy assets..."
                                placeholderTextColor={colors.muted}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: 15,
                                    color: colors.onSurface,
                                    fontFamily: 'IBMPlexSans_400Regular',
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: "/chatbot/buyer-filters", params: { role } })}
                            style={{
                                marginLeft: 10,
                                width: CONTROL_HEIGHT,
                                height: CONTROL_HEIGHT,
                                borderRadius: CONTROL_RADIUS,
                                backgroundColor: '#00C76A',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#00C76A',
                                shadowOpacity: 0.45,
                                shadowRadius: 10,
                                shadowOffset: { width: 0, height: 4 },
                                elevation: 6,
                            }}
                        >
                            <SlidersHorizontal size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: APP_BOTTOM_NAV_CLEARANCE + 20, paddingHorizontal: 20 }}
                    className="flex-1"
                >
                    <View className="flex-row items-center justify-between mt-4 mb-4">
                        <IrisText style={{ fontSize: 18, fontWeight: '700', color: colors.onSurface }}>Recent Energy Listings</IrisText>
                        <TouchableOpacity>
                            <IrisText style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>See All</IrisText>
                        </TouchableOpacity>
                    </View>

                    {MARKET_DATA.map((asset) => {
                        const discom = DISCOM_DATA[asset.id] || { logo: "IN", region: "India Power" };
                        
                        return (
                            <TouchableOpacity
                                key={asset.id}
                                onPress={() => router.push(`/chatbot/asset/${asset.id}`)}
                                activeOpacity={0.7}
                                className="mb-4"
                            >
                                 <IrisCard style={{ padding: 0, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 12 }}>
                                    <View style={{ padding: 16 }}>
                                        {/* Top Row: Icon + Name / Price */}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 12,
                                                    backgroundColor: colors.primaryContainer,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 12,
                                                }}>
                                                    {getEnergyIcon(asset.type, 22)}
                                                </View>
                                                <View>
                                                    <IrisText style={{ fontSize: 15, fontWeight: '700', color: colors.onSurface }}>{asset.name}</IrisText>
                                                    <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, fontWeight: '500', marginTop: 2 }}>
                                                        {asset.type.toUpperCase()} • {asset.capacity || 'N/A'}
                                                    </IrisText>
                                                </View>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <IrisText style={{ fontSize: 20, fontWeight: '800', color: colors.primary }}>
                                                    ₹{asset.price.toFixed(2)}
                                                </IrisText>
                                                <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: '500', marginTop: 1 }}>per kWh</IrisText>
                                            </View>
                                        </View>

                                        {/* Divider */}
                                        <View style={{ height: 1, backgroundColor: colors.outline, marginBottom: 12, opacity: 0.4 }} />

                                        {/* Bottom Row: DISCOM + Sale Time */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 17,
                                                    backgroundColor: colors.surfaceVariant,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: 10,
                                                    borderWidth: 1,
                                                    borderColor: colors.outline,
                                                }}>
                                                    <IrisText style={{ fontSize: 10, fontWeight: '800', color: colors.onSurface }}>{discom.logo}</IrisText>
                                                </View>
                                                <View>
                                                    <IrisText style={{ fontSize: 13, fontWeight: '700', color: colors.onSurface }}>{discom.region}</IrisText>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                        <MapPin size={10} color={colors.onSurfaceVariant} />
                                                        <IrisText style={{ fontSize: 10, color: colors.onSurfaceVariant, fontWeight: '500', marginLeft: 3 }}>
                                                            {asset.location || "Multiple"}
                                                        </IrisText>
                                                    </View>
                                                </View>
                                            </View>

                                            {/* Sale Time Badge */}
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: '#1A1A2E10',
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: 12,
                                                borderWidth: 1,
                                                borderColor: colors.outline,
                                                gap: 5,
                                            }}>
                                                <Clock size={12} color={colors.onSurface} />
                                                <View>
                                                    <IrisText style={{ fontSize: 10, color: colors.onSurfaceVariant, fontWeight: '500' }}>On Sale</IrisText>
                                                    <IrisText style={{ fontSize: 11, color: colors.onSurface, fontWeight: '700' }}>
                                                        {discom.saleWindow}
                                                    </IrisText>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </IrisCard>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <AppBottomNav
                    role={navRole}
                    activeTab={navRole === "seller" ? "buy" : "home"}
                />
            </View>
        </IrisScreen>
    );
}
