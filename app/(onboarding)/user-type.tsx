import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Animated, useWindowDimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { useTheme } from "../../context/ThemeContext";
import { IrisLogo } from "../../components/IrisLogo";
import { ShoppingCart, Zap, TrendingUp, CheckCircle2, ArrowLeft, Languages, FileText, UploadCloud, CheckCircle2 as CheckCircle, X, ExternalLink, Zap as ZapIcon } from "lucide-react-native";
import * as WebBrowser from 'expo-web-browser';

interface ElectricityProvider {
    id: string;
    name: string;
    fullForm: string;
    region: string;
    website: string;
    color: string;
}

const PROVIDERS: ElectricityProvider[] = [
    {
        id: "tpddl",
        name: "TPDDL",
        fullForm: "Tata Power Delhi Distribution Limited",
        region: "Delhi",
        website: "https://www.tatapower-ddl.com",
        color: "#0066CC"
    },
    {
        id: "pvvnl",
        name: "PVVNL",
        fullForm: "Paschimanchal Vidyut Vitran Nigam Limited",
        region: "Uttar Pradesh",
        website: "https://www.pvvnl.org",
        color: "#FF6B35"
    },
    {
        id: "brpl",
        name: "BRPL",
        fullForm: "BSES Rajdhani Power Limited",
        region: "Delhi",
        website: "https://www.bsesdelhi.com",
        color: "#00A86B"
    }
];

