
import React from "react";
import { View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, TrendingUp, TrendingDown, Info, Calendar, MapPin, Zap } from "lucide-react-native";
import { IrisScreen } from "../../../components/IrisScreen";
import { IrisText } from "../../../components/IrisText";
import { IrisButton } from "../../../components/IrisButton";
import { IrisCard } from "../../../components/IrisCard";
import { useTheme } from "../../../context/ThemeContext";
import { MARKET_DATA } from "../../../constants/marketData";
import Svg, { Line, Polyline, Defs, LinearGradient, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function AssetDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors } = useTheme();

    const asset = MARKET_DATA.find((item) => item.id === id);

    if (!asset) {
        return (
            <IrisScreen>
                <View className="flex-1 items-center justify-center">
                    <IrisText variant="h2">Asset not found</IrisText>
                    <IrisButton label="Go Back" onPress={() => router.back()} className="mt-4" />
                </View>
            </IrisScreen>
        );
    }

    const isPositive = asset.change >= 0;
    const trendValues = asset.trend;
    const minVal = Math.min(...trendValues);
    const maxVal = Math.max(...trendValues);
    const range = maxVal - minVal || 1; // Prevent division by zero

    // Create points for graph
    const points = trendValues.map((val, index) => {
        const x = (index / (trendValues.length - 1)) * (width - 48);
        const y = 80 - ((val - minVal) / range) * 60; // Scale to fit height
        return `${x},${y}`;
    }).join(" ");

    return (
        <IrisScreen>
            <View className="flex-1">
                {/* Header */}
                <View className="mb-6 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: colors.card }}
                    >
                        <ArrowLeft size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <IrisText variant="h2" style={{ fontSize: 18 }}>Asset Details</IrisText>
                    <View className="w-10" />
                </View>

                {/* Main Price Card */}
                <View className="mb-8 items-center">
                    <View className="w-16 h-16 rounded-3xl items-center justify-center mb-4" style={{ backgroundColor: colors.card }}>
                        <IrisText variant="h1" style={{ fontSize: 24 }}>{asset.symbol.substring(0, 2)}</IrisText>
                    </View>
                    <IrisText variant="h2" className="mb-1">{asset.name}</IrisText>
                    <IrisText variant="muted" className="mb-4">{asset.symbol}</IrisText>

                    <IrisText variant="h1" style={{ fontSize: 40, lineHeight: 48 }}>₹{asset.price.toFixed(2)}</IrisText>
                    <View className="flex-row items-center mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: isPositive ? "#00E67320" : "#FF3B3020" }}>
                        {isPositive ? <TrendingUp size={16} color="#00E673" className="mr-1" /> : <TrendingDown size={16} color="#FF3B30" className="mr-1" />}
                        <IrisText style={{ color: isPositive ? "#00E673" : "#FF3B30", fontWeight: "600" }}>
                            {isPositive ? "+" : ""}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                        </IrisText>
                    </View>
                </View>

                {/* Graph */}
                <IrisCard className="p-4 mb-6" style={{ backgroundColor: colors.card }}>
                    <IrisText variant="h3" className="mb-4">Price Trend (7 Days)</IrisText>
                    <View className="h-24 justify-center items-center">
                        <Svg height="80" width={width - 48}>
                            <Defs>
                                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor={isPositive ? "#00E673" : "#FF3B30"} stopOpacity="0.4" />
                                    <Stop offset="1" stopColor={isPositive ? "#00E673" : "#FF3B30"} stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Polyline
                                points={`0,80 ${points} ${width - 48},80`}
                                fill="url(#grad)"
                            />
                            <Polyline
                                points={points}
                                fill="none"
                                stroke={isPositive ? "#00E673" : "#FF3B30"}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </View>
                </IrisCard>

                {/* Info Cards */}
                <View className="flex-row flex-wrap justify-between">
                    <IrisCard className="w-[48%] p-4 mb-4" style={{ backgroundColor: colors.card }}>
                        <View className="items-start mb-2">
                            <MapPin size={20} color={colors.primary} />
                        </View>
                        <IrisText variant="muted" className="text-xs mb-1">Location</IrisText>
                        <IrisText variant="h3" style={{ fontSize: 14 }}>{asset.location || "N/A"}</IrisText>
                    </IrisCard>
                    <IrisCard className="w-[48%] p-4 mb-4" style={{ backgroundColor: colors.card }}>
                        <View className="items-start mb-2">
                            <Zap size={20} color="#FFD700" />
                        </View>
                        <IrisText variant="muted" className="text-xs mb-1">Capacity</IrisText>
                        <IrisText variant="h3" style={{ fontSize: 14 }}>{asset.capacity || "Unknown"}</IrisText>
                    </IrisCard>
                </View>

                <IrisCard className="p-4 mb-8" style={{ backgroundColor: colors.card }}>
                    <View className="flex-row items-center mb-2">
                        <Info size={20} color={colors.muted} className="mr-2" />
                        <IrisText variant="h3">About</IrisText>
                    </View>
                    <IrisText style={{ lineHeight: 22, color: colors.muted }}>
                        {asset.description || "No description available for this asset."}
                    </IrisText>
                </IrisCard>
            </View>

            {/* Action Buttons */}
            <View className="pb-8 pt-4 flex-row gap-4">
                <View className="flex-1">
                    <IrisButton variant="outline" label="Sell" onPress={() => { }} style={{ borderColor: "#FF3B30" }} textStyle={{ color: "#FF3B30" }} />
                </View>
                <View className="flex-1">
                    <IrisButton variant="primary" label="Buy" onPress={() => { }} style={{ backgroundColor: "#00E673" }} textStyle={{ color: "#000" }} />
                </View>
            </View>
        </IrisScreen>
    );
}
