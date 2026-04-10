import React from "react";
import { StyleProp, TextStyle } from "react-native";
import {
    Activity as LucideActivity,
    ArrowDown as LucideArrowDown,
    ArrowLeft as LucideArrowLeft,
    ArrowUp as LucideArrowUp,
    AudioLines as LucideAudioLines,
    BarChart2 as LucideBarChart2,
    Battery as LucideBattery,
    Building2 as LucideBuilding2,
    Calendar as LucideCalendar,
    Check as LucideCheck,
    CheckCircle2 as LucideCheckCircle2,
    ChevronDown as LucideChevronDown,
    ChevronRight as LucideChevronRight,
    Clock as LucideClock,
    ExternalLink as LucideExternalLink,
    FileText as LucideFileText,
    Filter as LucideFilter,
    HelpCircle as LucideHelpCircle,
    History as LucideHistory,
    Info as LucideInfo,
    Languages as LucideLanguages,
    LayoutGrid as LucideLayoutGrid,
    Layers as LucideLayers,
    Leaf as LucideLeaf,
    LogOut as LucideLogOut,
    MapPin as LucideMapPin,
    Menu as LucideMenu,
    MessageSquarePlus as LucideMessageSquarePlus,
    Mic as LucideMic,
    Moon as LucideMoon,
    Pause as LucidePause,
    Play as LucidePlay,
    Search as LucideSearch,
    Send as LucideSend,
    ShieldCheck as LucideShieldCheck,
    ShoppingBag as LucideShoppingBag,
    ShoppingCart as LucideShoppingCart,
    Sliders as LucideSliders,
    Sparkles as LucideSparkles,
    Sun as LucideSun,
    Sunrise as LucideSunrise,
    Sunset as LucideSunset,
    TrendingDown as LucideTrendingDown,
    TrendingUp as LucideTrendingUp,
    UploadCloud as LucideUploadCloud,
    User as LucideUser,
    Volume2 as LucideVolume2,
    VolumeX as LucideVolumeX,
    Wallet as LucideWallet,
    Wind as LucideWind,
    X as LucideX,
    Zap as LucideZap,
    Bell as LucideBell,
    Droplet as LucideDroplet,
    Footprints as LucideFootprints,
    Plus as LucidePlus,
    Trash as LucideTrash
} from "lucide-react-native";

export type AppIconName = string;

export interface AppIconProps {
    name?: AppIconName;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
    className?: string;
    strokeWidth?: number;
    opacity?: number;
}

const createIcon = (IconComponent: any) => {
    return ({ size = 24, color = "#000000", strokeWidth = 2, ...props }: AppIconProps) => (
        <IconComponent size={size} color={color} strokeWidth={strokeWidth} {...props} />
    );
};

export const Activity = createIcon(LucideActivity);
export const ArrowDown = createIcon(LucideArrowDown);
export const ArrowLeft = createIcon(LucideArrowLeft);
export const ArrowUp = createIcon(LucideArrowUp);
export const AudioLines = createIcon(LucideAudioLines);
export const BarChart2 = createIcon(LucideBarChart2);
export const Battery = createIcon(LucideBattery);
export const Building2 = createIcon(LucideBuilding2);
export const Calendar = createIcon(LucideCalendar);
export const Check = createIcon(LucideCheck);
export const CheckCircle2 = createIcon(LucideCheckCircle2);
export const ChevronDown = createIcon(LucideChevronDown);
export const ChevronRight = createIcon(LucideChevronRight);
export const Clock = createIcon(LucideClock);
export const ExternalLink = createIcon(LucideExternalLink);
export const FileText = createIcon(LucideFileText);
export const Filter = createIcon(LucideFilter);
export const HelpCircle = createIcon(LucideHelpCircle);
export const History = createIcon(LucideHistory);
export const Info = createIcon(LucideInfo);
export const Languages = createIcon(LucideLanguages);
export const LayoutGrid = createIcon(LucideLayoutGrid);
export const Layers = createIcon(LucideLayers);
export const Leaf = createIcon(LucideLeaf);
export const LogOut = createIcon(LucideLogOut);
export const MapPin = createIcon(LucideMapPin);
export const Menu = createIcon(LucideMenu);
export const MessageSquarePlus = createIcon(LucideMessageSquarePlus);
export const Mic = createIcon(LucideMic);
export const Moon = createIcon(LucideMoon);
export const Pause = createIcon(LucidePause);
export const Play = createIcon(LucidePlay);
export const Search = createIcon(LucideSearch);
export const Send = createIcon(LucideSend);
export const ShieldCheck = createIcon(LucideShieldCheck);
export const ShoppingBag = createIcon(LucideShoppingBag);
export const ShoppingCart = createIcon(LucideShoppingCart);
export const SlidersHorizontal = createIcon(LucideSliders);
export const Sparkles = createIcon(LucideSparkles);
export const Sun = createIcon(LucideSun);
export const Sunrise = createIcon(LucideSunrise);
export const Sunset = createIcon(LucideSunset);
export const TrendingDown = createIcon(LucideTrendingDown);
export const TrendingUp = createIcon(LucideTrendingUp);
export const UploadCloud = createIcon(LucideUploadCloud);
export const User = createIcon(LucideUser);
export const Volume2 = createIcon(LucideVolume2);
export const VolumeX = createIcon(LucideVolumeX);
export const Wallet = createIcon(LucideWallet);
export const Wind = createIcon(LucideWind);
export const X = createIcon(LucideX);
export const Zap = createIcon(LucideZap);
export const Bell = createIcon(LucideBell);
export const Droplet = createIcon(LucideDroplet);
export const Footprints = createIcon(LucideFootprints);
export const Plus = createIcon(LucidePlus);
export const Trash = createIcon(LucideTrash);
export const Grid2X2 = createIcon(LucidePlus); // Mapping Plus as placeholder for Grid2X2 if not found, or use Lucide's Grid2x2
const ICON_MAP: Record<string, any> = {
    house: LucideSun, // Home placeholder
    wallet: LucideWallet,
    "rectangle-list": LucideFileText,
    user: LucideUser,
    "cart-shopping": LucideShoppingCart,
    bell: LucideBell,
    search: LucideSearch,
    sliders: LucideSliders,
    bolt: LucideZap,
    leaf: LucideLeaf,
    wind: LucideWind,
    droplet: LucideDroplet,
    "location-dot": LucideMapPin,
    clock: LucideClock,
    "circle-info": LucideInfo,
    xmark: LucideX,
    building: LucideBuilding2,
    "cloud-sun": LucideSunrise,
    "cloud-moon": LucideSunset,
};

export const AppIcon = ({ name, size = 24, color = "#000", ...props }: any) => {
    const IconComponent = ICON_MAP[name] || LucideHelpCircle;
    return IconComponent ? <IconComponent size={size} color={color} {...props} /> : null;
};
