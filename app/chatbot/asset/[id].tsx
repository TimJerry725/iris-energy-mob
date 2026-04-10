import React from "react";
import { View, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IrisScreen } from "../../../components/IrisScreen";
import { IrisText } from "../../../components/IrisText";
import { IrisCard } from "../../../components/IrisCard";
import {
    TrendingUp, TrendingDown, MapPin, Zap, Leaf, Wind, Droplet,
    Calendar, Clock, ShieldCheck, Building2, BarChart2
} from "../../../components/AppIcons";
import { useTheme } from "../../../context/ThemeContext";
import { MARKET_DATA } from "../../../constants/marketData";
import Svg, { Polyline, Defs, LinearGradient as SvgLinearGradient, Stop, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONTROL_RADIUS } from "../../../components/controlStyles";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

// Extended mock data for energy detail (in real app this comes from backend)
const ASSET_DETAIL: Record<string, {
    discom: string;
    certification: string;
    contractType: string;
    minOrder: string;
    deliveryTime: string;
    saleWindow: string;
    co2Saved: string;
    availability: string;
}> = {
    "1": { discom: "Rajasthan Vidyut Prasaran Nigam", certification: "REC Certified", contractType: "Fixed Rate", minOrder: "10 kWh", deliveryTime: "Same Day", saleWindow: "06:00 – 18:00", co2Saved: "0.82 kg/kWh", availability: "High" },
    "2": { discom: "TANGEDCO", certification: "ISO 50001", contractType: "Variable Rate", minOrder: "25 kWh", deliveryTime: "Next Day", saleWindow: "08:00 – 20:00", co2Saved: "0.91 kg/kWh", availability: "Medium" },
    "3": { discom: "POSOCO National", certification: "BIS Certified", contractType: "Spot Price", minOrder: "50 kWh", deliveryTime: "Instant", saleWindow: "00:00 – 24:00", co2Saved: "0.65 kg/kWh", availability: "Very High" },
    "4": { discom: "BESCOM Karnataka", certification: "GreenPower Cert.", contractType: "Fixed Rate", minOrder: "5 kWh",  deliveryTime: "Same Day", saleWindow: "07:00 – 19:00", co2Saved: "0.98 kg/kWh", availability: "High" },
    "5": { discom: "MSEDCL Maharashtra", certification: "REC Certified", contractType: "Fixed Rate", minOrder: "10 kWh", deliveryTime: "Same Day", saleWindow: "09:00 – 21:00", co2Saved: "0.80 kg/kWh", availability: "Medium" },
    "101": { discom: "Residential Solar", certification: "Safety Verified", contractType: "Peer-to-Peer", minOrder: "1 kWh", deliveryTime: "Instant", saleWindow: "06:00 – 18:00", co2Saved: "0.15 kg/kWh", availability: "Personal" },
    "102": { discom: "Home Wind", certification: "ISO 9001", contractType: "Peer-to-Peer", minOrder: "1 kWh", deliveryTime: "Instant", saleWindow: "00:00 – 24:00", co2Saved: "0.08 kg/kWh", availability: "Personal" },
    "103": { discom: "EV Battery System", certification: "Lithium Safe", contractType: "Fixed Rate", minOrder: "1 kWh", deliveryTime: "Instant", saleWindow: "18:00 – 22:00", co2Saved: "0.22 kg/kWh", availability: "Personal" },
};

const getEnergyTypeIcon = (type: string, size: number, color: string) => {
    switch (type) {
        case "solar": return <Leaf size={size} color={color} />;
        case "wind":  return <Wind size={size} color={color} />;
        case "hydro": return <Droplet size={size} color={color} />;
        default:      return <Zap size={size} color={color} />;
    }
};

const getTypeGradient = (type: string) => {
    switch (type) {
        case "solar": return ["#FFB347", "#FF8C00"];
        case "wind":  return ["#56CCF2", "#2F80ED"];
        case "hydro": return ["#43E97B", "#38F9D7"];
        default:      return ["#00E673", "#1FD0B4"];
    }
};

