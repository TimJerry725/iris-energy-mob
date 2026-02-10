import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, Image, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import {
    Menu,
    User,
    Sparkles,
    ChevronRight,
    Plus,
    Mic,
    AudioLines,
    ArrowUp,
    ArrowDown,
    Wallet,
    HelpCircle,
    MessageSquarePlus,
    History,
    LogOut,
    X,
    Sun,
    Moon,
    TrendingUp
} from "lucide-react-native";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisLogo } from "../../components/IrisLogo";
import { useTheme } from "../../context/ThemeContext";

interface Message {
    id: string;
    text: string;
    sender: "user" | "assistant";
    timestamp: number;
}

export default function ChatbotScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const SIDEBAR_WIDTH = width * 0.8;
    const { role } = useLocalSearchParams<{ role: string }>();
    const { t } = useTranslation();
    const { theme, toggleTheme, colors } = useTheme();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Sidebar animation values
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Add extra buffer (20px) to ensure shadows are hidden
    const sidebarOffset = useRef(new Animated.Value(-(width * 0.8) - 20)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const shadowOpacity = useRef(new Animated.Value(0)).current;
    // Theme toggle animation
    const togglePosition = useRef(new Animated.Value(theme === "dark" ? 1 : 0)).current;

    // Animate toggle when theme changes
    useEffect(() => {
        Animated.spring(togglePosition, {
            toValue: theme === "dark" ? 1 : 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150,
        }).start();
    }, [theme]);

    const toggleSidebar = () => {
        const nextState = !isSidebarOpen;
        setIsSidebarOpen(nextState);

        Animated.parallel([
            Animated.spring(sidebarOffset, {
                toValue: nextState ? 0 : -SIDEBAR_WIDTH - 20,
                useNativeDriver: true,
                damping: 20,
                mass: 0.8,
                stiffness: 100,
                overshootClamping: false,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
            }),
            Animated.timing(backdropOpacity, {
                toValue: nextState ? 0.6 : 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(shadowOpacity, {
                toValue: nextState ? 0.3 : 0,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start();
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSend = (text: string = inputText) => {
        const messageText = text || inputText;
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: "user",
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        // Simulate AI response based on keywords
        setTimeout(() => {
            let responseText = t("generic_response", "I understand. I'm helping you with your request.");

            const lowerText = messageText.toLowerCase();
            if (lowerText.includes("sell")) {
                responseText = t("sell_flow_init", "Great! I can help you sell your excess solar energy. How many units (kWh) would you like to list?");
            } else if (lowerText.includes("buy")) {
                responseText = t("buy_flow_init", "I'm looking for the best price for you. There are 3 sellers nearby offering energy at ₹4.5/unit. Interested?");
            } else if (lowerText.includes("balance") || lowerText.includes("wallet")) {
                responseText = t("balance_check", "Your current balance is ₹1,240. You have 45 units available for trade today.");
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "assistant",
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }, 1000);
    };

    const QuickAction = ({ title, icon: Icon, color }: { title: string; icon: any; color: string }) => (
        <TouchableOpacity
            onPress={() => handleSend(title)}
            style={{ backgroundColor: colors.card, borderColor: colors.muted + "20" }}
            className="border rounded-2xl p-4 items-center justify-center w-[48%] mb-4"
        >
            <Icon size={24} color={color} className="mb-2" />
            <IrisText variant="h3" align="center" style={{ color: colors.foreground }} className="text-sm">{title}</IrisText>
        </TouchableOpacity>
    );

    return (
        <IrisScreen scrollable={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ backgroundColor: colors.background }}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                {/* GPT Style Header */}
                <View className="py-2 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={toggleSidebar} className="mr-4">
                            <Menu size={24} color={colors.foreground} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center">
                            <IrisLogo width={120} height={40} />
                            <ChevronRight size={16} color={colors.muted} />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.push("/chatbot/settings")}>
                            <User size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 pt-4"
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    contentContainerStyle={messages.length === 0 ? { flexGrow: 1, justifyContent: "center" } : {}}
                >
                    {messages.length === 0 ? (
                        <Animated.View style={{ opacity: fadeAnim }} className="items-center px-6">
                            <View className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-primary/20 bg-primary/10 items-center justify-center">
                                <Image
                                    source={require("../../assets/iris_avatar.png")}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            <TouchableOpacity onPress={() => handleSend("Tell me about energy trading")} className="flex-row items-center mb-2">
                                <IrisText variant="h2" align="center" className="text-2xl font-bold mb-0 mr-2">Trade smarter with Iris Energy</IrisText>
                                <ChevronRight size={20} color={colors.muted} />
                            </TouchableOpacity>
                            <IrisText variant="muted" align="center" className="text-lg text-gray-500 mb-12">
                                Ask about unit prices, sell your energy, or check your savings in seconds.
                            </IrisText>

                            <View className="w-full">
                                <IrisText variant="muted" className="mb-4 text-xs uppercase tracking-widest">
                                    {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Actions` : "Quick Actions"}
                                </IrisText>
                                <View className="flex-row flex-wrap justify-between">
                                    {(!role || role === "prosumer") && (
                                        <>
                                            <QuickAction title={t("smart_trade", "Smart Trade")} icon={Sparkles} color="#A855F7" />
                                            <QuickAction title={t("buy_energy", "Buy Energy")} icon={ArrowDown} color="#00E673" />
                                            <QuickAction title={t("sell_energy", "Sell Energy")} icon={ArrowUp} color="#00FF7F" />
                                            <QuickAction title={t("portfolio", "Portfolio")} icon={Wallet} color="#6366F1" />
                                        </>
                                    )}
                                    {role === "buyer" && (
                                        <>
                                            <QuickAction title={t("buy_energy", "Buy Energy")} icon={ArrowDown} color="#00E673" />
                                            <QuickAction title={t("my_balance", "My Balance")} icon={Wallet} color="#6366F1" />
                                            <QuickAction title={t("market_trends", "Market Trends")} icon={TrendingUp} color="#3EBAF4" />
                                            <QuickAction title={t("get_help", "Get Help")} icon={HelpCircle} color="#FACC15" />
                                        </>
                                    )}
                                    {role === "seller" && (
                                        <>
                                            <QuickAction title={t("sell_energy", "Sell Energy")} icon={ArrowUp} color="#00FF7F" />
                                            <QuickAction title={t("earnings", "Earnings")} icon={Wallet} color="#6366F1" />
                                            <QuickAction title={t("grid_demand", "Grid Demand")} icon={TrendingUp} color="#3EBAF4" />
                                            <QuickAction title={t("get_help", "Get Help")} icon={HelpCircle} color="#FACC15" />
                                        </>
                                    )}
                                </View>
                            </View>
                        </Animated.View>
                    ) : (
                        messages.map((msg) => (
                            <View
                                key={msg.id}
                                className={`mb-6 flex-row ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <View
                                    style={{
                                        backgroundColor: msg.sender === "user" ? (theme === "dark" ? "#262626" : "#E2E8F0") : "transparent",
                                        maxWidth: "85%",
                                        borderRadius: 20,
                                        padding: 16,
                                    }}
                                >
                                    <IrisText
                                        style={{ color: colors.foreground }}
                                        className={msg.sender === "assistant" ? "text-xl leading-relaxed" : "text-lg"}
                                    >
                                        {msg.text}
                                    </IrisText>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* GPT Style Input Bar */}
                <View style={{ backgroundColor: colors.background }} className="pb-6 pt-2 flex-row items-center space-x-5">
                    <View
                        style={{ backgroundColor: colors.card, borderColor: colors.muted + "20" }}
                        className="flex-1 flex-row items-center rounded-full px-5 py-3 border"
                    >
                        <TextInput
                            style={{ color: colors.foreground }}
                            className="flex-1 text-lg font-medium font-medium"
                            placeholder={t("ask_anything", "Ask anything")}
                            placeholderTextColor={colors.muted}
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={() => handleSend()}
                        />
                        <TouchableOpacity className="ml-2">
                            <Mic size={20} color={colors.muted} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{ backgroundColor: colors.foreground }}
                        className="w-12 h-12 rounded-full items-center justify-center"
                        onPress={() => handleSend()}
                    >
                        <AudioLines size={24} color={colors.background} />
                    </TouchableOpacity>
                </View>

                {/* Sidebar Overlay - Always rendered for proper touch handling */}
                <Animated.View
                    pointerEvents={isSidebarOpen ? "auto" : "none"}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "black",
                        opacity: backdropOpacity,
                        zIndex: 90
                    }}
                >
                    <TouchableOpacity className="flex-1" onPress={toggleSidebar} activeOpacity={1} />
                </Animated.View>

                {/* Sidebar Content */}
                <Animated.View
                    pointerEvents={isSidebarOpen ? "auto" : "none"}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: SIDEBAR_WIDTH,
                        backgroundColor: colors.background,
                        zIndex: 100,
                        transform: [{ translateX: sidebarOffset }],
                        shadowColor: "#000",
                        shadowOffset: { width: 4, height: 0 },
                        shadowOpacity: shadowOpacity,
                        shadowRadius: 12,
                        elevation: isSidebarOpen ? 16 : 0,
                    }}
                >
                    {/* Header */}
                    <View
                        className="px-6 flex-row items-center justify-between mb-6"
                        style={{ paddingTop: Platform.OS === "ios" ? 60 : 40 }}
                    >
                        <IrisLogo width={120} height={40} />
                        <TouchableOpacity
                            onPress={toggleSidebar}
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.card }}
                        >
                            <X size={20} color={colors.muted} />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            onPress={() => { setMessages([]); toggleSidebar(); }}
                            className="flex-row items-center p-4 rounded-2xl mb-4"
                            style={{ backgroundColor: colors.primary + "15" }}
                        >
                            <MessageSquarePlus size={20} color={colors.primary} className="mr-3" />
                            <IrisText className="font-semibold text-primary">New Chat</IrisText>
                        </TouchableOpacity>

                        {/* Theme Switcher */}
                        <TouchableOpacity
                            onPress={toggleTheme}
                            className="flex-row items-center justify-between p-4 rounded-2xl mb-6"
                            style={{ backgroundColor: colors.card }}
                        >
                            <View className="flex-row items-center">
                                {theme === "dark" ? (
                                    <Moon size={20} color={colors.primary} className="mr-3" />
                                ) : (
                                    <Sun size={20} color={colors.primary} className="mr-3" />
                                )}
                                <IrisText className="font-semibold">
                                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                                </IrisText>
                            </View>
                            <View className="flex-row items-center space-x-2">
                                <View
                                    className="w-12 h-6 rounded-full p-1"
                                    style={{ backgroundColor: theme === "dark" ? colors.primary : colors.muted + "40" }}
                                >
                                    <Animated.View
                                        className="w-4 h-4 rounded-full bg-white shadow-lg"
                                        style={{
                                            transform: [{
                                                translateX: togglePosition.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 24]
                                                })
                                            }],
                                        }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>

                        <IrisText variant="muted" className="mb-4 text-xs uppercase tracking-widest">Recent Trades</IrisText>

                        {[
                            { id: 1, title: "Sold 10 kWh to Block A", date: "Today" },
                            { id: 2, title: "Bought 5 kWh from SolarPark", date: "Yesterday" },
                            { id: 3, title: "Balance Top-up ₹500", date: "2 days ago" },
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                className="flex-row items-center p-3 rounded-2xl mb-3"
                                style={{ backgroundColor: colors.card }}
                            >
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                                    style={{ backgroundColor: colors.primary + "15" }}
                                >
                                    <History size={18} color={colors.primary} />
                                </View>
                                <View>
                                    <IrisText className="text-sm font-medium">{item.title}</IrisText>
                                    <IrisText variant="muted" className="text-xs">{item.date}</IrisText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Profile Footer */}
                    <View className="px-6 py-6 border-t" style={{ borderColor: colors.muted + "10" }}>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View
                                    className="w-12 h-12 rounded-full overflow-hidden mr-4"
                                    style={{ backgroundColor: colors.primary + "10", borderWidth: 2, borderColor: colors.primary + "40" }}
                                >
                                    <Image
                                        source={require("../../assets/iris_avatar.png")}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                <View>
                                    <IrisText className="font-bold">Rahul Sharma</IrisText>
                                    <IrisText variant="muted" className="text-xs">Platinum Trader</IrisText>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <LogOut size={20} color={colors.muted} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </IrisScreen>
    );
}
