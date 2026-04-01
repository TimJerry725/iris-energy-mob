import React, { useRef, useState } from "react";
import { View, Animated, TouchableOpacity, useWindowDimensions, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { IrisScreen } from "../../components/IrisScreen";
import { IrisText } from "../../components/IrisText";
import { IrisButton } from "../../components/IrisButton";
import { useTheme } from "../../context/ThemeContext";
import { FileText, UploadCloud, CheckCircle2, X, ExternalLink, Zap, ChevronRight, Sparkles } from "../../components/AppIcons";
import * as WebBrowser from "expo-web-browser";

type LoginRole = "buyer" | "seller";
type DetectedRole = LoginRole | "prosumer" | null;

interface ElectricityProvider {
    id: string;
    name: string;
    fullForm: string;
    region: string;
    website: string;
    color: string;
}

interface UploadedVC {
    id: string;
    name: string;
    uri: string;
    matchedDocs: string[];
    availableRoles: LoginRole[];
    detectedRole: DetectedRole;
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

const buildDummyVC = (type?: string): UploadedVC => {
    const dummyByType: Record<string, UploadedVC> = {
        buyer: {
            id: "dummy-buyer-vc",
            name: "iris-buyer-vc.json",
            uri: "mock://iris-buyer-vc.json",
            matchedDocs: ["Utility Customer VC", "Consumer VC"],
            availableRoles: ["buyer"],
            detectedRole: "buyer",
        },
        seller: {
            id: "dummy-seller-vc",
            name: "iris-seller-vc.json",
            uri: "mock://iris-seller-vc.json",
            matchedDocs: ["Utility Customer VC", "Seller VC"],
            availableRoles: ["seller"],
            detectedRole: "seller",
        },
        prosumer: {
            id: "dummy-prosumer-vc",
            name: "iris-prosumer-vc.json",
            uri: "mock://iris-prosumer-vc.json",
            matchedDocs: ["Utility Customer VC", "Consumer VC", "Seller VC"],
            availableRoles: ["buyer", "seller"],
            detectedRole: "prosumer",
        }
    };

    return dummyByType[type || "prosumer"] || dummyByType.prosumer;
};

const getDetectedRoleLabel = (role: DetectedRole) => {
    if (role === "prosumer") return "Buyer + Seller access detected";
    if (role === "seller") return "Seller access detected";
    if (role === "buyer") return "Buyer access detected";
    return "VC uploaded";
};

export default function VerificationScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type?: string }>();
    const { colors } = useTheme();
    const { height } = useWindowDimensions();

    const [showVCSheet, setShowVCSheet] = useState(false);
    const [showProviders, setShowProviders] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ElectricityProvider | null>(null);
    const [uploadedVC, setUploadedVC] = useState<UploadedVC | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadState, setUploadState] = useState<"idle" | "loading" | "verified">("idle");

    const sheetAnim = useRef(new Animated.Value(height)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const openVCSheet = (initialProviders: boolean = false) => {
        setShowVCSheet(true);
        setShowProviders(initialProviders);
        setUploadError(null);
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

    const handleProviderSelect = async (provider: ElectricityProvider) => {
        setSelectedProvider(provider);
        await WebBrowser.openBrowserAsync(provider.website, {
            toolbarColor: colors.background,
            controlsColor: colors.primary,
            showTitle: true,
        });
    };

    const handleUploadFromDevice = async () => {
        setUploadError(null);
        setShowProviders(false);
        setUploadState("loading");

        const dummyVC = buildDummyVC(type);

        setTimeout(() => {
            setUploadedVC(dummyVC);
            setUploadState("verified");

            setTimeout(() => {
                closeVCSheet();
                setTimeout(() => {
                    router.push({
                        pathname: "/(onboarding)/vc-access",
                        params: {
                            vcName: dummyVC.name,
                            detectedRole: dummyVC.detectedRole || "prosumer",
                            availableRoles: dummyVC.availableRoles.join(","),
                        }
                    });
                }, 320);
            }, 700);
        }, 1200);
    };

    const OptionButton = ({ title, subtitle, icon: Icon, onPress }: any) => (
        <TouchableOpacity
            onPress={onPress}
            style={{ backgroundColor: colors.card }}
            className="p-4 rounded-xl flex-row items-center"
        >
            <View
                className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + "15" }}
            >
                <Icon size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
                <IrisText variant="h3" className="mb-0 mr-2">{title}</IrisText>
                <IrisText variant="muted">{subtitle}</IrisText>
            </View>
            <ChevronRight size={18} color={colors.primary} opacity={0.4} />
        </TouchableOpacity>
    );

    return (
        <>
            <IrisScreen topInset={false}>
                <View className="mb-6">
                    <IrisText variant="h1">Verify your identity</IrisText>
                    <IrisText variant="muted">Choose how you want to provide your Verifiable Credentials.</IrisText>
                </View>

                <View style={{ gap: 16 }}>
                    <OptionButton
                        title="I already have VCs"
                        subtitle="Open upload options and import a VC from this device"
                        icon={FileText}
                        onPress={() => openVCSheet(false)}
                    />

                    <OptionButton
                        title="Get VCs from Provider"
                        subtitle="Apply for new credentials from electricity providers"
                        icon={Zap}
                        onPress={() => openVCSheet(true)}
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
                            paddingBottom: 24,
                            maxHeight: height * 0.85,
                        }}
                        className="absolute bottom-0 w-full rounded-t-2xl px-4 pt-3"
                    >
                        <View className="w-10 h-1 bg-gray-500/30 rounded-full self-center mb-4" />

                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1">
                                <IrisText variant="h2">
                                    {showProviders ? "Choose Your Provider" : "Upload Credentials"}
                                </IrisText>
                                <IrisText variant="muted">
                                    {showProviders
                                        ? "Select your electricity provider to obtain new VCs."
                                        : "Upload a VC from this device and Iris will detect buyer or seller access."}
                                </IrisText>
                            </View>
                            <TouchableOpacity
                                onPress={closeVCSheet}
                                className="w-8 h-8 rounded-full bg-gray-500/10 items-center justify-center"
                            >
                                <X size={16} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {!showProviders ? (
                                <>
                                    <OptionButton
                                        title="Upload from Device"
                                        subtitle="Use a dummy VC upload and continue to the next step"
                                        icon={UploadCloud}
                                        onPress={handleUploadFromDevice}
                                    />

                                    {uploadState === "loading" && (
                                        <View
                                            className="mb-3 p-3 rounded-xl flex-row items-center"
                                            style={{ backgroundColor: colors.card }}
                                        >
                                            <ActivityIndicator size="small" color={colors.primary} />
                                            <IrisText className="ml-3">Loading dummy VC and verifying access...</IrisText>
                                        </View>
                                    )}

                                    {uploadState === "verified" && uploadedVC && (
                                        <View
                                            className="mb-3 p-3 rounded-xl flex-row items-center"
                                            style={{ backgroundColor: colors.primary + "10" }}
                                        >
                                            <CheckCircle2 size={22} color={colors.primary} />
                                            <IrisText className="ml-3 font-semibold" style={{ color: colors.primary }}>
                                                VC verified. Moving to the next page...
                                            </IrisText>
                                        </View>
                                    )}

                                    {uploadError && (
                                        <View
                                            className="mb-3 p-3 rounded-xl"
                                            style={{ backgroundColor: "#FEE2E2" }}
                                        >
                                            <IrisText style={{ color: "#991B1B" }}>{uploadError}</IrisText>
                                        </View>
                                    )}

                                    {uploadedVC && (
                                        <>
                                            <View className="mb-4">
                                                <IrisText variant="muted" className="mb-4 text-xs uppercase tracking-widest">Uploaded VC</IrisText>
                                                <View
                                                    className="flex-row items-center p-4 rounded-xl"
                                                    style={{ backgroundColor: colors.card }}
                                                >
                                                    <View className="w-10 h-10 bg-gray-500/10 rounded-lg items-center justify-center mr-3">
                                                        <FileText size={20} color={colors.primary} />
                                                    </View>
                                                    <View className="flex-1">
                                                        <IrisText variant="h3" className="mb-0">{uploadedVC.name}</IrisText>
                                                        <IrisText variant="muted" className="text-xs">
                                                            {uploadedVC.matchedDocs.length > 0
                                                                ? uploadedVC.matchedDocs.join(" • ")
                                                                : "Credential imported successfully"}
                                                        </IrisText>
                                                    </View>
                                                    <CheckCircle2 size={20} color={colors.primary} />
                                                </View>
                                            </View>

                                            <View
                                                className="mb-3 p-3 rounded-xl flex-row items-center"
                                                style={{ backgroundColor: colors.primary + "10" }}
                                            >
                                                <Sparkles size={20} color={colors.primary} />
                                                <IrisText className="ml-3 font-bold" style={{ color: colors.primary }}>
                                                    {getDetectedRoleLabel(uploadedVC.detectedRole)}
                                                </IrisText>
                                            </View>

                                            <IrisText variant="muted" className="mb-6 text-sm">
                                                Iris has loaded this dummy VC successfully. You will be taken to the next step automatically.
                                            </IrisText>
                                        </>
                                    )}

                                    <TouchableOpacity onPress={() => setShowProviders(true)} className="items-center pb-4">
                                        <IrisText style={{ color: colors.primary, fontSize: 16, textDecorationLine: "underline" }}>
                                            Don't have VCs? Get them from your provider
                                        </IrisText>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View className="mb-4">
                                        <IrisText variant="muted" className="mb-3 text-sm">
                                            Select your electricity provider to obtain VCs
                                        </IrisText>

                                        {PROVIDERS.map((provider) => (
                                            <TouchableOpacity
                                                key={provider.id}
                                                onPress={() => handleProviderSelect(provider)}
                                                style={{
                                                    backgroundColor: selectedProvider?.id === provider.id ? colors.primary + "10" : colors.card,
                                                }}
                                                className="p-4 rounded-xl mb-2"
                                            >
                                                <View className="flex-row items-center justify-between">
                                                    <View className="flex-1 mr-4">
                                                        <View className="flex-row items-center mb-2">
                                                            <View
                                                                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                                                                style={{ backgroundColor: provider.color + "20" }}
                                                            >
                                                                <Zap size={20} color={provider.color} />
                                                            </View>
                                                            <View className="flex-1">
                                                                <IrisText variant="h3" className="mb-0">{provider.name}</IrisText>
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

                                    <TouchableOpacity onPress={() => setShowProviders(false)} className="items-center pb-4">
                                        <IrisText style={{ color: colors.primary, fontSize: 16, textDecorationLine: "underline" }}>
                                            ← Back to VC upload
                                        </IrisText>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </Animated.View>
                </View>
            )}
        </>
    );
}
