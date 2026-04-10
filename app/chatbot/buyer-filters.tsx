import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, ScrollView, Pressable, LayoutChangeEvent, Switch, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import {
    Battery,
    Building2,
    Check,
    ChevronDown,
    Filter,
    Layers,
    Leaf,
    Moon,
    Sunrise,
    Sun,
    Sunset,
    TrendingDown,
    X,
    Zap
} from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";
import {
    DEFAULT_BUYER_FILTERS,
    DEFAULT_MAX_RATE,
    DISCOM_OPTIONS,
    ENERGY_SOURCE_OPTIONS,
    QUANTITY_PRESETS,
    TIME_SLOT_OPTIONS,
    type BuyerFilters,
    type EnergySourceFilter,
    type TimeSlotFilter,
    useBuyerFiltersStore
} from "../../stores/useBuyerFiltersStore";

const sourceIconMap = {
    solar: Sun,
    battery: Battery,
    grid: Zap,
    hybrid: Layers,
    renewable: Leaf,
} satisfies Record<EnergySourceFilter, React.ComponentType<{ size?: number; color?: string }>>;

const timeIconMap = {
    morning: Sunrise,
    afternoon: Sun,
    evening: Sunset,
    night: Moon,
} satisfies Record<Exclude<TimeSlotFilter, "any">, React.ComponentType<{ size?: number; color?: string }>>;

