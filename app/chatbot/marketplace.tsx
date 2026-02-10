import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Dimensions, Animated, FlatList, TextInput } from "react-native";
import { useRouter } from "expo-router";
import {
    Search,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    ArrowLeft,
    Filter,
    BarChart2,
    Activity,
    Zap,
    Wind,
    Sun,
    Layers
} from "lucide-react-native";
import Svg, { Line, Polyline, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisCard } from "../../components/IrisCard";
import { useTheme } from "../../context/ThemeContext";
import { MARKET_DATA, EnergyAsset } from "../../constants/marketData";

const { width } = Dimensions.get("window");



const MarketplaceScreen = () => {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Explore");

    const renderAssetItem = ({ item }: { item: EnergyAsset }) => {
        const isPositive = item.change >= 0;
        const Icon = item.type === "solar" ? Sun : item.type === "wind" ? Wind : item.type === "grid" ? Zap : Layers;

        return (
            <TouchableOpacity
                className="mb-4"
                onPress={() => router.push(`/chatbot/asset/${item.id}`)}
            >
                <IrisCard className="p-4 flex-row items-center justify-between border-transparent">
                    <View className="flex-row items-center flex-1">
                        <View
                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                            style={{ backgroundColor: colors.card }}
                        >
                            <Icon size={24} color={isPositive ? "#00E673" : "#FF3B30"} />
                        </View>
                        <View className="flex-1">
                            <IrisText variant="h3" style={{ fontSize: 16 }}>{item.symbol}</IrisText>
                            <IrisText variant="muted" style={{ fontSize: 12 }}>{item.name}</IrisText>
                        </View>
                    </View>

                    <View className="items-end">
                        <IrisText variant="h3" style={{ fontSize: 16 }}>₹{item.price.toFixed(2)}</IrisText>
                        <View className="flex-row items-center">
                            {isPositive ? (
                                <TrendingUp size={12} color="#00E673" className="mr-1" />
                            ) : (
                                <TrendingDown size={12} color="#FF3B30" className="mr-1" />
                            )}
                            <IrisText
                                style={{
                                    color: isPositive ? "#00E673" : "#FF3B30",
                                    fontSize: 12,
                                    fontWeight: "600"
                                }}
                            >
                                {isPositive ? "+" : ""}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                            </IrisText>
                        </View>
                    </View>
                </IrisCard>
            </TouchableOpacity>
        );
    };

    return (
        <IrisScreen scrollable={false}>
            <View className="flex-1">
                {/* Header */}
                <View className="py-4 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full" style={{ backgroundColor: colors.card }}>
                        <ArrowLeft size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <IrisText variant="h2" style={{ fontSize: 20 }}>Marketplace</IrisText>
                    <View className="w-10" />
                </View>

                {/* Search Bar */}
                <View className="mb-6 flex-row items-center bg-gray-500/10 rounded-2xl px-4 py-3">
                    <Search size={20} color={colors.muted} className="mr-3" />
                    <TextInput
                        placeholder="Search for providers, grids, or assets"
                        placeholderTextColor={colors.muted}
                        style={{ color: colors.foreground, flex: 1, fontSize: 16 }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Balance Card (Portfolio style) */}
                {/* Modern Tabs */}
                <View className="flex-row mb-6 bg-gray-500/10 p-1 rounded-2xl">
                    {["Explore", "Holdings", "Orders"].map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className="flex-1 py-3 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: isActive ? colors.card : "transparent",
                                    shadowColor: isActive ? "#000" : "transparent",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: isActive ? 0.1 : 0,
                                    shadowRadius: 4,
                                    elevation: isActive ? 2 : 0
                                }}
                            >
                                <IrisText
                                    style={{
                                        color: isActive ? colors.primary : colors.muted,
                                        fontWeight: isActive ? "700" : "500",
                                        fontSize: 16
                                    }}
                                >
                                    {tab}
                                </IrisText>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Market List */}
                <View className="flex-1">
                    <View className="mb-4">
                        <IrisText variant="h3">{activeTab === "Orders" ? "Recent Transactions" : "Market Indices"}</IrisText>
                    </View>

                    {activeTab === "Orders" ? (
                        <View className="flex-1 space-y-4">
                            {[
                                { id: 'o1', type: 'Buy', asset: 'SUN-RJ', amount: '250 kWh', price: '₹1,062', status: 'Completed', date: 'Today, 2:30 PM' },
                                { id: 'o2', type: 'Sell', asset: 'GVS-MH', amount: '120 kWh', price: '₹546', status: 'Completed', date: 'Yesterday' },
                                { id: 'o3', type: 'Buy', asset: 'WIND-TN', amount: '500 kWh', price: '₹1,900', status: 'Pending', date: '2 days ago' },
                            ].map((order) => (
                                <IrisCard key={order.id} className="p-4 mb-3 border-transparent" style={{ backgroundColor: colors.card }}>
                                    <View className="flex-row justify-between items-center">
                                        <View>
                                            <View className="flex-row items-center mb-1">
                                                <View className={`px-2 py-0.5 rounded-md mr-2 ${order.type === 'Buy' ? 'bg-[#00E673]/10' : 'bg-[#FF3B30]/10'}`}>
                                                    <IrisText style={{ color: order.type === 'Buy' ? '#00E673' : '#FF3B30', fontSize: 10, fontWeight: '700' }}>{order.type.toUpperCase()}</IrisText>
                                                </View>
                                                <IrisText className="font-semibold">{order.asset}</IrisText>
                                            </View>
                                            <IrisText variant="muted" style={{ fontSize: 12 }}>{order.date} • {order.amount}</IrisText>
                                        </View>
                                        <View className="items-end">
                                            <IrisText className="font-bold">{order.price}</IrisText>
                                            <IrisText style={{ fontSize: 10, color: order.status === 'Completed' ? '#00E673' : '#A855F7' }}>{order.status}</IrisText>
                                        </View>
                                    </View>
                                </IrisCard>
                            ))}
                        </View>
                    ) : activeTab === "Holdings" ? (
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            {/* Market Summary Graph */}
                            <IrisCard className="p-4 mb-8" style={{ backgroundColor: colors.card }}>
                                <View className="flex-row justify-between items-center mb-6">
                                    <View>
                                        <IrisText variant="h3" style={{ fontSize: 18 }}>Energy Volume</IrisText>
                                        <IrisText variant="muted" style={{ fontSize: 12 }}>Last 24 Hours (kWh)</IrisText>
                                    </View>
                                    <View className="flex-row space-x-4">
                                        <View className="flex-row items-center">
                                            <View className="w-2 h-2 rounded-full bg-[#00E673] mr-2" />
                                            <IrisText style={{ fontSize: 12, color: colors.muted }}>Sell</IrisText>
                                        </View>
                                        <View className="flex-row items-center">
                                            <View className="w-2 h-2 rounded-full bg-[#A855F7] mr-2" />
                                            <IrisText style={{ fontSize: 12, color: colors.muted }}>Buy</IrisText>
                                        </View>
                                    </View>
                                </View>

                                {/* Simple Custom SVG Graph */}
                                <View className="h-40 w-full items-center justify-center">
                                    <Svg height="160" width={width - 80}>
                                        <Defs>
                                            <LinearGradient id="gradSell" x1="0" y1="0" x2="0" y2="1">
                                                <Stop offset="0" stopColor="#00E673" stopOpacity="0.3" />
                                                <Stop offset="1" stopColor="#00E673" stopOpacity="0" />
                                            </LinearGradient>
                                            <LinearGradient id="gradBuy" x1="0" y1="0" x2="0" y2="1">
                                                <Stop offset="0" stopColor="#A855F7" stopOpacity="0.3" />
                                                <Stop offset="1" stopColor="#A855F7" stopOpacity="0" />
                                            </LinearGradient>
                                        </Defs>

                                        {/* Grid Lines */}
                                        <Line x1="0" y1="0" x2={width - 80} y2="0" stroke={colors.muted + "10"} strokeWidth="1" />
                                        <Line x1="0" y1="40" x2={width - 80} y2="40" stroke={colors.muted + "10"} strokeWidth="1" />
                                        <Line x1="0" y1="80" x2={width - 80} y2="80" stroke={colors.muted + "10"} strokeWidth="1" />
                                        <Line x1="0" y1="120" x2={width - 80} y2="120" stroke={colors.muted + "10"} strokeWidth="1" />

                                        {/* Fills */}
                                        <Polyline
                                            points={`0,160 0,100 ${(width - 80) * 0.16},80 ${(width - 80) * 0.33},120 ${(width - 80) * 0.5},40 ${(width - 80) * 0.66},60 ${(width - 80) * 0.83},20 ${(width - 80)},50 ${(width - 80)},160`}
                                            fill="url(#gradSell)"
                                        />
                                        <Polyline
                                            points={`0,160 0,140 ${(width - 80) * 0.16},130 ${(width - 80) * 0.33},90 ${(width - 80) * 0.5},110 ${(width - 80) * 0.66},30 ${(width - 80) * 0.83},80 ${(width - 80)},100 ${(width - 80)},160`}
                                            fill="url(#gradBuy)"
                                        />

                                        {/* Lines */}
                                        <Polyline
                                            points={`0,100 ${(width - 80) * 0.16},80 ${(width - 80) * 0.33},120 ${(width - 80) * 0.5},40 ${(width - 80) * 0.66},60 ${(width - 80) * 0.83},20 ${(width - 80)},50`}
                                            fill="none"
                                            stroke="#00E673"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                        <Polyline
                                            points={`0,140 ${(width - 80) * 0.16},130 ${(width - 80) * 0.33},90 ${(width - 80) * 0.5},110 ${(width - 80) * 0.66},30 ${(width - 80) * 0.83},80 ${(width - 80)},100`}
                                            fill="none"
                                            stroke="#A855F7"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </Svg>
                                </View>

                                {/* Chart Filters */}
                                <View className="flex-row items-center justify-between mt-6">
                                    <View className="flex-row bg-[#1e1e1e] rounded-full p-1 border border-gray-800">
                                        {["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "All"].map((filter, i) => (
                                            <TouchableOpacity
                                                key={filter}
                                                className={`px-3 py-1 rounded-full ${i === 0 ? "bg-[#333]" : ""}`}
                                            >
                                                <IrisText
                                                    style={{
                                                        fontSize: 12,
                                                        color: i === 0 ? "white" : colors.muted,
                                                        fontWeight: i === 0 ? "600" : "400"
                                                    }}
                                                >
                                                    {filter}
                                                </IrisText>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </IrisCard>
                            <View className="flex-row justify-between mb-4">
                                <IrisCard className="flex-1 p-4 mr-2" style={{ backgroundColor: colors.card }}>
                                    <IrisText variant="muted" className="mb-1 text-xs">Total Balance</IrisText>
                                    <IrisText variant="h2" style={{ color: "#00E673" }}>₹14,250</IrisText>
                                    <IrisText className="text-xs text-green-500">+12.5% this month</IrisText>
                                </IrisCard>
                                <IrisCard className="flex-1 p-4 ml-2" style={{ backgroundColor: colors.card }}>
                                    <IrisText variant="muted" className="mb-1 text-xs">Energy Used</IrisText>
                                    <IrisText variant="h2" style={{ color: "#A855F7" }}>450 kWh</IrisText>
                                    <IrisText className="text-xs text-purple-400">85% Clean Energy</IrisText>
                                </IrisCard>
                            </View>
                            <IrisCard className="p-4 mb-4" style={{ backgroundColor: colors.card }}>
                                <View className="flex-row items-center justify-between mb-2">
                                    <IrisText className="font-semibold">Total Savings</IrisText>
                                    <BarChart2 size={16} color={colors.primary} />
                                </View>
                                <IrisText variant="h1" className="mb-1">₹3,840</IrisText>
                                <IrisText variant="muted" className="text-xs">Saved by trading on Iris marketplace vs traditional grid</IrisText>
                            </IrisCard>
                            <IrisText variant="h3" className="mb-3 mt-2">Your Assets</IrisText>
                            {MARKET_DATA.slice(0, 3).map((item) => renderAssetItem({ item }))}
                        </ScrollView>
                    ) : (
                        <FlatList
                            data={MARKET_DATA}
                            renderItem={renderAssetItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}
                </View>

                {/* Buy/Sell Sticky Buttons */}
                <View className="flex-row justify-between py-6" style={{ gap: 12 }}>
                    <TouchableOpacity
                        className="flex-1 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: "#FF3B30" }}
                    >
                        <IrisText style={{ color: "white", fontWeight: "700", fontSize: 16 }}>SELL ENERGY</IrisText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: "#00E673" }}
                    >
                        <IrisText style={{ color: "#000", fontWeight: "700", fontSize: 16 }}>BUY ENERGY</IrisText>
                    </TouchableOpacity>
                </View>
            </View>
        </IrisScreen>
    );
};

export default MarketplaceScreen;
