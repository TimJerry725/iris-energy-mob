import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Animated, useWindowDimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { useTheme } from "../../context/ThemeContext";
import { IrisLogo } from "../../components/IrisLogo";
import { ShoppingCart, Zap, TrendingUp, CheckCircle2, ArrowLeft, Languages, FileText, UploadCloud, CheckCircle2 as CheckCircle, X, ExternalLink, Zap as ZapIcon, ShieldCheck, ChevronRight, Sparkles } from "lucide-react-native";
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
    const [sheetView, setSheetView] = useState<'initial' | 'already_have' | 'upload' | 'providers'>('initial');
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
        setSheetView('initial');
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
            setSheetView('initial');
        });
    };

    const handleDontHaveVC = () => {
        setSheetView('providers');
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
        // Use router.replace to prevent users from going back to verification screens
        // and ensure we transition smoothly to the chatbot
        setTimeout(() => {
            router.replace({
                pathname: "/chatbot",
                params: { role: selectedType || "prosumer" }
            });
        }, 300);
    };

    const allUploaded = uploadedDocs.length === requiredDocs.length;

    const OptionButton = ({ title, subtitle, icon: Icon, onPress, disabled = false, comingSoon = false }: any) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || comingSoon}
            style={{
                backgroundColor: colors.card,
                borderColor: colors.muted + "20"
            }}
            className={`p-5 rounded-[28px] border mb-4 flex-row items-center ${comingSoon ? 'opacity-60' : ''}`}
        >
            <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mr-4">
                <Icon size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
                <View className="flex-row items-center">
                    <IrisText variant="h3" className="mb-0 text-base mr-2">{title}</IrisText>
                    {comingSoon && (
                        <View className="bg-primary/20 px-2 py-0.5 rounded-full">
                            <IrisText className="text-[10px] text-primary font-bold">SOON</IrisText>
                        </View>
                    )}
                </View>
                <IrisText variant="muted" className="text-xs">{subtitle}</IrisText>
            </View>
            {!comingSoon && <ChevronRight size={20} color={colors.primary} opacity={0.5} />}
        </TouchableOpacity>
    );

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
                                    {sheetView === 'initial' ? "Verification" :
                                        sheetView === 'already_have' ? "Select Source" :
                                            sheetView === 'providers' ? "Choose Provider" : "Upload Credentials"}
                                </IrisText>
                                <IrisText variant="muted">
                                    {sheetView === 'initial' ? "How would you like to verify your status?" :
                                        sheetView === 'already_have' ? "Choose where your Credentials are stored" :
                                            sheetView === 'providers' ? "Select your electricity provider" : "Provide your Verifiable Credentials"}
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
                            {sheetView === 'initial' && (
                                <View className="pt-2">
                                    <OptionButton
                                        title="I already have the VC"
                                        subtitle="Use existing credentials from your wallet"
                                        icon={CheckCircle2}
                                        onPress={() => setSheetView('already_have')}
                                    />
                                    <OptionButton
                                        title="Apply for the VC"
                                        subtitle="Get credentials from your energy provider"
                                        icon={Sparkles}
                                        onPress={() => setSheetView('providers')}
                                    />
                                </View>
                            )}

                            {sheetView === 'already_have' && (
                                <View className="pt-2">
                                    <OptionButton
                                        title="UEI"
                                        subtitle="Unified Energy Interface"
                                        icon={ShieldCheck}
                                        comingSoon
                                    />
                                    <OptionButton
                                        title="Digilocker"
                                        subtitle="National Digital Locker System"
                                        icon={CheckCircle2}
                                        comingSoon
                                    />
                                    <OptionButton
                                        title="Upload"
                                        subtitle="Upload file from your local storage"
                                        icon={UploadCloud}
                                        onPress={() => setSheetView('upload')}
                                    />
                                    <TouchableOpacity onPress={() => setSheetView('initial')} className="items-center mt-4">
                                        <IrisText className="text-primary text-base">← Back</IrisText>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {sheetView === 'upload' && (
                                <>
                                    <View className="mb-6">
                                        {requiredDocs.map((doc, idx) => {
                                            const isUploaded = uploadedDocs.includes(doc);
                                            return (
                                                <View
                                                    key={idx}
                                                    style={{ backgroundColor: isUploaded ? colors.primary + "10" : "transparent" }}
                                                    className={`flex-row items-center p-5 rounded-3xl border border-dashed mb-4 ${isUploaded ? "border-primary" : "border-gray-500/30"}`}
                                                >
                                                    <View className="w-12 h-12 bg-gray-500/10 rounded-2xl items-center justify-center mr-4" style={{ borderRadius: 16 }}>
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
                                    <TouchableOpacity onPress={() => setSheetView('already_have')} className="items-center mb-6">
                                        <IrisText className="text-primary text-base">← Back</IrisText>
                                    </TouchableOpacity>
                                </>
                            )}

                            {sheetView === 'providers' && (
                                <>
                                    <View className="mb-6">
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
                                    <TouchableOpacity onPress={() => setSheetView('initial')} className="items-center mb-6">
                                        <IrisText className="text-primary text-base">← Back</IrisText>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>

                        <IrisButton
                            variant="primary"
                            size="lg"
                            label={allUploaded ? "Complete Verification" : "Continue"}
                            onPress={handleContinue}
                            disabled={sheetView === 'upload' && !allUploaded}
                        />
                    </Animated.View>
                </View>
            )}
        </>
    );
}
