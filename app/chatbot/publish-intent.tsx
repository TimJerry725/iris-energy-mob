import React, { useState } from "react";
import {
    View, ScrollView, TouchableOpacity, TextInput, Switch, Platform
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IrisText } from "../../components/IrisText";
import { IrisCard } from "../../components/IrisCard";
import { Check, Zap, Leaf, Wind, Droplet, Layers, Calendar, Clock } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONTROL_RADIUS } from "../../components/controlStyles";

type EnergyType = "solar" | "wind" | "battery" | "grid" | "hybrid";

const ENERGY_TYPES: { key: EnergyType; label: string }[] = [
    { key: "solar",   label: "Solar" },
    { key: "wind",    label: "Wind" },
    { key: "battery", label: "Battery" },
    { key: "grid",    label: "Grid" },
    { key: "hybrid",  label: "Hybrid" },
];

const getTypeIcon = (type: EnergyType, color: string) => {
    switch (type) {
        case "solar":   return <Leaf size={16} color={color} />;
        case "wind":    return <Wind size={16} color={color} />;
        case "battery": return <Zap size={16} color={color} />;
        case "grid":    return <Zap size={16} color={color} />;
        case "hybrid":  return <Layers size={16} color={color} />;
    }
};

// Quick-select time slots
const TIME_OPTIONS = ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"];

