import * as Speech from "expo-speech";
import i18n from "./i18n";

export const speak = (text: string) => {
    const language = i18n.language || "en";
    Speech.speak(text, {
        language: language,
        pitch: 1.0,
        rate: 0.9,
    });
};

export const stopSpeaking = () => {
    Speech.stop();
};
