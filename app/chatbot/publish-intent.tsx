import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu } from "react-native-paper";
import { IrisText } from "../../components/IrisText";
import {
    Calendar,
    Check,
    Clock,
    History,
    Trash,
    X,
    Zap,
} from "../../components/AppIcons";
import { CONTROL_RADIUS } from "../../components/controlStyles";
import { useTheme } from "../../context/ThemeContext";
import {
    CatalogPublishRequest,
    EnergyParty,
    P2P_ENERGY_TRADING_SCHEMA_CONTEXT,
    validateCatalogPublishPolicy,
} from "../../services/tradePolicies";

type IntentDecisionStatus = "Ordered" | "Approved" | "Rejected";

interface IntentHistoryEntry {
    id: string;
    buyer: string;
    status: IntentDecisionStatus;
    quantity: string;
    price: string;
    orderedHoursAgo: number;
    note: string;
}

const SHEET_MAX_HEIGHT = Dimensions.get("window").height * 0.9;

const DEFAULT_ORDER_HISTORY: IntentHistoryEntry[] = [
    {
        id: "hist-default-1",
        buyer: "Sunspire Residency",
        status: "Ordered",
        quantity: "4 kWh",
        price: "₹6.45/kWh",
        orderedHoursAgo: 2,
        note: "Matched with the current reserve price and delivery slot.",
    },
    {
        id: "hist-default-2",
        buyer: "Metro EV Hub",
        status: "Rejected",
        quantity: "3 kWh",
        price: "₹6.05/kWh",
        orderedHoursAgo: 7,
        note: "Rejected because the quoted price was below the listing target.",
    },
];

const INTENT_ORDER_HISTORY: Record<string, IntentHistoryEntry[]> = {
    "101": [
        {
            id: "hist-101-1",
            buyer: "GreenNest Residency",
            status: "Approved",
            quantity: "6 kWh",
            price: "₹6.40/kWh",
            orderedHoursAgo: 2,
            note: "Approved after matching the requested quantity to the available slot.",
        },
        {
            id: "hist-101-2",
            buyer: "CityCharge EV Garage",
            status: "Rejected",
            quantity: "4 kWh",
            price: "₹6.00/kWh",
            orderedHoursAgo: 4,
            note: "Rejected because the offer came below the current listing price.",
        },
        {
            id: "hist-101-3",
            buyer: "Lotus Heights Block B",
            status: "Ordered",
            quantity: "5 kWh",
            price: "₹6.25/kWh",
            orderedHoursAgo: 11,
            note: "Approved and reserved against the active rooftop solar intent.",
        },
    ],
    "102": [
        {
            id: "hist-102-1",
            buyer: "Garden Residency",
            status: "Rejected",
            quantity: "2 kWh",
            price: "₹5.20/kWh",
            orderedHoursAgo: 3,
            note: "Rejected after the buyer asked for a lower tariff than the listed rate.",
        },
        {
            id: "hist-102-2",
            buyer: "Community Co-op",
            status: "Ordered",
            quantity: "3 kWh",
            price: "₹5.80/kWh",
            orderedHoursAgo: 9,
            note: "Approved for the full quoted rate and scheduled delivery window.",
        },
    ],
    "103": [
        {
            id: "hist-103-1",
            buyer: "Fleet Depot Alpha",
            status: "Approved",
            quantity: "8 kWh",
            price: "₹7.55/kWh",
            orderedHoursAgo: 1,
            note: "Approved with the peak-hour battery reserve price intact.",
        },
        {
            id: "hist-103-2",
            buyer: "Parking Tower West",
            status: "Rejected",
            quantity: "5 kWh",
            price: "₹7.05/kWh",
            orderedHoursAgo: 8,
            note: "Rejected due to limited available reserve during the requested window.",
        },
    ],
    "104": [
        {
            id: "hist-104-1",
            buyer: "Block C Welfare Assn.",
            status: "Approved",
            quantity: "25 kWh",
            price: "₹4.80/kWh",
            orderedHoursAgo: 1,
            note: "Approved as a bulk order against the neighborhood solar share.",
        },
        {
            id: "hist-104-2",
            buyer: "Common Utilities Desk",
            status: "Rejected",
            quantity: "10 kWh",
            price: "₹4.25/kWh",
            orderedHoursAgo: 14,
            note: "Rejected because the bid sat below the current floor price.",
        },
    ],
    "105": [
        {
            id: "hist-105-1",
            buyer: "Home Cluster A",
            status: "Ordered",
            quantity: "10 kWh",
            price: "₹6.50/kWh",
            orderedHoursAgo: 5,
            note: "Approved and fully allocated before the morning peak window began.",
        },
        {
            id: "hist-105-2",
            buyer: "Local Charge Point",
            status: "Rejected",
            quantity: "6 kWh",
            price: "₹6.15/kWh",
            orderedHoursAgo: 16,
            note: "Rejected because the inventory had already been committed elsewhere.",
        },
    ],
};