export default function PublishIntentScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors, theme } = useTheme();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const isDark = theme === "dark";

    const [selectedType, setSelectedType] = useState<EnergyType>("solar");
    const [quantity, setQuantity] = useState("5");
    const [price, setPrice] = useState("4.25");
    const [deliveryDate, setDeliveryDate] = useState("04/01/2026");
    const [startTime, setStartTime] = useState("12:00 PM");
    const [endTime, setEndTime] = useState("01:00 PM");
    const [autoSell, setAutoSell] = useState(false);

    const borderColor = isDark ? "rgba(255,255,255,0.08)" : colors.outlineVariant;
    const inputBg = isDark ? "#1A1A1D" : colors.surface;
    const sectionGap = 22;

    const fieldStyle = {
        backgroundColor: inputBg,
        borderWidth: 1.5,
        borderColor: borderColor,
        borderRadius: CONTROL_RADIUS,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.onSurface,
        fontFamily: "IBMPlexSans_400Regular",
    };

    const labelStyle = { fontSize: 15, fontWeight: "700" as const, color: colors.onSurface, marginBottom: 10 };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: headerHeight + 8,
                    paddingBottom: insets.bottom + 100,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Sanctioned Load + Meter ID */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: sectionGap }}>
                    {[
                        { icon: <Zap size={18} color={colors.primary} />, label: "SANCTIONED LOAD", value: "5 kW" },
                        { icon: <Zap size={18} color={colors.primary} />, label: "METER ID",        value: "62358103" },
                    ].map((item, i) => (
                        <View key={i} style={{
                            flex: 1, backgroundColor: inputBg,
                            borderRadius: CONTROL_RADIUS, padding: 14,
                            borderWidth: 1.5, borderColor: borderColor,
                        }}>
                            <View style={{ marginBottom: 6 }}>{item.icon}</View>
                            <IrisText style={{ fontSize: 10, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 }}>
                                {item.label}
                            </IrisText>
                            <IrisText style={{ fontSize: 16, fontWeight: "800", color: colors.onSurface, marginTop: 3 }}>
                                {item.value}
                            </IrisText>
                        </View>
                    ))}
                </View>

                {/* Energy Source Type */}
                <IrisText style={labelStyle}>Energy Source Type</IrisText>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: sectionGap }}>
                    {ENERGY_TYPES.map((type) => {
                        const isActive = selectedType === type.key;
                        return (
                            <TouchableOpacity
                                key={type.key}
                                onPress={() => setSelectedType(type.key)}
                                style={{
                                    flexDirection: "row", alignItems: "center", gap: 8,
                                    paddingHorizontal: 16, paddingVertical: 10, borderRadius: CONTROL_RADIUS,
                                    borderWidth: 1.5,
                                    borderColor: isActive ? colors.primary : borderColor,
                                    backgroundColor: isActive ? colors.primary + "18" : inputBg,
                                }}
                            >
                                {getTypeIcon(type.key, isActive ? colors.primary : colors.onSurfaceVariant)}
                                <IrisText style={{
                                    fontSize: 13, fontWeight: "700",
                                    color: isActive ? colors.primary : colors.onSurfaceVariant,
                                    letterSpacing: 0.4,
                                }}>
                                    {type.label.toUpperCase()}
                                </IrisText>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Quantity & Price */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: sectionGap }}>
                    <View style={{ flex: 1 }}>
                        <IrisText style={labelStyle}>Quantity (kWh)</IrisText>
                        <View style={{ flexDirection: "row", alignItems: "center", ...fieldStyle as any, gap: 10 }}>
                            <Zap size={16} color={colors.onSurfaceVariant} />
                            <TextInput
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                style={{ flex: 1, color: colors.onSurface, fontSize: 16, fontFamily: "IBMPlexSans_400Regular" }}
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <IrisText style={labelStyle}>Price (₹/kWh)</IrisText>
                        <View style={{ flexDirection: "row", alignItems: "center", ...fieldStyle as any, gap: 10 }}>
                            <IrisText style={{ fontSize: 16, color: colors.onSurfaceVariant, fontWeight: "600" }}>₹</IrisText>
                            <TextInput
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                style={{ flex: 1, color: colors.onSurface, fontSize: 16, fontFamily: "IBMPlexSans_400Regular" }}
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>
                </View>

                {/* Delivery Date */}
                <IrisText style={labelStyle}>Delivery Date</IrisText>
                <View style={{ flexDirection: "row", alignItems: "center", ...fieldStyle as any, gap: 12, marginBottom: sectionGap }}>
                    <Calendar size={18} color={colors.onSurfaceVariant} />
                    <TextInput
                        value={deliveryDate}
                        onChangeText={setDeliveryDate}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor={colors.muted}
                        style={{ flex: 1, color: colors.onSurface, fontSize: 16, fontFamily: "IBMPlexSans_400Regular" }}
                    />
                    <Calendar size={18} color={colors.onSurfaceVariant} />
                </View>

                {/* Delivery Time Window */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Clock size={16} color={colors.onSurface} />
                    <IrisText style={labelStyle}>Delivery Time Window</IrisText>
                </View>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 6, fontWeight: "500" }}>Start Time</IrisText>
                        <View style={{ flexDirection: "row", alignItems: "center", ...fieldStyle as any, gap: 10 }}>
                            <TextInput
                                value={startTime}
                                onChangeText={setStartTime}
                                placeholder="12:00 PM"
                                placeholderTextColor={colors.muted}
                                style={{ flex: 1, color: colors.onSurface, fontSize: 15, fontFamily: "IBMPlexSans_400Regular" }}
                            />
                            <Clock size={16} color={colors.onSurfaceVariant} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 6, fontWeight: "500" }}>End Time</IrisText>
                        <View style={{ flexDirection: "row", alignItems: "center", ...fieldStyle as any, gap: 10 }}>
                            <TextInput
                                value={endTime}
                                onChangeText={setEndTime}
                                placeholder="01:00 PM"
                                placeholderTextColor={colors.muted}
                                style={{ flex: 1, color: colors.onSurface, fontSize: 15, fontFamily: "IBMPlexSans_400Regular" }}
                            />
                            <Clock size={16} color={colors.onSurfaceVariant} />
                        </View>
                    </View>
                </View>
                <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: sectionGap }}>
                    Selected: {startTime} – {endTime}
                </IrisText>

                {/* Auto-Sell Toggle */}
                <IrisCard style={{ padding: 16, marginBottom: sectionGap }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <IrisText style={{ fontSize: 15, fontWeight: "700", color: colors.onSurface }}>Enable Auto-Sell</IrisText>
                            <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 3 }}>
                                {autoSell ? "Orders will be fulfilled automatically" : "You will need to manually approve each order"}
                            </IrisText>
                        </View>
                        <Switch
                            value={autoSell}
                            onValueChange={setAutoSell}
                            trackColor={{ false: colors.outlineVariant, true: colors.primary + "80" }}
                            thumbColor={autoSell ? colors.primary : colors.onSurfaceVariant}
                        />
                    </View>
                </IrisCard>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                backgroundColor: colors.surface,
                borderTopWidth: 1, borderColor: colors.outlineVariant,
                flexDirection: "row", gap: 12,
                paddingHorizontal: 20, paddingTop: 14,
                paddingBottom: Math.max(insets.bottom, 16) + 4,
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flex: 1, height: 52, borderRadius: CONTROL_RADIUS, borderWidth: 1.5,
                        borderColor: colors.onSurface, alignItems: "center", justifyContent: "center",
                    }}
                >
                    <IrisText style={{ fontSize: 15, fontWeight: "700", color: colors.onSurface }}>Cancel</IrisText>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        // TODO: submit listing
                        router.back();
                    }}
                    style={{
                        flex: 1, height: 52, borderRadius: CONTROL_RADIUS,
                        backgroundColor: colors.primary,
                        alignItems: "center", justifyContent: "center",
                        shadowColor: colors.primary,
                        shadowOpacity: 0.4, shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 }, elevation: 6,
                    }}
                >
                    <IrisText style={{ fontSize: 15, fontWeight: "800", color: "#04150E" }}>Publish Intent</IrisText>
                </TouchableOpacity>
            </View>
        </View>
    );
}
