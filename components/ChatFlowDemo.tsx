import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { IrisText } from "../components/IrisText";
import { useTheme } from "../context/ThemeContext";
import { chatFlows, ChatFlow } from "../constants/chatMockData";
import { useTranslation } from "react-i18next";

/**
 * Demo component showing how to use the multilingual chat mock data
 * This can be integrated into the chatbot screen for testing or demo purposes
 */
export function ChatFlowDemo() {
    const { i18n } = useTranslation();
    const { colors } = useTheme();
    const [selectedFlow, setSelectedFlow] = useState<ChatFlow | null>(null);

    // Get flows for current language
    const currentLanguage = i18n.language || 'en';
    const availableFlows = chatFlows[currentLanguage] || chatFlows['en'];

    const loadFlow = (flow: ChatFlow) => {
        setSelectedFlow(flow);
        // This would integrate with your actual chatbot message state
        console.log(`Loading flow: ${flow.scenario}`);
        console.log(`Messages:`, flow.messages);
    };

    return (
        <View className="flex-1 p-6">
            <IrisText variant="h2" className="mb-4">
                Demo Chat Flows ({currentLanguage.toUpperCase()})
            </IrisText>

            <ScrollView showsVerticalScrollIndicator={false}>
                {availableFlows.map((flow) => (
                    <TouchableOpacity
                        key={flow.id}
                        onPress={() => loadFlow(flow)}
                        style={{
                            backgroundColor: selectedFlow?.id === flow.id ? colors.primary + '20' : colors.card,
                            borderColor: selectedFlow?.id === flow.id ? colors.primary : colors.muted + '20'
                        }}
                        className="p-4 rounded-2xl mb-4 border"
                    >
                        <IrisText variant="h3" className="mb-2">
                            {flow.scenario}
                        </IrisText>
                        <IrisText variant="muted" className="text-sm">
                            {flow.messages.length} messages • ID: {flow.id}
                        </IrisText>

                        {selectedFlow?.id === flow.id && (
                            <View className="mt-4 pt-4 border-t border-muted/20">
                                <IrisText variant="muted" className="text-xs mb-2">
                                    Preview:
                                </IrisText>
                                {flow.messages.slice(0, 2).map((msg, idx) => (
                                    <View key={idx} className="mb-2">
                                        <IrisText
                                            className="text-xs font-bold"
                                            style={{ color: msg.sender === 'user' ? '#00FF7F' : '#6366F1' }}
                                        >
                                            {msg.sender === 'user' ? '👤 User' : '🤖 Iris'}:
                                        </IrisText>
                                        <IrisText className="text-xs ml-4">
                                            {msg.text.substring(0, 100)}
                                            {msg.text.length > 100 ? '...' : ''}
                                        </IrisText>
                                    </View>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View className="mt-6 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <IrisText variant="h3" className="mb-2 text-primary">
                    💡 Integration Tip
                </IrisText>
                <IrisText variant="muted" className="text-xs">
                    Use these flows to populate your chatbot with realistic conversations.
                    Each flow includes complete user-assistant exchanges for different scenarios.
                </IrisText>
            </View>
        </View>
    );
}

/**
 * Helper function to simulate a chat flow in the chatbot
 * @param flowId - The ID of the flow to simulate
 * @param language - Language code (en, hi, ta, mr, bn, te)
 * @param setMessages - State setter for chatbot messages
 * @param delay - Delay between messages in ms (default: 1500)
 */
export async function simulateChatFlow(
    flowId: string,
    language: string,
    setMessages: React.Dispatch<React.SetStateAction<any[]>>,
    delay: number = 1500
) {
    const flows = chatFlows[language] || chatFlows['en'];
    const flow = flows.find(f => f.id === flowId);

    if (!flow) {
        console.error(`Flow ${flowId} not found for language ${language}`);
        return;
    }

    // Clear existing messages
    setMessages([]);

    // Add messages one by one with delay
    for (let i = 0; i < flow.messages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));

        const message = {
            id: Date.now().toString() + i,
            text: flow.messages[i].text,
            sender: flow.messages[i].sender,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, message]);
    }
}

/**
 * Loads a complete chat flow instantly into the chatbot
 */
export function loadChatFlow(
    flowId: string,
    language: string,
    setMessages: React.Dispatch<React.SetStateAction<any[]>>
) {
    const flows = chatFlows[language] || chatFlows['en'];
    const flow = flows.find(f => f.id === flowId);

    if (!flow) {
        console.error(`Flow ${flowId} not found for language ${language}`);
        return;
    }

    const messages = flow.messages.map((m, i) => ({
        id: (Date.now() + i).toString(),
        text: m.text,
        sender: m.sender,
        timestamp: Date.now(),
    }));

    setMessages(messages);
}