const formatOrderedWithinHours = (hoursAgo: number) => `Ordered ${hoursAgo}h ago`;

const HOURLY_START_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour);

const formatHourLabel = (hour: number) => `${hour.toString().padStart(2, "0")}:00`;

const formatHourlyWindow = (startHour: number) =>
    `${formatHourLabel(startHour)} – ${formatHourLabel(startHour + 1)}`;

const formatCalendarDate = (date: Date) => {
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 60 * 60 * 1000);

const roundUpToWholeHour = (date: Date) => {
    const rounded = new Date(date);

    if (rounded.getMinutes() === 0 && rounded.getSeconds() === 0 && rounded.getMilliseconds() === 0) {
        return rounded;
    }

    rounded.setHours(rounded.getHours() + 1, 0, 0, 0);
    return rounded;
};

const parseCalendarDate = (value?: string) => {
    if (!value) {
        return null;
    }

    const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (!match) {
        return null;
    }

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);
    const parsed = new Date(year, month - 1, day);

    if (
        parsed.getFullYear() !== year ||
        parsed.getMonth() !== month - 1 ||
        parsed.getDate() !== day
    ) {
        return null;
    }

    parsed.setHours(0, 0, 0, 0);
    return parsed;
};

const isSameLocalDate = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

const getAvailableStartHours = (deliveryDate: Date | null, earliestAllowedStart: Date) => {
    if (!deliveryDate) {
        return [];
    }

    const earliestDay = new Date(earliestAllowedStart);
    earliestDay.setHours(0, 0, 0, 0);

    if (deliveryDate.getTime() < earliestDay.getTime()) {
        return [];
    }

    const minimumHour = isSameLocalDate(deliveryDate, earliestAllowedStart) ? earliestAllowedStart.getHours() : 0;
    return HOURLY_START_OPTIONS.filter((hour) => hour >= minimumHour);
};

const parseWholeHour = (value?: string) => {
    if (!value) {
        return null;
    }

    const normalizedValue = value.trim().toUpperCase();
    const twentyFourHourMatch = normalizedValue.match(/^(\d{1,2}):(\d{2})$/);

    if (twentyFourHourMatch) {
        const hour = Number(twentyFourHourMatch[1]);
        const minutes = Number(twentyFourHourMatch[2]);

        if (minutes !== 0 || hour < 0 || hour > 23) {
            return null;
        }

        return hour;
    }

    const twelveHourMatch = normalizedValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

    if (!twelveHourMatch) {
        return null;
    }

    const hour = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3];

    if (minutes !== 0 || hour < 1 || hour > 12) {
        return null;
    }

    return period === "PM" ? (hour % 12) + 12 : hour % 12;
};

const getInitialStartHour = (saleWindow?: string) => {
    const startValue = saleWindow?.split(" – ")[0];
    return parseWholeHour(startValue) ?? 12;
};

