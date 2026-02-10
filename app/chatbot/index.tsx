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
    TrendingUp,
    Send,
    Mic,
    AudioLines,
    ShoppingBag,
    TrendingDown,
    LayoutGrid
} from "lucide-react-native";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisLogo } from "../../components/IrisLogo";
import { useTheme } from "../../context/ThemeContext";
import { simulateChatFlow, loadChatFlow } from "../../components/ChatFlowDemo";

interface Message {
    id: string;
    text: string;
    sender: "user" | "assistant";
    timestamp: number;
    options?: { label: string; action: string }[];
}

const ChatbotScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const SIDEBAR_WIDTH = width * 0.8;
    const { role } = useLocalSearchParams<{ role: string }>();
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme, colors } = useTheme();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarOffset = useRef(new Animated.Value(-SIDEBAR_WIDTH - 20)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const shadowOpacity = useRef(new Animated.Value(0)).current;
    const togglePosition = useRef(new Animated.Value(theme === "dark" ? 1 : 0)).current;

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

        setTimeout(() => {
            let responseText = "I'm processing your energy request. How can I help you take the next step?";
            let responseOptions: { label: string; action: string }[] | undefined = undefined;

            const lowerText = messageText.toLowerCase();

            if (lowerText.includes("sell") || lowerText.includes("listing")) {
                responseText = "I see you want to sell energy. You can list your excess solar units on the peer-to-peer marketplace. What's your target price?";
                responseOptions = [
                    { label: "List Energy", action: "List 5kWh for sale" },
                    { label: "Market Prices", action: "Current market rates?" },
                    { label: "Check Savings", action: "My total savings" }
                ];
            } else if (lowerText.includes("buy") || lowerText.includes("price") || lowerText.includes("rate")) {
                responseText = "Current market rates are optimized for your location. You can buy clean energy from local prosumers starting at ₹6.5/unit. Interested?";
                responseOptions = [
                    { label: "Browse Units", action: "Show me available units" },
                    { label: "Set Alerts", action: "Set a price alert" },
                    { label: "Auto-Buy", action: "Enable Auto-Buy" }
                ];
            } else if (lowerText.includes("portfolio") || lowerText.includes("balance") || lowerText.includes("credit")) {
                responseText = "Your Iris Portfolio is performing well. You have 12.5 Carbon Credits and a balance of ₹1,240. Any specific action?";
                responseOptions = [
                    { label: "Sell Credits", action: "Redeem Carbon Credits" },
                    { label: "Wallet details", action: "Show full wallet" },
                    { label: "Top Up", action: "Add funds" }
                ];
            } else if (lowerText.includes("smart") || lowerText.includes("trade") || lowerText.includes("automated")) {
                responseText = "Smart Trading is Iris's AI optimization. It handles buying/selling based on your usage patterns. Shall we configure it?";
                responseOptions = [
                    { label: "Enable AI", action: "Start Smart Trading" },
                    { label: "Trading Logs", action: "Show trading history" },
                    { label: "Strategy", action: "Change strategy" }
                ];
            } else {
                responseText = "Welcome to Iris Energy. I'm your AI assistant for the P2P energy market. You can ask me to sell units, check prices, or view your carbon credits.";
                responseOptions = [
                    { label: "Buy Energy", action: "Buy Energy" },
                    { label: "Sell Energy", action: "Sell Energy" },
                    { label: "Smart Trade", action: "Smart Trade" }
                ];
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "assistant",
                timestamp: Date.now(),
                options: responseOptions
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }, 800);
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
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1, backgroundColor: colors.background }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <View className="flex-1">
                    {/* Header */}
                    <View className="py-2 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={toggleSidebar} className="mr-4">
                                <Menu size={24} color={colors.foreground} />
                            </TouchableOpacity>
                            <IrisLogo width={120} height={40} />
                        </View>
                        <TouchableOpacity onPress={() => router.push("/chatbot/settings")}>
                            <User size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Messages */}
                    <ScrollView
                        ref={scrollViewRef}
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        contentContainerStyle={messages.length === 0 ? { flexGrow: 1, justifyContent: "center" } : { paddingVertical: 20 }}
                    >
                        {messages.length === 0 ? (
                            <Animated.View style={{ opacity: fadeAnim }} className="items-center">
                                <IrisText variant="h2" align="center" className="text-2xl font-bold mb-8">How can I help you Today?</IrisText>
                                <View className="w-full flex-row flex-wrap justify-between">
                                    <QuickAction title="Buy Energy" icon={ArrowDown} color="#00E673" />
                                    <QuickAction title="Sell Energy" icon={ArrowUp} color="#00FF7F" />
                                    <QuickAction title="Smart Trade" icon={Sparkles} color="#A855F7" />
                                    <QuickAction title="Marketplace" icon={LayoutGrid} color="#6366F1" />
                                </View>
                            </Animated.View>
                        ) : (
                            messages.map((msg) => (
                                <View key={msg.id} className={`mb-4 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                                    <View
                                        style={{
                                            backgroundColor: msg.sender === "user" ? (theme === "dark" ? "#262626" : "#E5E7EB") : colors.card,
                                            padding: 16,
                                            borderRadius: 20,
                                            borderBottomRightRadius: msg.sender === "user" ? 4 : 20,
                                            borderTopLeftRadius: msg.sender === "assistant" ? 4 : 20,
                                            maxWidth: "80%"
                                        }}
                                    >
                                        <IrisText style={{ color: msg.sender === "user" ? "white" : colors.foreground }}>{msg.text}</IrisText>
                                        {msg.options && (
                                            <View className="mt-4 border-t border-gray-500/10 pt-4 space-y-2">
                                                {msg.options.map((opt, i) => (
                                                    <TouchableOpacity
                                                        key={i}
                                                        onPress={() => handleSend(opt.action)}
                                                        className="py-3 px-4 rounded-xl flex-row items-center justify-between"
                                                        style={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                                                    >
                                                        <IrisText style={{ color: colors.primary, fontWeight: "600" }}>{opt.label}</IrisText>
                                                        <ChevronRight size={14} color={colors.primary} />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <View className="py-4 flex-row items-center border-t border-gray-500/10">
                        <View className="flex-1 flex-row items-center bg-gray-500/10 rounded-full px-4 py-2">
                            <TextInput
                                className="flex-1 h-10 text-lg"
                                style={{ color: colors.foreground }}
                                placeholder="Ask anything..."
                                placeholderTextColor={colors.muted}
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={() => handleSend()}
                            />
                            <TouchableOpacity onPress={() => handleSend()} className="ml-2">
                                <Send size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity className="ml-4 w-12 h-12 rounded-full items-center justify-center bg-gray-500/10">
                            <AudioLines size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sidebar Overlay */}
                <Animated.View
                    pointerEvents={isSidebarOpen ? "auto" : "none"}
                    className="absolute inset-0 bg-black"
                    style={{ opacity: backdropOpacity, zIndex: 100 }}
                >
                    <TouchableOpacity className="flex-1" onPress={toggleSidebar} />
                </Animated.View>

                {/* Sidebar Menu */}
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: SIDEBAR_WIDTH,
                        backgroundColor: colors.background,
                        zIndex: 101,
                        transform: [{ translateX: sidebarOffset }],
                        shadowColor: "#000",
                        shadowOffset: { width: 4, height: 0 },
                        shadowOpacity: shadowOpacity,
                        shadowRadius: 12,
                        elevation: isSidebarOpen ? 16 : 0,
                    }}
                >
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

                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            onPress={() => { setMessages([]); toggleSidebar(); }}
                            className="flex-row items-center p-4 rounded-2xl mb-4"
                            style={{ backgroundColor: colors.card }}
                        >
                            <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-500/10 mr-3">
                                <MessageSquarePlus size={20} color={colors.primary} />
                            </View>
                            <IrisText className="font-semibold" style={{ color: colors.foreground }}>New Chat</IrisText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={toggleTheme}
                            className="flex-row items-center justify-between p-4 rounded-2xl mb-6"
                            style={{ backgroundColor: colors.card }}
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full items-center justify-center bg-gray-500/10 mr-3">
                                    {theme === "dark" ? (
                                        <Moon size={20} color={colors.primary} />
                                    ) : (
                                        <Sun size={20} color={colors.primary} />
                                    )}
                                </View>
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

                        <IrisText variant="muted" className="mb-4 text-xs uppercase tracking-widest">Core Services</IrisText>

                        <TouchableOpacity
                            onPress={() => { toggleSidebar(); router.push("/chatbot/marketplace" as any); }}
                            className="flex-row items-center p-4 rounded-2xl mb-3"
                            style={{ backgroundColor: colors.card }}
                        >
                            <View className="w-10 h-10 rounded-full items-center justify-center bg-[#A855F7]/10 mr-3">
                                <LayoutGrid size={20} color="#A855F7" />
                            </View>
                            <IrisText className="font-semibold">Energy Marketplace</IrisText>
                        </TouchableOpacity>

                        <View className="flex-row justify-between mb-6">
                            <TouchableOpacity
                                onPress={() => { toggleSidebar(); handleSend("Buy Energy"); }}
                                className="flex-1 flex-row items-center p-4 rounded-2xl mr-2"
                                style={{ backgroundColor: colors.card }}
                            >
                                <TrendingUp size={18} color="#00E673" className="mr-2" />
                                <IrisText className="font-semibold">Buy</IrisText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { toggleSidebar(); handleSend("Sell Energy"); }}
                                className="flex-1 flex-row items-center p-4 rounded-2xl ml-2"
                                style={{ backgroundColor: colors.card }}
                            >
                                <TrendingDown size={18} color="#FF3B30" className="mr-2" />
                                <IrisText className="font-semibold">Sell</IrisText>
                            </TouchableOpacity>
                        </View>

                        <IrisText variant="muted" className="mb-4 text-xs uppercase tracking-widest">Recent Chats</IrisText>

                        {[
                            { id: 1, title: "Selling Energy", date: "Today", scenario: "sell_solar_energy" },
                            { id: 2, title: "Buying Energy", date: "Yesterday", scenario: "buy_autorickshaw_charging" },
                            { id: 3, title: "Energy Delivery", date: "2 days ago", scenario: "delivery_reminders" },
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    toggleSidebar();
                                    loadChatFlow(item.scenario, i18n.language || 'en', setMessages);
                                }}
                                className="flex-row items-center p-3 rounded-2xl mb-3"
                                style={{ backgroundColor: colors.card }}
                            >
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                                    style={{ backgroundColor: colors.primary + "15" }}
                                >
                                    <History size={18} color={colors.primary} />
                                </View>
                                <View className="flex-1">
                                    <IrisText className="text-sm font-medium" numberOfLines={1}>{item.title}</IrisText>
                                    <IrisText variant="muted" className="text-xs">{item.date}</IrisText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

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
                            <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-gray-500/10">
                                <LogOut size={20} color={colors.muted} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </IrisScreen>
    );
};

export default ChatbotScreen;
