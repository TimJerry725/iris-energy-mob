import { create } from "zustand";
import type { EnergyAsset } from "../constants/marketData";

export type EnergySourceFilter = "solar" | "battery" | "grid" | "hybrid" | "renewable";
export type TimeSlotFilter = "any" | "morning" | "afternoon" | "evening" | "night";
export type DiscomFilter = "all" | "tpddl" | "adani" | "bescom" | "yamuna";

export interface BuyerFilters {
    sources: EnergySourceFilter[];
    maxRate: number;
    minQuantity: number;
    saveMoney: boolean;
    timeSlot: TimeSlotFilter;
    discom: DiscomFilter;
}

interface BuyerFiltersStore {
    filters: BuyerFilters;
    setFilters: (filters: BuyerFilters) => void;
    resetFilters: () => void;
}

export const ENERGY_SOURCE_OPTIONS: { id: EnergySourceFilter; label: string }[] = [
    { id: "solar", label: "Solar" },
    { id: "battery", label: "Battery" },
    { id: "grid", label: "Grid" },
    { id: "hybrid", label: "Hybrid" },
    { id: "renewable", label: "Renewable" },
];

export const TIME_SLOT_OPTIONS: { id: Exclude<TimeSlotFilter, "any">; label: string; time: string }[] = [
    { id: "morning", label: "Morning", time: "06:00-12:00" },
    { id: "afternoon", label: "Afternoon", time: "12:00-18:00" },
    { id: "evening", label: "Evening", time: "18:00-24:00" },
    { id: "night", label: "Night", time: "00:00-06:00" },
];

export const DISCOM_OPTIONS: { id: DiscomFilter; label: string }[] = [
    { id: "all", label: "All Discoms" },
    { id: "tpddl", label: "Tata Power DDL" },
    { id: "adani", label: "Adani Electricity" },
    { id: "bescom", label: "BESCOM" },
    { id: "yamuna", label: "Yamuna Power" },
];

export const QUANTITY_PRESETS = [0, 10, 50, 100, 200];
export const DEFAULT_MAX_RATE = 15;
export const DEFAULT_MIN_QUANTITY = 10;
export const GRID_REFERENCE_RATE = 6.5;

export const DEFAULT_BUYER_FILTERS: BuyerFilters = {
    sources: ["solar"],
    maxRate: DEFAULT_MAX_RATE,
    minQuantity: DEFAULT_MIN_QUANTITY,
    saveMoney: false,
    timeSlot: "any",
    discom: "all",
};

const ASSET_DISCOM_MAP: Record<string, DiscomFilter> = {
    "1": "tpddl",
    "2": "bescom",
    "3": "yamuna",
    "4": "adani",
    "5": "tpddl",
};

const ASSET_TIME_SLOT_MAP: Record<string, Exclude<TimeSlotFilter, "any">> = {
    "1": "afternoon",
    "2": "night",
    "3": "evening",
    "4": "morning",
    "5": "morning",
};

const ASSET_QUANTITY_MAP: Record<string, number> = {
    "1": 200,
    "2": 50,
    "3": 500,
    "4": 100,
    "5": 10,
};

export const getBuyerFilterCount = (filters: BuyerFilters) => {
    let count = 0;

    if (filters.sources.length > 0) count += 1;
    if (filters.maxRate < DEFAULT_MAX_RATE) count += 1;
    if (filters.minQuantity > 0) count += 1;
    if (filters.saveMoney) count += 1;
    if (filters.timeSlot !== "any") count += 1;
    if (filters.discom !== "all") count += 1;

    return count;
};

export const getAssetQuantity = (asset: EnergyAsset) => ASSET_QUANTITY_MAP[asset.id] ?? 0;

export const getAssetDiscom = (asset: EnergyAsset): DiscomFilter => ASSET_DISCOM_MAP[asset.id] ?? "all";

export const getAssetTimeSlot = (asset: EnergyAsset): Exclude<TimeSlotFilter, "any"> =>
    ASSET_TIME_SLOT_MAP[asset.id] ?? "morning";

const matchesSourceFilter = (asset: EnergyAsset, sources: EnergySourceFilter[]) => {
    if (sources.length === 0) return true;

    return sources.some((source) => {
        switch (source) {
            case "solar":
                return asset.type === "solar";
            case "battery":
                return asset.symbol.includes("GRID");
            case "grid":
                return asset.type === "grid";
            case "hybrid":
                return asset.type === "hydro";
            case "renewable":
                return asset.type === "solar" || asset.type === "wind" || asset.type === "hydro";
            default:
                return true;
        }
    });
};

export const matchesBuyerFilters = (asset: EnergyAsset, filters: BuyerFilters) => {
    if (!matchesSourceFilter(asset, filters.sources)) return false;
    if (asset.price > filters.maxRate) return false;
    if (getAssetQuantity(asset) < filters.minQuantity) return false;
    if (filters.saveMoney && asset.price >= GRID_REFERENCE_RATE) return false;
    if (filters.timeSlot !== "any" && getAssetTimeSlot(asset) !== filters.timeSlot) return false;
    if (filters.discom !== "all" && getAssetDiscom(asset) !== filters.discom) return false;

    return true;
};

export const useBuyerFiltersStore = create<BuyerFiltersStore>((set) => ({
    filters: DEFAULT_BUYER_FILTERS,
    setFilters: (filters) => set({ filters }),
    resetFilters: () => set({ filters: DEFAULT_BUYER_FILTERS }),
}));
