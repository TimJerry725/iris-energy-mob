import React, { useEffect, useState, useRef } from "react";
import { View, TouchableOpacity, Modal, StyleSheet, Dimensions, Animated as RNAnimated } from "react-native";
import { X, Mic, AudioLines, Volume2, VolumeX, Pause, Play } from "lucide-react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    interpolate
} from "react-native-reanimated";
import { IrisText } from "./IrisText";
import { useTheme } from "../context/ThemeContext";
import { speak, stopSpeaking } from "../services/voice";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

interface VoiceConversationOverlayProps {
    visible: boolean;
    onClose: () => void;
    lastAssistantMessage?: string;
    onUserMessage: (text: string) => void;
}

export const VoiceConversationOverlay: React.FC<VoiceConversationOverlayProps> = ({
    visible,
    onClose,
    lastAssistantMessage,
    onUserMessage,
}) => {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
    const [transcript, setTranscript] = useState("");

    // Waveform animations
    const wave1 = useSharedValue(1);
    const wave2 = useSharedValue(1);
    const wave3 = useSharedValue(1);

    useEffect(() => {
        if (visible) {
            // Reset to clean state
            setIsListening(false);
            setIsSpeaking(false);
            setStatus("idle");
            setTranscript("");

            // Start process
            startIdleAnimation();
            if (lastAssistantMessage) {
                // If there's context, correct delay to allow modal to show first
                setTimeout(() => handleAssistantSpeech(lastAssistantMessage), 500);
            } else {
                setStatus("listening");
                setIsListening(true);
                startListeningAnimation();
            }
        } else {
            stopSpeaking();
            stopAnimations();
            setIsListening(false);
            setIsSpeaking(false);
            setStatus("idle");
        }
    }, [visible]);

    const startIdleAnimation = () => {
        wave1.value = withRepeat(withTiming(1.5, { duration: 1000 }), -1, true);
        wave2.value = withRepeat(withTiming(1.3, { duration: 1200 }), -1, true);
        wave3.value = withRepeat(withTiming(1.4, { duration: 800 }), -1, true);
    };

    const startListeningAnimation = () => {
        wave1.value = withRepeat(withTiming(2.5, { duration: 400 }), -1, true);
        wave2.value = withRepeat(withTiming(2.0, { duration: 500 }), -1, true);
        wave3.value = withRepeat(withTiming(2.2, { duration: 300 }), -1, true);
    };

    const stopAnimations = () => {
        wave1.value = withTiming(1);
        wave2.value = withTiming(1);
        wave3.value = withTiming(1);
    };

    const handleAssistantSpeech = (text: string) => {
        setStatus("speaking");
        setIsSpeaking(true);
        startListeningAnimation(); // Reuse for speaking
        speak(text);

        // Simulate end of speech (since expo-speech doesn't have reliable onDone in all environments)
        const estimatedDuration = text.length * 80; // Rough estimation
        setTimeout(() => {
            setIsSpeaking(false);
            setStatus("listening");
            setIsListening(true);
            startListeningAnimation();

            // Mock STT after 3 seconds of listening
            setTimeout(() => {
                if (visible && isListening) {
                    const mockUserText = "How much energy did I save today?";
                    setTranscript(mockUserText);
                    setStatus("processing");
                    setIsListening(false);
                    stopAnimations();

                    setTimeout(() => {
                        onUserMessage(mockUserText);
                        // The parent will pass the new assistant message back through props
                    }, 1000);
                }
            }, 3000);
        }, estimatedDuration);
    };

    const waveStyle1 = useAnimatedStyle(() => ({
        transform: [{ scale: wave1.value }],
        opacity: interpolate(wave1.value, [1, 2.5], [0.6, 0.2]),
    }));

    const waveStyle2 = useAnimatedStyle(() => ({
        transform: [{ scale: wave2.value }],
        opacity: interpolate(wave2.value, [1, 2.5], [0.5, 0.1]),
    }));

    const waveStyle3 = useAnimatedStyle(() => ({
        transform: [{ scale: wave3.value }],
        opacity: interpolate(wave3.value, [1, 2.5], [0.4, 0.05]),
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background + "FA" }]}>
                {/* Close Button */}
                <TouchableOpacity
                    onPress={onClose}
                    style={[styles.closeButton, { backgroundColor: colors.card }]}
                >
                    <X size={24} color={colors.foreground} />
                </TouchableOpacity>

                {/* Main Content */}
                <View className="items-center justify-center flex-1">
                    <View className="items-center mb-12">
                        <IrisText variant="h1" align="center" style={{ fontSize: 32 }}>
                            {status === "listening" ? t("listening", "Listening...") :
                                status === "speaking" ? t("speaking", "Assistant Speaking") :
                                    status === "processing" ? t("processing", "Thinking...") : t("iris_assistant", "Iris Assistant")}
                        </IrisText>
                        <IrisText variant="muted" align="center" className="mt-2">
                            {transcript || t("say_something", "I'm here to help with your energy needs")}
                        </IrisText>
                    </View>

                    {/* Animated Waveform */}
                    <View style={styles.waveformContainer}>
                        <Animated.View style={[styles.wave, waveStyle3, { backgroundColor: colors.primary }]} />
                        <Animated.View style={[styles.wave, waveStyle2, { backgroundColor: colors.primary }]} />
                        <Animated.View style={[styles.wave, waveStyle1, { backgroundColor: colors.primary }]} />
                        <View style={[styles.micIcon, { backgroundColor: colors.primary }]}>
                            {status === "speaking" ? (
                                <AudioLines size={40} color="white" />
                            ) : (
                                <Mic size={40} color="white" />
                            )}
                        </View>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.bottomControls} className="flex-row items-center space-x-10">
                        <TouchableOpacity
                            style={[styles.controlButton, { backgroundColor: colors.card }]}
                            onPress={() => {
                                if (isSpeaking) {
                                    stopSpeaking();
                                    setIsSpeaking(false);
                                    setStatus("idle");
                                }
                            }}
                        >
                            <VolumeX size={24} color={colors.foreground} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.mainActionButton, { backgroundColor: colors.primary }]}
                            onPress={() => {
                                if (status === "listening") {
                                    setIsListening(false);
                                    setStatus("idle");
                                    stopAnimations();
                                } else if (status === "idle") {
                                    setStatus("listening");
                                    setIsListening(true);
                                    startListeningAnimation();
                                } else if (status === "speaking") {
                                    stopSpeaking();
                                    setIsSpeaking(false);
                                    setStatus("listening");
                                    setIsListening(true);
                                }
                            }}
                        >
                            {status === "listening" ? (
                                <Pause size={32} color="white" />
                            ) : (
                                <Play size={32} color="white" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.controlButton, { backgroundColor: colors.card }]}
                            onPress={() => {
                                // Toggle volume or reset listening
                                if (status === "idle") {
                                    setStatus("listening");
                                    setIsListening(true);
                                    startListeningAnimation();
                                }
                            }}
                        >
                            <Volume2 size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    closeButton: {
        position: "absolute",
        top: 60,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    waveformContainer: {
        width: 250,
        height: 250,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 40,
    },
    wave: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    micIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    bottomControls: {
        position: "absolute",
        bottom: 80,
    },
    controlButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    mainActionButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    }
});