export default function AssetDetailsScreen() {
    const { id, role } = useLocalSearchParams<{ id: string; role?: string }>();
    const router = useRouter();
    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = theme === "dark";

    const asset = MARKET_DATA.find((item) => item.id === id);
    const detail = ASSET_DETAIL[id] ?? ASSET_DETAIL["1"];

    if (!asset) {
        return (
            <IrisScreen topInset={false}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <IrisText>Asset not found</IrisText>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary }}
                    >
                        <IrisText style={{ color: "#fff", fontWeight: "700" }}>Go Back</IrisText>
                    </TouchableOpacity>
                </View>
            </IrisScreen>
        );
    }

    const isPositive = asset.change >= 0;
    const trendValues = asset.trend;
    const minVal = Math.min(...trendValues);
    const maxVal = Math.max(...trendValues);
    const range = maxVal - minVal || 1;
    const graphH = 80;
    const graphW = CARD_WIDTH - 32;

    const pts = trendValues.map((val, i) => {
        const x = (i / (trendValues.length - 1)) * graphW;
        const y = graphH - ((val - minVal) / range) * (graphH - 12) - 4;
        return { x, y };
    });
    const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
    const areaPath = `M0,${graphH} ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${graphW},${graphH} Z`;

    const changeColor = isPositive ? colors.primary : colors.danger;
    const typeColors = getTypeGradient(asset.type);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, paddingTop: 16 }}
            >
                {/* Hero Card */}
                <IrisCard style={{ marginBottom: 20, padding: 20 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                        <View style={{
                            width: 52, height: 52, borderRadius: 16,
                            backgroundColor: typeColors[0] + "22",
                            alignItems: "center", justifyContent: "center",
                            borderWidth: 1, borderColor: typeColors[0] + "44",
                            marginRight: 14,
                        }}>
                            {getEnergyTypeIcon(asset.type, 26, typeColors[0])}
                        </View>
                        <View style={{ flex: 1 }}>
                            <IrisText style={{ fontSize: 18, fontWeight: "800", color: colors.onSurface }}>{asset.name}</IrisText>
                            <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, fontWeight: "500", marginTop: 2 }}>
                                {asset.type.toUpperCase()} • {asset.symbol}
                            </IrisText>
                        </View>
                        <View style={{
                            paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
                            backgroundColor: detail.availability === "High" || detail.availability === "Very High"
                                ? "#00E67320" : "#FFB34720",
                        }}>
                            <IrisText style={{
                                fontSize: 11, fontWeight: "700",
                                color: detail.availability === "High" || detail.availability === "Very High" ? "#00A55A" : "#C97000"
                            }}>
                                {detail.availability}
                            </IrisText>
                        </View>
                    </View>

                    {/* Price */}
                    <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <View>
                            <IrisText style={{ fontSize: 36, fontWeight: "800", color: colors.onSurface, letterSpacing: -1 }}>
                                ₹{asset.price.toFixed(2)}
                            </IrisText>
                            <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: 2 }}>per kWh</IrisText>
                        </View>
                        <View style={{
                            flexDirection: "row", alignItems: "center",
                            backgroundColor: changeColor + "18",
                            paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
                        }}>
                            {isPositive
                                ? <TrendingUp size={14} color={changeColor} />
                                : <TrendingDown size={14} color={changeColor} />}
                            <IrisText style={{ color: changeColor, fontWeight: "700", fontSize: 13, marginLeft: 5 }}>
                                {isPositive ? "+" : ""}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(1)}%)
                            </IrisText>
                        </View>
                    </View>
                </IrisCard>

                {/* Price Trend Graph */}
                <IrisCard style={{ marginBottom: 20, padding: 16 }}>
                    <IrisText style={{ fontSize: 14, fontWeight: "700", color: colors.onSurface, marginBottom: 12 }}>
                        7-Day Price Trend
                    </IrisText>
                    <View style={{ height: graphH + 8 }}>
                        <Svg height={graphH + 8} width={graphW}>
                            <Defs>
                                <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor={changeColor} stopOpacity="0.25" />
                                    <Stop offset="1" stopColor={changeColor} stopOpacity="0" />
                                </SvgLinearGradient>
                            </Defs>
                            <Path d={areaPath} fill="url(#areaGrad)" />
                            <Polyline
                                points={polyline}
                                fill="none"
                                stroke={changeColor}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                        <IrisText style={{ fontSize: 11, color: colors.muted }}>₹{minVal.toFixed(2)}</IrisText>
                        <IrisText style={{ fontSize: 11, color: colors.muted }}>₹{maxVal.toFixed(2)}</IrisText>
                    </View>
                </IrisCard>

                {/* Key Stats Grid */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                    {[
                        { icon: <Zap size={18} color={colors.primary} />,     label: "Capacity",     value: asset.capacity || "N/A" },
                        { icon: <MapPin size={18} color="#3EBAF4" />,          label: "Location",     value: asset.location || "N/A" },
                        { icon: <Clock size={18} color="#FFB347" />,           label: "Sale Window",  value: detail.saleWindow },
                        { icon: <Calendar size={18} color="#8B2CF4" />,        label: "Delivery",     value: detail.deliveryTime },
                        { icon: <ShieldCheck size={18} color="#00A55A" />,     label: "Certified",    value: detail.certification },
                        { icon: <Leaf size={18} color="#43E97B" />,            label: "CO₂ Saved",    value: detail.co2Saved },
                    ].map((stat, i) => (
                        <View key={i} style={{
                            width: (CARD_WIDTH - 12) / 2,
                            backgroundColor: colors.surface,
                            borderRadius: 16,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: colors.outlineVariant,
                        }}>
                            <View style={{ marginBottom: 8 }}>{stat.icon}</View>
                            <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "500", marginBottom: 3 }}>
                                {stat.label}
                            </IrisText>
                            <IrisText style={{ fontSize: 13, fontWeight: "700", color: colors.onSurface }}>
                                {stat.value}
                            </IrisText>
                        </View>
                    ))}
                </View>

                {/* DISCOM & Contract Info */}
                <IrisCard style={{ marginBottom: 20, padding: 16 }}>
                    <IrisText style={{ fontSize: 14, fontWeight: "700", color: colors.onSurface, marginBottom: 14 }}>
                        Distribution & Contract
                    </IrisText>
                    {[
                        { icon: <Building2 size={16} color={colors.muted} />, label: "DISCOM",         value: detail.discom },
                        { icon: <BarChart2 size={16} color={colors.muted} />, label: "Contract Type",  value: detail.contractType },
                        { icon: <Zap size={16} color={colors.muted} />,       label: "Min. Order",     value: detail.minOrder },
                    ].map((row, i) => (
                        <View key={i} style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                            paddingVertical: 10,
                            borderBottomWidth: i < 2 ? 1 : 0,
                            borderColor: colors.outlineVariant,
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                {row.icon}
                                <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant }}>{row.label}</IrisText>
                            </View>
                            <IrisText style={{ fontSize: 13, fontWeight: "700", color: colors.onSurface }}>{row.value}</IrisText>
                        </View>
                    ))}
                </IrisCard>

                {/* Description */}
                <IrisCard style={{ marginBottom: 20, padding: 16 }}>
                    <IrisText style={{ fontSize: 14, fontWeight: "700", color: colors.onSurface, marginBottom: 10 }}>
                        About this Source
                    </IrisText>
                    <IrisText style={{ fontSize: 14, color: colors.onSurfaceVariant, lineHeight: 22 }}>
                        {asset.description || "No description available."}
                    </IrisText>
                </IrisCard>
            </ScrollView>

            {/* Sticky Buy Button */}
            <View style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                backgroundColor: colors.surface,
                borderTopWidth: 1,
                borderColor: colors.outlineVariant,
                paddingHorizontal: 16,
                paddingTop: 14,
                paddingBottom: Math.max(insets.bottom, 16) + 4,
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <View>
                        <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "500" }}>Total per kWh</IrisText>
                        <IrisText style={{ fontSize: 22, fontWeight: "800", color: colors.onSurface }}>₹{asset.price.toFixed(2)}</IrisText>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "500" }}>Min. Order</IrisText>
                        <IrisText style={{ fontSize: 14, fontWeight: "700", color: colors.onSurface }}>{detail.minOrder}</IrisText>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (role === "seller") {
                            router.push({ pathname: "/chatbot/publish-intent", params: { role: "seller", id: asset.id } });
                        } else {
                            router.push({ pathname: "/chatbot/orders", params: { role: role ?? "buyer" } });
                        }
                    }}
                    style={{
                        height: 52,
                        borderRadius: CONTROL_RADIUS,
                        backgroundColor: role === "seller" ? colors.secondary : colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: role === "seller" ? colors.secondary : colors.primary,
                        shadowOpacity: 0.4,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 6,
                    }}
                >
                    <IrisText style={{ fontSize: 16, fontWeight: "800", color: "#04150E", letterSpacing: 0.3 }}>
                        {role === "seller" ? "Edit Listing" : "Buy Energy"}
                    </IrisText>
                </TouchableOpacity>
            </View>
        </View>
    );
}