const PRODUCTION_SELLER_PROFILE: EnergyParty = {
    meterId: "62358103",
    utilityCustomerId: "UCID-SELLER-62358103",
    utilityId: "TPDDL",
    attributes: {
        "@context": P2P_ENERGY_TRADING_SCHEMA_CONTEXT,
        "@type": "EnergyCustomer",
    },
};

const NON_PRODUCTION_SELLER_PROFILE: EnergyParty = {
    meterId: "TEST_METER_SELLER",
    utilityCustomerId: "TEST_UTILITY_CUSTOMER_SELLER",
    utilityId: "TEST_DISCOM_SELLER",
    attributes: {
        "@context": P2P_ENERGY_TRADING_SCHEMA_CONTEXT,
        "@type": "EnergyCustomer",
    },
};

const SANCTIONED_LOAD = 5.0;

const formatValidationErrors = (errors: string[]) =>
    errors
        .slice(0, 4)
        .map((error, index) => `${index + 1}. ${error}`)
        .join("\n");

export default function PublishIntentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        source?: string;
        listingId?: string;
        name?: string;
        type?: string;
        quantity?: string;
        price?: string;
        date?: string;
        saleWindow?: string;
        status?: string;
    }>();

    const { colors, theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = theme === "dark";
    const network = __DEV__ ? "non-production" : "production";
    const sellerProfile = network === "production" ? PRODUCTION_SELLER_PROFILE : NON_PRODUCTION_SELLER_PROFILE;
    const isEdit = !!params.listingId;
    const isOrdersSource = params.source === "orders";
    const intentName = params.name || "Energy Intent";
    const [currentStatus, setCurrentStatus] = useState((params.status || "active").toLowerCase());
    const orderHistory = isEdit
        ? INTENT_ORDER_HISTORY[params.listingId ?? ""] || DEFAULT_ORDER_HISTORY
        : [];
    const [historyEntries, setHistoryEntries] = useState(orderHistory);
    const approvedHistoryEntry = historyEntries.find((entry) => entry.status === "Approved");
    const displayedOrderHistory = approvedHistoryEntry
        ? [
            approvedHistoryEntry,
            ...historyEntries.filter((entry) => entry.status === "Ordered"),
            ...historyEntries.filter((entry) => entry.status === "Rejected"),
        ]
        : [
            ...historyEntries.filter((entry) => entry.status === "Ordered"),
            ...historyEntries.filter((entry) => entry.status === "Rejected"),
        ];

    const [tradeTimestamp] = useState(() => new Date());
    const [quantity, setQuantity] = useState(params.quantity || "5");
    const [price, setPrice] = useState(params.price || "4.25");
    const earliestAllowedStart = roundUpToWholeHour(addHours(tradeTimestamp, 4));
    const [deliveryDate, setDeliveryDate] = useState(() =>
        isEdit ? params.date || formatCalendarDate(earliestAllowedStart) : formatCalendarDate(earliestAllowedStart)
    );
    const [startHour, setStartHour] = useState(() =>
        isEdit ? getInitialStartHour(params.saleWindow) : earliestAllowedStart.getHours()
    );
    const [startHourMenuVisible, setStartHourMenuVisible] = useState(false);
    const parsedDeliveryDate = parseCalendarDate(deliveryDate);
    const availableStartHours = isEdit
        ? HOURLY_START_OPTIONS
        : getAvailableStartHours(parsedDeliveryDate, earliestAllowedStart);
    const selectedWindow = formatHourlyWindow(startHour);
    const endTime = formatHourLabel(startHour + 1);
    const earliestAllowedWindowLabel = `${formatCalendarDate(earliestAllowedStart)} · ${formatHourlyWindow(earliestAllowedStart.getHours())}`;
    const borderColor = isDark ? "rgba(255,255,255,0.08)" : colors.outlineVariant;
    const inputBg = isDark ? "#1A1A1D" : colors.surface;

    const fieldShellStyle = {
        backgroundColor: inputBg,
        borderWidth: 1.5,
        borderColor,
        borderRadius: CONTROL_RADIUS,
        paddingHorizontal: 14,
        paddingVertical: 14,
    };

    const textInputStyle = {
        flex: 1,
        color: colors.onSurface,
        fontSize: 16,
        fontFamily: "IBMPlexSans_400Regular" as const,
    };

    const labelStyle = {
        fontSize: 15,
        fontWeight: "700" as const,
        color: colors.onSurface,
        marginBottom: 10,
    };

    const statusTone =
        currentStatus === "sold"
            ? { background: colors.tertiary + "18", text: colors.tertiary, label: "Sold" }
            : currentStatus === "settled"
                ? { background: colors.secondary + "18", text: colors.secondary, label: "Settled" }
            : currentStatus === "ordered"
                ? { background: colors.secondary + "18", text: colors.secondary, label: "Ordered" }
            : currentStatus === "delivered"
                ? { background: colors.success + "18", text: colors.success, label: "Delivered" }
            : currentStatus === "accepted"
                ? { background: colors.success + "18", text: colors.success, label: "Accepted" }
            : currentStatus === "rejected"
                ? { background: colors.danger + "18", text: colors.danger, label: "Rejected" }
            : currentStatus === "allocated"
                ? { background: colors.warning + "18", text: colors.warning, label: "Allocated" }
            : currentStatus === "pending"
                ? { background: colors.warning + "18", text: colors.warning, label: "Pending" }
                : { background: colors.primary + "18", text: colors.primary, label: "Active" };
    const isOrderedStatus = currentStatus === "ordered";
    const shouldShowDeleteIntent = isEdit && currentStatus !== "settled";
    const shouldShowFooter = shouldShowDeleteIntent || (!isEdit && !isOrdersSource);

    const detailStats = [
        { label: "Quantity", value: `${quantity} kWh` },
        { label: isOrdersSource ? "Demand Price" : "Price", value: `₹${price}/kWh` },
        { label: "Delivery", value: params.date || "--" },
        { label: "Window", value: params.saleWindow || "--" },
    ];

    const handleDelete = () => {
        if (currentStatus && currentStatus !== "active") {
            if (currentStatus === "sold") {
                Alert.alert(
                    "Cannot Delete Intent",
                    "This energy intent has already been sold. Committed orders cannot be deleted from the listing view."
                );
            } else {
                Alert.alert(
                    "Cannot Delete Intent",
                    `Intents in ${currentStatus} status cannot be deleted.`
                );
            }
            return;
        }

        Alert.alert(
            "Delete Intent",
            "Are you sure you want to delete this energy selling intent?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => router.back() },
            ]
        );
    };

    const handleHistoryAction = (entryId: string, action: "Approved" | "Rejected") => {
        if (action === "Approved" && historyEntries.some((entry) => entry.status === "Approved" && entry.id !== entryId)) {
            Alert.alert(
                "Approval Limit Reached",
                "Only one order can be approved for this intent. Reject the other pending orders instead."
            );
            return;
        }

        setHistoryEntries((prev) =>
            prev.map((entry) =>
                entry.id === entryId
                    ? { ...entry, status: action }
                    : entry
            )
        );
    };

    const handleDeliveryDateChange = (value: string) => {
        setDeliveryDate(value);

        if (isEdit) {
            return;
        }

        const nextParsedDate = parseCalendarDate(value);
        const nextAvailableStartHours = getAvailableStartHours(nextParsedDate, earliestAllowedStart);

        if (nextAvailableStartHours.length === 0) {
            setStartHour(earliestAllowedStart.getHours());
            return;
        }

        if (!nextAvailableStartHours.includes(startHour)) {
            setStartHour(nextAvailableStartHours[0]);
        }
    };

    const validateIntentFields = () => {
        if (!Number.isInteger(startHour) || startHour < 0 || startHour > 23) {
            Alert.alert(
                "Invalid Time Window",
                "Please select a whole-hour slot. Energy can only be listed for exactly 1 hour."
            );
            return null;
        }

        const quantityValue = Number.parseFloat(quantity);
        const priceValue = Number.parseFloat(price);

        if (!Number.isFinite(quantityValue) || quantityValue < 0) {
            Alert.alert(
                "Invalid Quantity",
                "Please enter a valid non-negative quantity in kWh."
            );
            return null;
        }

        if (!isEdit && quantityValue > SANCTIONED_LOAD) {
            Alert.alert(
                "Exceeds Capacity",
                `The quantity exceeds your available sanctioned load. For a 1-hour delivery slot, you can list a maximum of ${SANCTIONED_LOAD} kWh based on your 5 kW sanctioned capacity.`
            );
            return null;
        }

        if (!Number.isFinite(priceValue) || priceValue < 0) {
            Alert.alert(
                "Invalid Price",
                "Please enter a valid non-negative price in INR."
            );
            return null;
        }

        const parsedDate = parseCalendarDate(deliveryDate);

        if (!parsedDate) {
            Alert.alert(
                "Invalid Delivery Date",
                "Please enter a valid date in MM/DD/YYYY format."
            );
            return null;
        }

        return { parsedDate, priceValue, quantityValue };
    };

    const handleSubmit = () => {
        const validated = validateIntentFields();

        if (!validated) {
            return;
        }

        const deliveryStart = new Date(validated.parsedDate);
        deliveryStart.setHours(startHour, 0, 0, 0);
        const deliveryEnd = addHours(deliveryStart, 1);

        if (deliveryStart.getTime() < earliestAllowedStart.getTime()) {
            Alert.alert(
                "Delivery Window Too Early",
                `The delivery window must start at least 4 hours after the trade timestamp. Earliest allowed slot: ${earliestAllowedWindowLabel}.`
            );
            return;
        }

        const catalogPublishRequest: CatalogPublishRequest = {
            action: "catalog_publish",
            network,
            tradeTimestamp: tradeTimestamp.toISOString(),
            provider: sellerProfile,
            offer: {
                attributes: {
                    "@context": P2P_ENERGY_TRADING_SCHEMA_CONTEXT,
                    "@type": "EnergyTradeOffer",
                },
                availableQuantity: {
                    unit: "kWh",
                    value: validated.quantityValue,
                },
                deliveryWindow: {
                    endTime: deliveryEnd.toISOString(),
                    startTime: deliveryStart.toISOString(),
                },
                price: {
                    currency: "INR",
                    value: validated.priceValue,
                },
                validityWindow: {
                    endTime: tradeTimestamp.toISOString(),
                    startTime: tradeTimestamp.toISOString(),
                },
            },
        };

        const policyErrors = validateCatalogPublishPolicy(catalogPublishRequest);

        if (policyErrors.length > 0) {
            Alert.alert(
                "Policy Validation Failed",
                formatValidationErrors(policyErrors)
            );
            return;
        }

        router.back();
    };

    const renderIntentForm = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 22 }}>
                    <View style={{ flex: 1 }}>
                        <IrisText style={labelStyle}>Quantity (kWh)</IrisText>
                        <View style={[fieldShellStyle, { flexDirection: "row", alignItems: "center", gap: 10 }]}>
                            <Zap size={16} color={colors.onSurfaceVariant} />
                            <TextInput
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                selectTextOnFocus
                                style={textInputStyle}
                                placeholder="0"
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 1 }}>
                        <IrisText style={labelStyle}>Price (₹/kWh)</IrisText>
                        <View style={[fieldShellStyle, { flexDirection: "row", alignItems: "center", gap: 10 }]}>
                            <IrisText style={{ fontSize: 16, color: colors.onSurfaceVariant, fontWeight: "600" }}>₹</IrisText>
                            <TextInput
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                selectTextOnFocus
                                style={textInputStyle}
                                placeholder="0.00"
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ marginBottom: 22 }}>
                    <IrisText style={labelStyle}>Delivery Date</IrisText>
                    <View style={[fieldShellStyle, { flexDirection: "row", alignItems: "center", gap: 12 }]}>
                        <TextInput
                            value={deliveryDate}
                            onChangeText={handleDeliveryDateChange}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor={colors.muted}
                            style={textInputStyle}
                        />
                        <Calendar size={18} color={colors.onSurfaceVariant} />
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <IrisText style={labelStyle}>Delivery Time Window</IrisText>
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 6, fontWeight: "500" }}>
                            Start Time
                        </IrisText>
                        <Menu
                            visible={startHourMenuVisible}
                            onDismiss={() => setStartHourMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => {
                                        if (availableStartHours.length === 0) {
                                            Alert.alert(
                                                "No Delivery Slots Available",
                                                `Choose a delivery date on or after ${formatCalendarDate(earliestAllowedStart)}.`
                                            );
                                            return;
                                        }

                                        setStartHourMenuVisible(true);
                                    }}
                                    style={[
                                        fieldShellStyle,
                                        {
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 10,
                                        },
                                    ]}
                                >
                                    <IrisText style={{ flex: 1, color: colors.onSurface, fontSize: 15, fontWeight: "700" }}>
                                        {formatHourLabel(startHour)}
                                    </IrisText>
                                    <Clock size={16} color={colors.onSurfaceVariant} />
                                </TouchableOpacity>
                            }
                            contentStyle={{
                                backgroundColor: colors.surface,
                                borderRadius: 12,
                                maxHeight: 360,
                            }}
                        >
                            {availableStartHours.map((hour) => (
                                <Menu.Item
                                    key={hour}
                                    onPress={() => {
                                        setStartHour(hour);
                                        setStartHourMenuVisible(false);
                                    }}
                                    title={formatHourlyWindow(hour)}
                                    titleStyle={{
                                        fontSize: 13,
                                        fontWeight: startHour === hour ? "700" : "600",
                                        color: startHour === hour ? colors.primary : colors.onSurface,
                                    }}
                                />
                            ))}
                        </Menu>
                    </View>

                    <View style={{ flex: 1 }}>
                        <IrisText style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 6, fontWeight: "500" }}>
                            End Time
                        </IrisText>
                        <View
                            style={[
                                fieldShellStyle,
                                {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 10,
                                    opacity: 0.9,
                                },
                            ]}
                        >
                            <IrisText style={{ flex: 1, color: colors.onSurface, fontSize: 15, fontWeight: "700" }}>
                                {endTime}
                            </IrisText>
                            <Clock size={16} color={colors.onSurfaceVariant} />
                        </View>
                    </View>
                </View>

            </View>
        );
    };

    return (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => router.back()}
                style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.backdrop }]}
            />

            <View
                style={{
                    maxHeight: SHEET_MAX_HEIGHT,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    borderTopWidth: 1,
                    borderColor,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        width: 44,
                        height: 4,
                        borderRadius: 999,
                        backgroundColor: colors.outline,
                        alignSelf: "center",
                        marginTop: 12,
                        marginBottom: 16,
                        opacity: 0.65,
                    }}
                />

                <View style={{ paddingHorizontal: 16, paddingBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <IrisText style={{ fontSize: 22, fontWeight: "800", color: colors.onSurface }}>
                                {isEdit ? "Intent Details" : "Publish Intent"}
                            </IrisText>
                            {isEdit && (
                                <View
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 6,
                                        borderRadius: 999,
                                        backgroundColor: statusTone.background,
                                    }}
                                >
                                    <IrisText style={{ fontSize: 11, fontWeight: "700", color: statusTone.text }}>
                                        {statusTone.label}
                                    </IrisText>
                                </View>
                            )}
                        </View>
                        {!isEdit && (
                            <IrisText style={{ fontSize: 13, color: colors.onSurfaceVariant, marginTop: 4 }}>
                                Create a new energy intent in this bottom sheet with quantity, pricing, and delivery details.
                            </IrisText>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            backgroundColor: colors.surfaceVariant,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <X size={18} color={colors.onSurface} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 24,
                    }}
                >
                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 22 }}>
                        {[
                            { label: "SANCTIONED LOAD", value: `${SANCTIONED_LOAD} kW` },
                            { label: "METER ID", value: sellerProfile.meterId },
                        ].map((item) => (
                            <View
                                key={item.label}
                                style={{
                                    flex: 1,
                                    backgroundColor: inputBg,
                                    borderRadius: CONTROL_RADIUS,
                                    padding: 14,
                                    borderWidth: 1.5,
                                    borderColor,
                                }}
                            >
                                <IrisText style={{ fontSize: 10, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 }}>
                                    {item.label}
                                </IrisText>
                                <IrisText style={{ fontSize: 16, fontWeight: "800", color: colors.onSurface, marginTop: 3 }}>
                                    {item.value}
                                </IrisText>
                            </View>
                        ))}
                    </View>

                    {isEdit && (
                        <View
                            style={{
                                backgroundColor: colors.surface,
                                borderRadius: 22,
                                padding: 16,
                                borderWidth: 1,
                                borderColor,
                                marginBottom: 18,
                            }}
                        >
                            <IrisText style={{ fontSize: 17, fontWeight: "800", color: colors.onSurface }}>
                                {intentName}
                            </IrisText>

                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                                {detailStats.map((item) => (
                                    <View
                                        key={item.label}
                                        style={{
                                            minWidth: "47%",
                                            flexGrow: 1,
                                            padding: 12,
                                            borderRadius: 16,
                                            backgroundColor: colors.surfaceVariant,
                                            borderWidth: 1,
                                            borderColor,
                                        }}
                                    >
                                        <IrisText style={{ fontSize: 11, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.3 }}>
                                            {item.label.toUpperCase()}
                                        </IrisText>
                                        <IrisText style={{ fontSize: 15, fontWeight: "800", color: colors.onSurface, marginTop: 4 }}>
                                            {item.value}
                                        </IrisText>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {!isEdit && renderIntentForm()}

                    {isEdit && (
                        <>
                            <View style={{ marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <History size={18} color={colors.onSurface} />
                                <IrisText style={{ fontSize: 18, fontWeight: "800", color: colors.onSurface }}>
                                    Order History
                                </IrisText>
                            </View>

                            {displayedOrderHistory.map((entry) => {
                                const isApproved = entry.status === "Approved";
                                const isOrdered = entry.status === "Ordered";
                                const showHistoryActions = isOrdered && isOrderedStatus;
                                const toneColor = isApproved
                                    ? colors.success
                                    : isOrdered
                                        ? colors.secondary
                                        : colors.danger;

                                return (
                                    <View
                                        key={entry.id}
                                        style={{
                                            marginBottom: 10,
                                            backgroundColor: colors.surface,
                                            borderRadius: CONTROL_RADIUS,
                                            padding: 12,
                                            borderWidth: 1,
                                            borderColor,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                                            <View
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 12,
                                                    backgroundColor: toneColor + "16",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {isApproved ? <Check size={15} color={toneColor} /> : isOrdered ? <Clock size={15} color={toneColor} /> : <X size={15} color={toneColor} />}
                                            </View>

                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <IrisText style={{ fontSize: 14, fontWeight: "700", color: colors.onSurface }}>
                                                            {params.listingId ? `Intent ID ${params.listingId}` : entry.id}
                                                        </IrisText>
                                                        <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, marginTop: 1 }}>
                                                            {entry.buyer}
                                                        </IrisText>
                                                    </View>

                                                    <View
                                                        style={{
                                                            paddingHorizontal: 7,
                                                            paddingVertical: 3,
                                                            borderRadius: 8,
                                                            backgroundColor: toneColor + "18",
                                                        }}
                                                    >
                                                        <IrisText style={{ fontSize: 9, fontWeight: "800", color: toneColor }}>
                                                            {entry.status.toUpperCase()}
                                                        </IrisText>
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 10, marginTop: 10 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <IrisText style={{ fontSize: 10, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.3 }}>
                                                            DEMAND PRICE
                                                        </IrisText>
                                                        <IrisText style={{ fontSize: 14, fontWeight: "800", color: colors.onSurface, marginTop: 2 }}>
                                                            {entry.price}
                                                        </IrisText>
                                                    </View>

                                                    <View
                                                        style={{
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 4,
                                                            borderRadius: 999,
                                                            backgroundColor: colors.surfaceVariant,
                                                            borderWidth: 1,
                                                            borderColor,
                                                        }}
                                                    >
                                                        <IrisText style={{ fontSize: 10, fontWeight: "700", color: colors.onSurfaceVariant }}>
                                                            {entry.quantity}
                                                        </IrisText>
                                                    </View>
                                                </View>

                                                <IrisText style={{ fontSize: 11, color: colors.onSurfaceVariant, marginTop: 8 }}>
                                                    {formatOrderedWithinHours(entry.orderedHoursAgo)}
                                                </IrisText>

                                                {showHistoryActions && (
                                                    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                                                        <TouchableOpacity
                                                            onPress={() => handleHistoryAction(entry.id, "Rejected")}
                                                            style={{
                                                                flex: 1,
                                                                height: 36,
                                                                borderRadius: 10,
                                                                borderWidth: 1,
                                                                borderColor: colors.danger + "40",
                                                                backgroundColor: colors.danger + "12",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <IrisText style={{ fontSize: 12, fontWeight: "700", color: colors.danger }}>
                                                                Reject
                                                            </IrisText>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            onPress={() => handleHistoryAction(entry.id, "Approved")}
                                                            style={{
                                                                flex: 1,
                                                                height: 36,
                                                                borderRadius: 10,
                                                                backgroundColor: colors.primary,
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            <IrisText style={{ fontSize: 12, fontWeight: "800", color: "#04150E" }}>
                                                                Accept
                                                            </IrisText>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}

                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </>
                    )}
                </ScrollView>

                {shouldShowFooter ? (
                    <View
                        style={{
                            backgroundColor: colors.surface,
                            borderTopWidth: 1,
                            borderColor: colors.outlineVariant,
                            flexDirection: "row",
                            gap: 12,
                            paddingHorizontal: 16,
                            paddingTop: 14,
                            paddingBottom: Math.max(insets.bottom, 16),
                        }}
                    >
                        {shouldShowDeleteIntent ? (
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={{
                                    flex: 1,
                                    height: 52,
                                    borderRadius: CONTROL_RADIUS,
                                    backgroundColor: colors.danger + "15",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    borderWidth: 1,
                                    borderColor: colors.danger + "40",
                                }}
                            >
                                <Trash size={18} color={colors.danger} />
                                <IrisText style={{ fontSize: 15, fontWeight: "700", color: colors.danger }}>
                                    Delete Intent
                                </IrisText>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    style={{
                                        flex: 1,
                                        height: 52,
                                        borderRadius: CONTROL_RADIUS,
                                        borderWidth: 1.5,
                                        borderColor: colors.onSurface,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <IrisText style={{ fontSize: 15, fontWeight: "700", color: colors.onSurface }}>
                                        Cancel
                                    </IrisText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    style={{
                                        flex: 1,
                                        height: 52,
                                        borderRadius: CONTROL_RADIUS,
                                        backgroundColor: colors.primary,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        shadowColor: colors.primary,
                                        shadowOpacity: 0.4,
                                        shadowRadius: 12,
                                        shadowOffset: { width: 0, height: 4 },
                                        elevation: 6,
                                    }}
                                >
                                    <IrisText style={{ fontSize: 15, fontWeight: "800", color: "#04150E" }}>
                                        Publish Intent
                                    </IrisText>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                ) : null}
            </View>
        </View>
    );
}