export default function BuyerFiltersScreen() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const { filters, setFilters } = useBuyerFiltersStore();
    const [draftFilters, setDraftFilters] = useState<BuyerFilters>(filters);
    const [rateTrackWidth, setRateTrackWidth] = useState(0);
    const [quantityTrackWidth, setQuantityTrackWidth] = useState(0);

    const isDark = theme === "dark";
    const surfaceColor = isDark ? "#121214" : "#FFFFFF";
    const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const trackBase = isDark ? "#1A1A1D" : "#F2F2F2";

    const selectedSourceCount = draftFilters.sources.length;

    const updateRateFromPress = (locationX: number) => {
        if (!rateTrackWidth) return;
        const ratio = Math.max(0, Math.min(1, locationX / rateTrackWidth));
        setDraftFilters((current) => ({
            ...current,
            maxRate: Math.max(1, Math.round(ratio * DEFAULT_MAX_RATE)),
        }));
    };

    const updateQuantityFromPress = (locationX: number) => {
        if (!quantityTrackWidth) return;
        const ratio = Math.max(0, Math.min(1, locationX / quantityTrackWidth));
        const nextQuantity = Math.round((ratio * 500) / 10) * 10;
        setDraftFilters((current) => ({
            ...current,
            minQuantity: nextQuantity,
        }));
    };

    const toggleSource = (source: EnergySourceFilter) => {
        setDraftFilters((current) => {
            const alreadySelected = current.sources.includes(source);
            return {
                ...current,
                sources: alreadySelected
                    ? current.sources.filter((item) => item !== source)
                    : [...current.sources, source],
            };
        });
    };

    const handleReset = () => {
        setDraftFilters(DEFAULT_BUYER_FILTERS);
    };

    const handleDone = () => {
        setFilters(draftFilters);
        router.back();
    };

    const headerHeight = useHeaderHeight();

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? "#0B0B0C" : "#FAFBFA" }}>
            <View className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: headerHeight + 8 }}>
                    {/* Energy Source */}
                    <View className="mt-0 mb-8">
                        <View className="flex-row items-center justify-between mb-5">
                            <IrisText style={{ fontSize: 16, fontWeight: '700', color: colors.onSurface }}>Energy Source</IrisText>
                            <IrisText style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>
                                {selectedSourceCount} selected
                            </IrisText>
                        </View>

                        <View className="flex-row flex-wrap justify-between">
                            {ENERGY_SOURCE_OPTIONS.map((option) => {
                                const Icon = sourceIconMap[option.id];
                                const selected = draftFilters.sources.includes(option.id);
                                return (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => toggleSource(option.id)}
                                        className="w-[48.5%] rounded-2xl px-4 py-5 mb-3 border flex-row items-center justify-between"
                                        style={{
                                            backgroundColor: selected ? (isDark ? "rgba(197, 255, 117, 0.08)" : "rgba(197, 255, 117, 0.1)") : surfaceColor,
                                            borderColor: selected ? colors.primary : borderColor,
                                            borderWidth: 1.5,
                                        }}
                                    >
                                        <View className="flex-row items-center flex-1">
                                            <Icon size={20} color={selected ? colors.primary : colors.muted} />
                                            <IrisText
                                                style={{
                                                    color: selected ? colors.primary : colors.onSurfaceVariant,
                                                    fontSize: 15,
                                                    fontWeight: "600",
                                                    marginLeft: 12
                                                }}
                                            >
                                                {option.label}
                                            </IrisText>
                                        </View>
                                        {selected && <Check size={16} color={colors.primary} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="h-[1] w-full bg-outlineVariant mb-8" />

                    {/* Rate Range */}
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <View>
                                <IrisText style={{ fontSize: 16, fontWeight: '700', color: colors.onSurface }}>Rate Range (₹)</IrisText>
                                <IrisText variant="muted" style={{ fontSize: 13, marginTop: 2 }}>Filter by price per unit</IrisText>
                            </View>
                            <View className="px-3 py-1.5 rounded-lg bg-surfaceVariant">
                                <IrisText style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: '700' }}>
                                    ₹0 - ₹{draftFilters.maxRate}
                                </IrisText>
                            </View>
                        </View>

                        <Pressable
                            onLayout={(e) => setRateTrackWidth(e.nativeEvent.layout.width)}
                            onPress={(e) => updateRateFromPress(e.nativeEvent.locationX)}
                            className="h-8 justify-center mt-2"
                        >
                            <View className="h-2 rounded-full" style={{ backgroundColor: trackBase }} />
                            <View
                                className="absolute left-0 h-2 rounded-full"
                                style={{ width: `${(draftFilters.maxRate / DEFAULT_MAX_RATE) * 100}%`, backgroundColor: colors.primary }}
                            />
                            <View
                                className="absolute w-6 h-6 rounded-full border-2"
                                style={{
                                    left: Math.max(0, (draftFilters.maxRate / DEFAULT_MAX_RATE) * (rateTrackWidth - 24)),
                                    backgroundColor: colors.surface,
                                    borderColor: colors.primary,
                                    elevation: 4,
                                    shadowColor: colors.primary,
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                }}
                            />
                        </Pressable>
                        <View className="flex-row justify-between mt-2">
                            <IrisText style={{ color: colors.muted, fontSize: 12 }}>₹0</IrisText>
                            <IrisText style={{ color: colors.muted, fontSize: 12 }}>₹{DEFAULT_MAX_RATE}</IrisText>
                        </View>
                    </View>

                    <View className="h-[1] w-full bg-outlineVariant mb-8" />

                    {/* Minimum Quantity */}
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between mb-4">
                            <View>
                                <IrisText style={{ fontSize: 16, fontWeight: '700', color: colors.onSurface }}>Minimum Quantity</IrisText>
                                <IrisText variant="muted" style={{ fontSize: 13, marginTop: 2 }}>Only show sellers with at least this amount</IrisText>
                            </View>
                            <View className="px-3 py-1.5 rounded-lg bg-surfaceVariant">
                                <IrisText style={{ color: colors.onSurfaceVariant, fontSize: 12, fontWeight: '700' }}>
                                    {draftFilters.minQuantity} kWh
                                </IrisText>
                            </View>
                        </View>

                        <Pressable
                            onLayout={(e) => setQuantityTrackWidth(e.nativeEvent.layout.width)}
                            onPress={(e) => updateQuantityFromPress(e.nativeEvent.locationX)}
                            className="h-8 justify-center mt-2"
                        >
                            <View className="h-2 rounded-full" style={{ backgroundColor: trackBase }} />
                            <View
                                className="absolute left-0 h-2 rounded-full"
                                style={{ width: `${(draftFilters.minQuantity / 500) * 100}%`, backgroundColor: "rgba(62, 186, 244, 0.4)" }}
                            />
                            <View
                                className="absolute w-6 h-6 rounded-full border-2"
                                style={{
                                    left: Math.max(0, (draftFilters.minQuantity / 500) * (quantityTrackWidth - 24)),
                                    backgroundColor: colors.surface,
                                    borderColor: "#3EBAF4",
                                    elevation: 4,
                                }}
                            />
                        </Pressable>
                        <View className="flex-row justify-between mt-2 mb-6">
                            <IrisText style={{ color: colors.muted, fontSize: 12 }}>0 kWh</IrisText>
                            <IrisText style={{ color: colors.muted, fontSize: 12 }}>500 kWh</IrisText>
                        </View>

                        <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                            {QUANTITY_PRESETS.map((preset) => {
                                const selected = draftFilters.minQuantity === preset;
                                return (
                                    <TouchableOpacity
                                        key={preset}
                                        onPress={() => setDraftFilters((current) => ({ ...current, minQuantity: preset }))}
                                        className="px-4 py-2.5 rounded-xl border"
                                        style={{
                                            backgroundColor: selected ? (isDark ? "rgba(139, 44, 244, 0.15)" : "rgba(139, 44, 244, 0.08)") : surfaceColor,
                                            borderColor: selected ? "#8B2CF4" : borderColor,
                                        }}
                                    >
                                        <IrisText style={{ color: selected ? "#8B2CF4" : colors.onSurfaceVariant, fontSize: 13, fontWeight: "600" }}>
                                            {preset === 0 ? "Any" : `${preset} kWh`}
                                        </IrisText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="mb-10">
                        <TouchableOpacity
                            onPress={() => setDraftFilters((current) => ({ ...current, saveMoney: !current.saveMoney }))}
                            activeOpacity={0.7}
                            className="rounded-3xl p-5 border flex-row items-center justify-between"
                            style={{ backgroundColor: surfaceColor, borderColor }}
                        >
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-full items-center justify-center bg-slate-100 mr-4">
                                    <TrendingDown size={22} color="#64748b" />
                                </View>
                                <View className="flex-1">
                                    <IrisText style={{ fontSize: 16, fontWeight: '700', color: colors.onSurface }}>Save Money</IrisText>
                                    <IrisText variant="muted" style={{ fontSize: 12, marginTop: 2 }}>Only show cheaper than grid</IrisText>
                                </View>
                            </View>
                            <Switch
                                value={draftFilters.saveMoney}
                                onValueChange={(v) => setDraftFilters((c) => ({ ...c, saveMoney: v }))}
                                trackColor={{ false: isDark ? "#314361" : "#e2e8f0", true: colors.primary + "80" }}
                                thumbColor={draftFilters.saveMoney ? colors.primary : "#ffffff"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="h-[1] w-full bg-outlineVariant mb-8" />

                    {/* Preferred Time */}
                    <View className="mb-10">
                        <View className="flex-row items-center justify-between mb-5">
                            <IrisText style={{ fontSize: 16, fontWeight: '700', color: colors.onSurface }}>Preferred Time</IrisText>
                            <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-xl bg-surfaceVariant">
                                <IrisText style={{ color: colors.onSurface, fontSize: 13, fontWeight: '600', marginRight: 8 }}>Any Date</IrisText>
                                <ChevronDown size={14} color={colors.muted} />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row flex-wrap justify-between">
                            {TIME_SLOT_OPTIONS.map((option) => {
                                const Icon = timeIconMap[option.id];
                                const selected = draftFilters.timeSlot === option.id;
                                return (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => setDraftFilters((c) => ({ ...c, timeSlot: c.timeSlot === option.id ? "any" : option.id }))}
                                        className="w-[48.5%] rounded-3xl p-5 mb-3 border items-center"
                                        style={{
                                            backgroundColor: selected ? (isDark ? "rgba(197, 255, 117, 0.08)" : "rgba(197, 255, 117, 0.1)") : surfaceColor,
                                            borderColor: selected ? colors.primary : borderColor,
                                            borderWidth: 1.5,
                                        }}
                                    >
                                        <Icon size={28} color={selected ? colors.primary : colors.secondary} />
                                        <IrisText style={{ color: selected ? colors.onSurface : colors.onSurfaceVariant, fontSize: 16, fontWeight: "700", marginTop: 12 }}>
                                            {option.label}
                                        </IrisText>
                                        <IrisText style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{option.time}</IrisText>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className="h-[1] w-full bg-outlineVariant mb-8" />

                    {/* Discom */}
                    <View className="mb-10">
                        <IrisText style={{ fontSize: 16, fontWeight: '700', color: colors.onSurface, marginBottom: 5 }}>Discom</IrisText>
                        {DISCOM_OPTIONS.map((option) => {
                            const selected = draftFilters.discom === option.id;
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => setDraftFilters((c) => ({ ...c, discom: option.id }))}
                                    className="rounded-2xl px-5 py-5 mb-3 border flex-row items-center justify-between"
                                    style={{
                                        backgroundColor: selected ? (isDark ? "rgba(197, 255, 117, 0.08)" : "rgba(197, 255, 117, 0.1)") : surfaceColor,
                                        borderColor: selected ? colors.primary : borderColor,
                                    }}
                                >
                                    <View className="flex-row items-center">
                                        <Building2 size={20} color={selected ? colors.primary : colors.muted} />
                                        <IrisText style={{ color: selected ? colors.onSurface : colors.onSurfaceVariant, fontSize: 15, fontWeight: "600", marginLeft: 16 }}>
                                            {option.label}
                                        </IrisText>
                                    </View>
                                    {selected && <Check size={20} color={colors.primary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Footer Buttons */}
                <View className="px-4 pt-4 pb-6 border-t flex-row" style={{ borderColor, backgroundColor: colors.background }}>
                    <TouchableOpacity
                        onPress={handleReset}
                        style={{ flex: 1, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.onSurface }}
                    >
                        <IrisText style={{ color: colors.onSurface, fontWeight: '700' }}>Reset</IrisText>
                    </TouchableOpacity>
                    <View style={{ width: 15 }} />
                    <TouchableOpacity
                        onPress={handleDone}
                        style={{ flex: 1, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}
                    >
                        <IrisText style={{ color: "#04150E", fontWeight: '700' }}>Done</IrisText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
