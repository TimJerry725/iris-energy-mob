import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Rect, Defs, LinearGradient as SvgGradient, Stop, Line } from "react-native-svg";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisCard } from "../../components/IrisCard";
import { APP_BOTTOM_NAV_CLEARANCE, AppBottomNav, NavRole } from "../../components/AppBottomNav";
import { ChevronRight, Filter, TrendingUp, Zap } from "../../components/AppIcons";
import { useTheme } from "../../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CHART_DATA = [
    { label: "Mon", value: 65 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 85 },
    { label: "Thu", value: 55 },
    { label: "Fri", value: 75 },
    { label: "Sat", value: 40 },
    { label: "Sun", value: 30 },
];

export default function AnalyticsScreen() {
    const { role } = useLocalSearchParams<{ role?: string }>();
    const { colors } = useTheme();
    const navRole: NavRole = role === "seller" ? "seller" : "buyer";
    const [activeIndex, setActiveIndex] = useState(2);

    const chartHeight = 200;
    const barWidth = 32;
    const spacing = (SCREEN_WIDTH - 40 - (barWidth * CHART_DATA.length)) / (CHART_DATA.length - 1);

    return (
        <IrisScreen scrollable={false} style={{ backgroundColor: "#0B0B0C" }}>
            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: APP_BOTTOM_NAV_CLEARANCE + 40, paddingHorizontal: 20 }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mt-6 mb-8">
                        <IrisText style={{ fontSize: 24, fontWeight: '700', color: '#FFFFFF' }}>Analytics</IrisText>
                        <TouchableOpacity className="w-11 h-11 rounded-full items-center justify-center bg-[#121214] border border-white/5">
                            <Filter size={20} color={colors.onSurfaceVariant} />
                        </TouchableOpacity>
                    </View>

                    {/* Summary Card */}
                    <IrisCard className="mb-8" style={{ backgroundColor: '#121214', padding: 20 }}>
                        <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginBottom: 8 }}>Total Energy Usage</IrisText>
                        <View className="flex-row items-end justify-between">
                            <View className="flex-row items-baseline">
                                <IrisText style={{ fontSize: 32, fontWeight: '700', color: '#FFFFFF' }}>1,284</IrisText>
                                <IrisText style={{ fontSize: 14, color: colors.onSurfaceVariant, marginLeft: 6 }}>kWh</IrisText>
                            </View>
                            <View className="flex-row items-center bg-primary/10 px-3 py-1 rounded-full">
                                <TrendingUp size={14} color={colors.primary} />
                                <IrisText style={{ fontSize: 12, fontWeight: '600', color: colors.primary, marginLeft: 4 }}>+12.4%</IrisText>
                            </View>
                        </View>
                    </IrisCard>

                    {/* Bar Chart Section */}
                    <IrisText style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 20 }}>Weekly Activity</IrisText>
                    <IrisCard className="mb-8" style={{ backgroundColor: '#121214', padding: 20 }}>
                        <View style={{ height: chartHeight + 40, width: '100%' }}>
                            <Svg height="100%" width="100%">
                                <Defs>
                                    <SvgGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor={colors.primary} />
                                        <Stop offset="100%" stopColor={colors.secondary} />
                                    </SvgGradient>
                                </Defs>
                                
                                {/* Grid Lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                                    <Line
                                        key={i}
                                        x1="0"
                                        y1={chartHeight * p}
                                        x2="100%"
                                        y2={chartHeight * p}
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth="1"
                                    />
                                ))}

                                {/* Bars */}
                                {CHART_DATA.map((item, i) => {
                                    const h = (item.value / 100) * chartHeight;
                                    const x = i * (barWidth + spacing);
                                    const isActive = activeIndex === i;

                                    return (
                                        <React.Fragment key={i}>
                                            <Rect
                                                x={x}
                                                y={chartHeight - h}
                                                width={barWidth}
                                                height={h}
                                                rx={8}
                                                fill={isActive ? "url(#barGrad)" : "rgba(255,255,255,0.1)"}
                                                onPress={() => setActiveIndex(i)}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </Svg>
                            
                            {/* Labels */}
                            <View className="flex-row justify-between mt-4">
                                {CHART_DATA.map((item, i) => (
                                    <IrisText 
                                        key={i} 
                                        style={{ 
                                            fontSize: 11, 
                                            color: activeIndex === i ? colors.primary : colors.onSurfaceVariant,
                                            width: barWidth,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {item.label}
                                    </IrisText>
                                ))}
                            </View>
                        </View>
                    </IrisCard>

                    {/* Insights */}
                    <IrisText style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 }}>Key Insights</IrisText>
                    <View style={{ gap: 16 }}>
                        <TouchableOpacity className="flex-row items-center bg-[#121214] p-4 rounded-2xl border border-white/5">
                            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-4">
                                <Zap size={18} color={colors.primary} />
                            </View>
                            <View className="flex-1">
                                <IrisText style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>Peak Usage Alert</IrisText>
                                <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant }}>Your usage peaked at 2 PM on Wednesday.</IrisText>
                            </View>
                            <ChevronRight size={16} color={colors.onSurfaceVariant} />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center bg-[#121214] p-4 rounded-2xl border border-white/5">
                            <View className="w-10 h-10 rounded-xl bg-secondary/10 items-center justify-center mr-4">
                                <TrendingUp size={18} color={colors.secondary} />
                            </View>
                            <View className="flex-1">
                                <IrisText style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>Efficiency Score</IrisText>
                                <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant }}>Your energy efficiency is in the top 10%.</IrisText>
                            </View>
                            <ChevronRight size={16} color={colors.onSurfaceVariant} />
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                {/* Using home as active tab for now since nav doesn't have analytics yet */}
                <AppBottomNav
                    role={navRole}
                    activeTab="home"
                />
            </View>
        </IrisScreen>
    );
}
