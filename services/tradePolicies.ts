export const P2P_ENERGY_TRADING_SCHEMA_CONTEXT = "https://schemas.iris.energy/p2p-energy-trading/v1";

export const APPROVED_PRODUCTION_DISCOMS = ["TPDDL", "PVVNL", "BRPL"] as const;

export type TradeNetwork = "production" | "non-production";

export interface TradeSchemaAttributes {
    "@context": string;
    "@type": string;
}

export interface EnergyCustomerAttributes extends TradeSchemaAttributes {
    "@type": "EnergyCustomer";
}

export interface EnergyTradeOfferAttributes extends TradeSchemaAttributes {
    "@type": "EnergyTradeOffer";
}

export interface EnergyTradeOrderAttributes extends TradeSchemaAttributes {
    "@type": "EnergyTradeOrder";
}

export interface EnergyParty {
    meterId: string;
    utilityCustomerId: string;
    utilityId: string;
    attributes: EnergyCustomerAttributes;
}

export interface EnergyQuantity {
    unit: string;
    value: number;
}

export interface EnergyPrice {
    currency: string;
    value: number;
}

export interface TimeWindow {
    endTime: string;
    startTime: string;
}

export interface EnergyTradeOffer {
    attributes: EnergyTradeOfferAttributes;
    availableQuantity: EnergyQuantity;
    deliveryWindow: TimeWindow;
    price: EnergyPrice;
    validityWindow: TimeWindow;
}

export interface CatalogPublishRequest {
    action: "catalog_publish";
    network: TradeNetwork;
    offer: EnergyTradeOffer;
    provider: EnergyParty;
    tradeTimestamp: string;
}

export interface EnergyTradeOrder {
    attributes: EnergyTradeOrderAttributes;
    buyer: EnergyParty;
    deliveryWindow: TimeWindow;
    offer: EnergyTradeOffer;
    orderedQuantity: EnergyQuantity;
    price: EnergyPrice;
    sellers: EnergyParty[];
    tradeTimestamp: string;
}

const REQUIRED_GAP_MS = 4 * 60 * 60 * 1000;

const parseTimestamp = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const hasRequiredLeadTime = (earlier: Date, later: Date) => later.getTime() - earlier.getTime() >= REQUIRED_GAP_MS;

const validateEnergyCustomer = (party: EnergyParty, label: string, errors: string[]) => {
    if (!party.utilityCustomerId.trim()) {
        errors.push(`${label} utilityCustomerId is required.`);
    }

    if (!party.utilityId.trim()) {
        errors.push(`${label} utilityId is required.`);
    }

    if (!party.attributes || party.attributes["@type"] !== "EnergyCustomer") {
        errors.push(`${label} attributes must declare @type: EnergyCustomer.`);
    }

    if (!party.attributes || party.attributes["@context"] !== P2P_ENERGY_TRADING_SCHEMA_CONTEXT) {
        errors.push(`${label} attributes must use the P2P energy trading schema @context.`);
    }
};

const validateOfferSchema = (offer: EnergyTradeOffer, errors: string[]) => {
    if (!offer.attributes || offer.attributes["@type"] !== "EnergyTradeOffer") {
        errors.push("Offer attributes must declare @type: EnergyTradeOffer.");
    }

    if (!offer.attributes || offer.attributes["@context"] !== P2P_ENERGY_TRADING_SCHEMA_CONTEXT) {
        errors.push("Offer attributes must use the P2P energy trading schema @context.");
    }
};

const validateOfferTiming = (offer: EnergyTradeOffer, errors: string[]) => {
    const validityEnd = parseTimestamp(offer.validityWindow.endTime);
    const deliveryStart = parseTimestamp(offer.deliveryWindow.startTime);

    if (!validityEnd || !deliveryStart) {
        errors.push("Offer validity and delivery windows must use valid timestamps.");
        return;
    }

    if (!hasRequiredLeadTime(validityEnd, deliveryStart)) {
        errors.push("Offer validity must close at least 4 hours before delivery starts.");
    }
};

const isTestIdentifier = (value: string) => value.startsWith("TEST_");

