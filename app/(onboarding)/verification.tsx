import React, { useEffect, useState, useRef } from "react";
import { View, Animated, TouchableOpacity, useWindowDimensions, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { useTheme } from "../../context/ThemeContext";
import { IrisLogo } from "../../components/IrisLogo";
import { ShieldCheck, Loader2, FileText, UploadCloud, CheckCircle2, X, ArrowLeft, Languages, ExternalLink, Zap, ChevronRight, Sparkles } from "lucide-react-native";
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

export default function VerificationScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type: string }>();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { height } = useWindowDimensions();

    const [showVCSheet, setShowVCSheet] = useState(false);
    const [showProviders, setShowProviders] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ElectricityProvider | null>(null);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

    const spinAnim = useRef(new Animated.Value(0)).current;
    const sheetAnim = useRef(new Animated.Value(height)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const [detectedRole, setDetectedRole] = useState<string | null>(null);

    const docMap: Record<string, string[]> = {
        buyer: ["Utility Customer VC", "Consumer VC"],
        seller: ["Utility Customer VC", "Seller VC"],
        prosumer: ["Utility Customer VC", "Consumer VC", "Seller VC"]
    };

    // When no type is provided, we show all possible VCs for discovery
    const allPossibleDocs = ["Utility Customer VC", "Consumer VC", "Seller VC"];
    const requiredDocs = type ? (docMap[type] || docMap.buyer) : allPossibleDocs;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const openVCSheet = (initialProviders: boolean = false) => {
        setShowVCSheet(true);
        setShowProviders(initialProviders);
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
        // Show providers section
        setShowProviders(true);
    };

    const handleProviderSelect = async (provider: ElectricityProvider) => {
        setSelectedProvider(provider);
        // Open provider website in in-app browser
        await WebBrowser.openBrowserAsync(provider.website, {
            toolbarColor: colors.background,
            controlsColor: colors.primary,
            showTitle: true,
        });
    };

    const handleUpload = (doc: string) => {
        if (!uploadedDocs.includes(doc)) {
            const newDocs = [...uploadedDocs, doc];
            setUploadedDocs(newDocs);

            // Detect role based on uploaded docs
            const hasConsumer = newDocs.includes("Consumer VC");
            const hasSeller = newDocs.includes("Seller VC");

            if (hasConsumer && hasSeller) setDetectedRole("prosumer");
            else if (hasSeller) setDetectedRole("seller");
            else if (hasConsumer) setDetectedRole("buyer");
        }
    };

    const handleContinue = () => {
        const finalRole = detectedRole || type || "buyer";
        closeVCSheet();
        setTimeout(() => {
            router.replace({
                pathname: "/chatbot",
                params: { role: finalRole }
            });
        }, 300);
    };

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const allUploaded = uploadedDocs.length === requiredDocs.length;

    const OptionButton = ({ title, subtitle, icon: Icon, onPress }: any) => (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: colors.card,
                borderColor: colors.muted + "20"
            }}
            className="p-5 rounded-[28px] border mb-4 flex-row items-center"
        >
            <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mr-4">
                <Icon size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
                <IrisText variant="h3" className="mb-0 text-base mr-2">{title}</IrisText>
                <IrisText variant="muted" className="text-xs">{subtitle}</IrisText>
            </View>
            <ChevronRight size={20} color={colors.primary} opacity={0.5} />
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
                    <IrisText variant="h1">Verify your identity</IrisText>
                    <IrisText variant="muted">Choose how you want to provide your Verifiable Credentials.</IrisText>
                </View>

                <View className="flex-1 space-y-4">
                    <OptionButton
                        title="I already have VCs"
                        subtitle="Upload your existing credentials from your wallet"
                        icon={FileText}
                        onPress={() => openVCSheet(false)}
                    />

                    <OptionButton
                        title="Get VCs from Provider"
                        subtitle="Apply for new credentials from electricity providers"
                        icon={Zap}
                        onPress={() => openVCSheet(true)}
                    />

                    {uploadedDocs.length > 0 && (
                        <View className="mt-8">
                            <IrisText variant="muted" className="mb-4 text-xs uppercase tracking-widest">Verification Status</IrisText>
                            <View className="flex-row items-center bg-gray-500/10 p-4 rounded-2xl mb-4">
                                <View className="w-2 h-2 rounded-full bg-green-500 mr-3" />
                                <IrisText className="text-sm">Phone Number Verified</IrisText>
                            </View>
                            <View className="flex-row items-center bg-gray-500/10 p-4 rounded-2xl mb-4">
                                <View className={`w-2 h-2 rounded-full ${allUploaded ? "bg-green-500" : "bg-yellow-500"} mr-3`} />
                                <IrisText className="text-sm">Credentials {uploadedDocs.length} of {requiredDocs.length} uploaded</IrisText>
                            </View>
                        </View>
                    )}
                </View>

                <View className="pb-10">
                    {detectedRole && (
                        <View
                            className="mb-6 p-4 rounded-2xl flex-row items-center justify-center border border-primary/20"
                            style={{ backgroundColor: colors.primary + "10" }}
                        >
                            <Sparkles size={20} color={colors.primary} className="mr-2" />
                            <IrisText className="font-bold text-primary">
                                DETECTED ROLE: {detectedRole.toUpperCase()}
                            </IrisText>
                        </View>
                    )}
                    <IrisButton
                        variant="primary"
                        size="lg"
                        label={allUploaded || detectedRole ? "Complete Setup" : "Continue"}
                        onPress={allUploaded || detectedRole ? handleContinue : () => openVCSheet(false)}
                        disabled={uploadedDocs.length === 0 && !detectedRole}
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
                                                            <CheckCircle2 size={24} color="#FFF" />
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
                                                                <Zap size={20} color={provider.color} />
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