export default function UserTypeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { height } = useWindowDimensions();

    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [showVCSheet, setShowVCSheet] = useState(false);
    const [showProviders, setShowProviders] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ElectricityProvider | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

    const sheetAnim = useRef(new Animated.Value(height)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const types = [
        {
            id: "buyer",
            title: "Buyer",
            description: "I want to purchase clean energy for my home or business.",
            icon: ShoppingCart,
            color: "#3EBAF4"
        },
        {
            id: "seller",
            title: "Seller",
            description: "I have solar panels and want to sell excess energy.",
            icon: Zap,
            color: "#00E673"
        },
        {
            id: "prosumer",
            title: "Prosumer",
            description: "I want to both buy and sell energy dynamically.",
            icon: TrendingUp,
            color: "#6366F1"
        }
    ];

    const docMap: Record<string, string[]> = {
        buyer: ["Utility Customer VC", "Consumer VC"],
        seller: ["Utility Customer VC", "Seller VC"],
        prosumer: ["Utility Customer VC", "Buyer VC", "Seller VC"]
    };

    const requiredDocs = docMap[selectedType || "buyer"] || docMap.buyer;

    const openVCSheet = () => {
        if (!selectedType) return;

        setShowVCSheet(true);
        setShowProviders(false);
        Animated.parallel([
            Animated.spring(sheetAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                mass: 0.8,
                stiffness: 100,
            }),
            Animated.timing(overlayAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            })
        ]).start();
    };

    const closeVCSheet = () => {
        Animated.parallel([
            Animated.timing(sheetAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            setShowVCSheet(false);
            setShowProviders(false);
        });
    };

    const handleDontHaveVC = () => {
        setShowProviders(true);
    };

    const handleProviderSelect = async (provider: ElectricityProvider) => {
        setSelectedProvider(provider);
        await WebBrowser.openBrowserAsync(provider.website, {
            toolbarColor: colors.background,
            controlsColor: colors.primary,
            showTitle: true,
        });
    };

    const handleUpload = (doc: string) => {
        if (!uploadedDocs.includes(doc)) {
            setUploadedDocs([...uploadedDocs, doc]);
        }
    };

    const handleContinue = () => {
        closeVCSheet();
        setTimeout(() => {
            router.push({
                pathname: "/chatbot",
                params: { role: selectedType }
            });
        }, 300);
    };

    const allUploaded = uploadedDocs.length === requiredDocs.length;

    return (
        <>
            <IrisScreen>
                {/* Header with Back Button and Language Switcher */}
                <View className="flex-row items-center justify-between mb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-12 h-12 rounded-full bg-gray-500/10 items-center justify-center"
                    >
                        <ArrowLeft size={24} color={colors.foreground} />
                    </TouchableOpacity>

                    <IrisLogo width={120} height={40} />

                    <TouchableOpacity
                        onPress={() => router.push("/(onboarding)/language")}
                        className="w-12 h-12 rounded-full bg-gray-500/10 items-center justify-center"
                    >
                        <Languages size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View className="mb-10">
                    <IrisText variant="h1">{t("user_type_title", "Choose your role")}</IrisText>
                    <IrisText variant="muted">{t("user_type_subtitle", "Select how you want to participate in the energy market.")}</IrisText>
                </View>

                <View className="flex-1 space-y-4">
                    {types.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            onPress={() => setSelectedType(type.id)}
                            activeOpacity={0.7}
                            className="mb-4"
                        >
                            <View
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: selectedType === type.id ? type.color : colors.muted + "20",
                                    borderWidth: 2
                                }}
                                className="p-6 rounded-[32px] flex-row items-center"
                            >
                                <View
                                    style={{ backgroundColor: type.color + "20" }}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-5"
                                >
                                    <type.icon size={28} color={type.color} />
                                </View>
                                <View className="flex-1">
                                    <IrisText variant="h3" className="mb-1">{type.title}</IrisText>
                                    <IrisText variant="muted" className="text-sm leading-tight">{type.description}</IrisText>
                                </View>
                                {selectedType === type.id && (
                                    <View className="ml-2">
                                        <CheckCircle2 size={24} color={type.color} />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="pb-10">
                    <IrisButton
                        variant="primary"
                        size="lg"
                        label="Complete Setup"
                        onPress={openVCSheet}
                        disabled={!selectedType}
                    />
                </View>
            </IrisScreen>

            {showVCSheet && (
                <View className="absolute inset-0 z-50">
                    <Animated.View
                        className="absolute inset-0 bg-black/60"
                        style={{ opacity: overlayAnim }}
                    >
                        <TouchableOpacity className="flex-1" onPress={closeVCSheet} />
                    </Animated.View>

                    <Animated.View
                        style={{
                            transform: [{ translateY: sheetAnim }],
                            backgroundColor: colors.background,
                            paddingBottom: 40,
                            maxHeight: height * 0.85,
                        }}
                        className="absolute bottom-0 w-full rounded-t-[40px] px-8 pt-4 border-t border-gray-500/20"
                    >
                        <View className="w-12 h-1.5 bg-gray-500/30 rounded-full self-center mb-6" />

                        <View className="flex-row justify-between items-start mb-6">
                            <View className="flex-1">
                                <IrisText variant="h2">
                                    {showProviders ? "Choose Your Provider" : "Upload Credentials"}
                                </IrisText>
                                <IrisText variant="muted">
                                    {showProviders
                                        ? "Select your electricity provider to get started"
                                        : "Please provide your Verifiable Credentials (VCs)"}
                                </IrisText>
                            </View>
                            <TouchableOpacity
                                onPress={closeVCSheet}
                                className="w-10 h-10 rounded-full bg-gray-500/10 items-center justify-center -mt-2"
                            >
                                <X size={20} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                            {!showProviders ? (
                                <>
                                    {/* VC Upload Section */}
                                    <View className="mb-6">
                                        {requiredDocs.map((doc, idx) => {
                                            const isUploaded = uploadedDocs.includes(doc);
                                            return (
                                                <View
                                                    key={idx}
                                                    style={{ backgroundColor: isUploaded ? colors.primary + "10" : "transparent" }}
                                                    className={`flex-row items-center p-5 rounded-3xl border border-dashed mb-4 ${isUploaded ? "border-primary" : "border-gray-500/30"}`}
                                                >
                                                    <View className="w-12 h-12 bg-gray-500/10 rounded-2xl items-center justify-center mr-4">
                                                        <FileText size={24} color={isUploaded ? colors.primary : colors.muted} />
                                                    </View>
                                                    <View className="flex-1">
                                                        <IrisText variant="h3" className="mb-0 text-base">{doc}</IrisText>
                                                        <IrisText variant="muted" className="text-xs">Required for verification</IrisText>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => handleUpload(doc)}
                                                        disabled={isUploaded}
                                                        className={`p-3 rounded-2xl ${isUploaded ? "bg-primary" : "bg-gray-500/10"}`}
                                                    >
                                                        {isUploaded ? (
                                                            <CheckCircle size={24} color="#FFF" />
                                                        ) : (
                                                            <UploadCloud size={24} color={colors.primary} />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })}
                                    </View>

                                    {/* Don't have VCs Link */}
                                    <TouchableOpacity onPress={handleDontHaveVC} className="items-center mb-6">
                                        <IrisText className="text-primary underline text-base">
                                            Don't have VCs? Get them from your provider
                                        </IrisText>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    {/* Electricity Providers */}
                                    <View className="mb-6">
                                        <IrisText variant="muted" className="mb-4 text-sm">
                                            Select your electricity provider to obtain VCs
                                        </IrisText>
                                        {PROVIDERS.map((provider) => (
                                            <TouchableOpacity
                                                key={provider.id}
                                                onPress={() => handleProviderSelect(provider)}
                                                style={{
                                                    backgroundColor: selectedProvider?.id === provider.id ? colors.primary + "10" : colors.card,
                                                    borderColor: selectedProvider?.id === provider.id ? colors.primary : colors.muted + "20"
                                                }}
                                                className="p-5 rounded-3xl border mb-4"
                                            >
                                                <View className="flex-row items-center justify-between">
                                                    <View className="flex-1 mr-4">
                                                        <View className="flex-row items-center mb-2">
                                                            <View
                                                                className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                                                                style={{ backgroundColor: provider.color + "20" }}
                                                            >
                                                                <ZapIcon size={20} color={provider.color} />
                                                            </View>
                                                            <View className="flex-1">
                                                                <IrisText variant="h3" className="mb-0 text-base">{provider.name}</IrisText>
                                                                <IrisText variant="muted" className="text-xs">{provider.region}</IrisText>
                                                            </View>
                                                        </View>
                                                        <IrisText variant="muted" className="text-xs mt-1">
                                                            {provider.fullForm}
                                                        </IrisText>
                                                    </View>
                                                    <ExternalLink size={20} color={colors.primary} />
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Back to VCs Link */}
                                    <TouchableOpacity onPress={() => setShowProviders(false)} className="items-center mb-6">
                                        <IrisText className="text-primary underline text-base">
                                            ← Back to upload VCs
                                        </IrisText>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>

                        <IrisButton
                            variant="primary"
                            size="lg"
                            label={allUploaded ? "Complete Verification" : "Continue"}
                            onPress={handleContinue}
                        />
                    </Animated.View>
                </View>
            )}
        </>
    );
}