export const validateCatalogPublishPolicy = (request: CatalogPublishRequest) => {
    const errors: string[] = [];

    validateOfferTiming(request.offer, errors);
    validateOfferSchema(request.offer, errors);
    validateEnergyCustomer(request.provider, "Provider", errors);

    if (request.offer.price.currency !== "INR") {
        errors.push("Offer price currency must be INR.");
    }

    if (request.offer.availableQuantity.unit !== "kWh") {
        errors.push("Offer quantity unit must be kWh.");
    }

    if (!Number.isFinite(request.offer.availableQuantity.value) || request.offer.availableQuantity.value < 0) {
        errors.push("Offer quantity must be a valid non-negative number.");
    }

    if (!Number.isFinite(request.offer.price.value) || request.offer.price.value < 0) {
        errors.push("Offer price must be a valid non-negative number.");
    }

    if (request.network === "production") {
        if (!APPROVED_PRODUCTION_DISCOMS.includes(request.provider.utilityId as (typeof APPROVED_PRODUCTION_DISCOMS)[number])) {
            errors.push("Production catalog publish requires utilityId to be TPDDL, PVVNL, or BRPL.");
        }
    } else {
        if (request.provider.meterId !== "TEST_METER_SELLER") {
            errors.push("Non-production catalog publish requires meterId TEST_METER_SELLER.");
        }

        if (request.provider.utilityId !== "TEST_DISCOM_SELLER") {
            errors.push("Non-production catalog publish requires utilityId TEST_DISCOM_SELLER.");
        }
    }

    return errors;
};

export const validateTestIdConsistency = (order: EnergyTradeOrder) => {
    const errors: string[] = [];
    const parties = [order.buyer, ...order.sellers];
    const hasAnyTestIdentifier = parties.some((party) => isTestIdentifier(party.meterId) || isTestIdentifier(party.utilityId));

    if (!hasAnyTestIdentifier) {
        return errors;
    }

    if (order.buyer.meterId !== "TEST_METER_BUYER") {
        errors.push("When test identifiers are used, buyer meterId must be TEST_METER_BUYER.");
    }

    if (order.buyer.utilityId !== "TEST_DISCOM_BUYER") {
        errors.push("When test identifiers are used, buyer utilityId must be TEST_DISCOM_BUYER.");
    }

    order.sellers.forEach((seller, index) => {
        if (!isTestIdentifier(seller.meterId)) {
            errors.push(`Seller ${index + 1} meterId must start with TEST_ when any party uses test identifiers.`);
        }

        if (!isTestIdentifier(seller.utilityId)) {
            errors.push(`Seller ${index + 1} utilityId must start with TEST_ when any party uses test identifiers.`);
        }
    });

    return errors;
};

export const validateOrderPolicy = (order: EnergyTradeOrder) => {
    const errors: string[] = [];
    const tradeTimestamp = parseTimestamp(order.tradeTimestamp);
    const deliveryStart = parseTimestamp(order.deliveryWindow.startTime);

    if (!tradeTimestamp || !deliveryStart) {
        errors.push("Order trade timestamp and delivery window must use valid timestamps.");
    } else if (!hasRequiredLeadTime(tradeTimestamp, deliveryStart)) {
        errors.push("Delivery must start at least 4 hours after the trade timestamp.");
    }

    validateOfferTiming(order.offer, errors);
    validateOfferSchema(order.offer, errors);
    validateEnergyCustomer(order.buyer, "Buyer", errors);
    order.sellers.forEach((seller, index) => validateEnergyCustomer(seller, `Seller ${index + 1}`, errors));

    if (!order.buyer.meterId.trim()) {
        errors.push("Buyer meterId is required.");
    }

    if (order.sellers.some((seller) => seller.meterId === order.buyer.meterId)) {
        errors.push("Buyer meterId must not match any seller meterId.");
    }

    if (order.orderedQuantity.unit !== "kWh" || order.offer.availableQuantity.unit !== "kWh") {
        errors.push("Order and offer quantities must use kWh.");
    }

    if (order.price.currency !== "INR" || order.offer.price.currency !== "INR") {
        errors.push("Order and offer price currency must be INR.");
    }

    if (!Number.isFinite(order.orderedQuantity.value) || order.orderedQuantity.value < 0) {
        errors.push("Ordered quantity must be a valid non-negative number.");
    }

    if (order.orderedQuantity.value > order.offer.availableQuantity.value) {
        errors.push("Ordered quantity must not exceed the offer's available quantity.");
    }

    if (!order.attributes || order.attributes["@type"] !== "EnergyTradeOrder") {
        errors.push("Order attributes must declare @type: EnergyTradeOrder.");
    }

    if (!order.attributes || order.attributes["@context"] !== P2P_ENERGY_TRADING_SCHEMA_CONTEXT) {
        errors.push("Order attributes must use the P2P energy trading schema @context.");
    }

    errors.push(...validateTestIdConsistency(order));

    return errors;
};
