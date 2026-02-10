
export interface EnergyAsset {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    type: "solar" | "wind" | "grid" | "hydro";
    trend: number[];
    description?: string;
    location?: string;
    capacity?: string;
}

export const MARKET_DATA: EnergyAsset[] = [
    {
        id: "1",
        name: "Solar Park Rajasthan",
        symbol: "SUN-RJ",
        price: 4.25,
        change: 0.15,
        changePercent: 3.65,
        type: "solar",
        trend: [4.10, 4.15, 4.12, 4.18, 4.25, 4.22, 4.25],
        description: "Large-scale solar park located in the Thar Desert capable of generating over 200MW during peak hours.",
        location: "Rajasthan, India",
        capacity: "250 MW"
    },
    {
        id: "2",
        name: "Tamil Nadu Wind Farm",
        symbol: "WIND-TN",
        price: 3.80,
        change: -0.05,
        changePercent: -1.30,
        type: "wind",
        trend: [3.90, 3.88, 3.85, 3.82, 3.80, 3.78, 3.80],
        description: "Wind energy generation facility utilizing high-efficiency turbines in the coastal regions.",
        location: "Tamil Nadu, India",
        capacity: "150 MW"
    },
    {
        id: "3",
        name: "National Grid (Average)",
        symbol: "GRID-IN",
        price: 6.50,
        change: 0.45,
        changePercent: 7.43,
        type: "grid",
        trend: [6.00, 6.10, 6.25, 6.30, 6.45, 6.48, 6.50],
        description: "Average price for grid electricity across major distribution networks.",
        location: "National",
        capacity: "N/A"
    },
    {
        id: "4",
        name: "Coastal Hydro Project",
        symbol: "HYDR-KA",
        price: 5.10,
        change: 0.02,
        changePercent: 0.39,
        type: "hydro",
        trend: [5.08, 5.09, 5.10, 5.10, 5.11, 5.10, 5.10],
        description: "Hydroelectric power station leveraging river flow for consistent green energy.",
        location: "Karnataka, India",
        capacity: "100 MW"
    },
    {
        id: "5",
        name: "Green Valley Solar",
        symbol: "GVS-MH",
        price: 4.55,
        change: 0.22,
        changePercent: 5.08,
        type: "solar",
        trend: [4.30, 4.35, 4.42, 4.48, 4.55, 4.52, 4.55],
        description: "Community solar project providing clean energy to local residential areas.",
        location: "Maharashtra, India",
        capacity: "50 MW"
    }
];
