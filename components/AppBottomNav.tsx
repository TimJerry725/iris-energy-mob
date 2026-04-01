import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { IrisText } from "./IrisText";
import {
    LayoutGrid,
    Wallet,
    FileText,
    User,
    ShoppingCart,
} from "./AppIcons";
import { useTheme } from "../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type NavRole = "buyer" | "seller";
export type AppTabKey = "home" | "buy" | "wallet" | "orders" | "profile";

interface AppBottomNavProps {
    role: NavRole;
    activeTab: AppTabKey;
}

interface NavItem {
    key: AppTabKey;
    label: string;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    pathname: string;
}

export const APP_BOTTOM_NAV_CLEARANCE = 112;
const SCREEN_HORIZONTAL_PADDING = 16;
const SCREEN_VERTICAL_PADDING = 16;

const NAV_ITEMS: Record<NavRole, NavItem[]> = {
    buyer: [
        { key: "home",    label: "Dashboard", Icon: LayoutGrid,   pathname: "/chatbot/buyer-dashboard" },
        { key: "wallet",  label: "Wallet",    Icon: Wallet,        pathname: "/chatbot/wallet" },
        { key: "orders",  label: "Orders",    Icon: FileText,      pathname: "/chatbot/orders" },
        { key: "profile", label: "Profile",   Icon: User,          pathname: "/chatbot/profile" },
    ],
    seller: [
        { key: "home",    label: "Dashboard", Icon: LayoutGrid,    pathname: "/chatbot/seller-dashboard" },
        { key: "buy",     label: "Buy",       Icon: ShoppingCart,  pathname: "/chatbot/buyer-dashboard" },
        { key: "wallet",  label: "Wallet",    Icon: Wallet,        pathname: "/chatbot/wallet" },
        { key: "orders",  label: "Orders",    Icon: FileText,      pathname: "/chatbot/orders" },
        { key: "profile", label: "Profile",   Icon: User,          pathname: "/chatbot/profile" },
    ],
};

export const AppBottomNav: React.FC<AppBottomNavProps> = ({ role, activeTab }) => {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();
    const items = NAV_ITEMS[role];

    const isDark = theme === "dark";

    return (
        <View
            style={{
                position: "absolute",
                left: -(SCREEN_HORIZONTAL_PADDING + insets.left),
                right: -(SCREEN_HORIZONTAL_PADDING + insets.right),
                bottom: -(SCREEN_VERTICAL_PADDING + insets.bottom),
                zIndex: 40,
                backgroundColor: colors.surface,
                paddingTop: 10,
                paddingBottom: Math.max(insets.bottom, 12) + 8,
                paddingHorizontal: 8,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                shadowColor: "#000000",
                shadowOpacity: isDark ? 0.2 : 0.08,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: -3 },
                elevation: 10,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                {items.map((item) => {
                    const isActive = item.key === activeTab;
                    const { Icon } = item;

                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => router.replace({ pathname: item.pathname, params: { role } })}
                            activeOpacity={0.7}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                borderRadius: 16,
                                backgroundColor: isActive
                                    ? (isDark ? "rgba(0,230,115,0.12)" : "rgba(0,199,106,0.1)")
                                    : "transparent",
                                minWidth: 60,
                            }}
                        >
                            <Icon
                                size={20}
                                color={isActive ? colors.primary : colors.muted}
                            />
                            <IrisText
                                style={{
                                    fontSize: 10,
                                    fontWeight: isActive ? "700" : "500",
                                    color: isActive ? colors.primary : colors.muted,
                                    marginTop: 4,
                                    letterSpacing: 0.2,
                                }}
                            >
                                {item.label}
                            </IrisText>
                            {isActive && (
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: 2,
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: colors.primary,
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
