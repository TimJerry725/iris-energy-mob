# Chat Mock Data Documentation

## Overview
This file contains comprehensive multilingual chat flow mock data for the Iris Energy Assistant chatbot, based on realistic energy trading scenarios.

## Supported Languages
- **English (en)**: Primary language
- **Hindi (hi)**: हिंदी
- **Tamil (ta)**: தமிழ்
- **Marathi (mr)**: मराठी
- **Bengali (bn)**: বাংলা
- **Telugu (te)**: తెలుగు

## Chat Scenarios

### 1. **Selling Solar Energy** (`sell_solar_energy`)
Complete flow for a user selling excess solar power:
- User initiates sale request
- AI asks for quantity (offers recommendation)
- AI confirms solar source
- AI provides weather-based recommendation
- User sets quantity
- AI suggests market pricing
- User confirms price
- AI publishes listing
- AI offers to set up recurring sales

**Key Features:**
- Smart recommendations based on history
- Weather forecast integration
- Market price guidance
- Recurring sale automation

### 2. **Buying Energy for Autorickshaw** (`buy_autorickshaw_charging`)
Scenario where user needs to charge their electric vehicle:
- User requests power purchase
- AI asks for quantity needed
- User doesn't know exact requirement
- AI asks for vehicle details
- AI calculates battery capacity
- AI suggests appropriate quantity
- AI presents top 3 seller offers with ratings
- User selects preferred offer
- AI confirms purchase

**Key Features:**
- Vehicle-specific recommendations
- Battery capacity calculations (Mahindra Treo: 7.4 kWh)
- Seller ratings (4/5+)
- Savings calculations

### 3. **Buying with Price Negotiation** (`buy_with_negotiation`)
Advanced scenario with automatic price negotiation:
- User sets price range (₹3.5 - ₹3.75)
- AI attempts purchase at lower price
- Seller rejects
- AI automatically negotiates higher within range
- Purchase confirmed at negotiated price

**Key Features:**
- Automatic price negotiation
- Fallback pricing strategy
- Real-time seller responses

### 4. **Balance Check** (`check_balance`)
User checking account status:
- Current balance display
- Available units for trading
- Recent transaction history
- Monthly savings breakdown
- Performance ranking

**Key Features:**
- Transaction history
- Savings analytics
- Gamification (top 15% ranking)

### 5. **Delivery Notifications** (`delivery_reminders`)
System-initiated reminders for energy delivery:
- 2-hour advance reminder
- Delivery start notification
- Delivery completion confirmation

**Key Features:**
- Time-based alerts
- Penalty warnings
- Motivational messaging

## Usage in Chatbot

### Importing the Data
```typescript
import { chatFlows, ChatFlow } from '../constants/chatMockData';
```

### Accessing Language-Specific Flows
```typescript
// Get all flows for a specific language
const hindiFlows = chatFlows['hi'];

// Get a specific scenario
const sellFlow = chatFlows['en'].find(flow => flow.id === 'sell_solar_energy');
```

### Rendering Messages
```typescript
sellFlow.messages.forEach(msg => {
    console.log(`${msg.sender}: ${msg.text}`);
});
```

## Data Structure

```typescript
interface ChatFlow {
    id: string;              // Unique scenario identifier
    scenario: string;        // Human-readable scenario name
    messages: Array<{
        sender: "user" | "assistant";
        text: string;
        timestamp?: number;
    }>;
}
```

## Translation Notes

### Currency
- All prices use Indian Rupee (₹) symbol
- Consistent pricing across languages

### Units
- Energy measured in kWh (kilowatt-hours)
- Time in 12-hour format (1 PM, 2 PM)

### Cultural Adaptations
- **Hindi**: Uses "Namaste" greeting
- **Tamil**: Uses "Vanakkam" greeting
- **Marathi**: Uses "Namaskar" greeting
- **Bengali**: Uses "Nomoshkar" greeting
- **Telugu**: Uses "Namaskaram" greeting

## Future Enhancements

### Planned Scenarios
1. **Grid Status Inquiry** - Checking grid health and availability
2. **Payment History** - Detailed transaction reconciliation
3. **Dispute Resolution** - Handling delivery/payment disputes
4. **Community Trading** - Peer-to-peer energy sharing
5. **Renewable Credits** - VC (Verifiable Credentials) management

### Additional Languages
- Kannada (kn)
- Malayalam (ml)
- Gujarati (gu)
- Punjabi (pa)

## Testing

### Sample Test Cases
```typescript
// Test 1: Verify all languages have same scenarios
const languages = ['en', 'hi', 'ta', 'mr', 'bn', 'te'];
languages.forEach(lang => {
    const flows = chatFlows[lang];
    console.assert(flows.length > 0, `${lang} has no flows`);
});

// Test 2: Verify message structure
const flow = chatFlows['en'][0];
console.assert(flow.messages.length > 0, 'Flow has no messages');
console.assert(flow.messages[0].sender === 'user' || flow.messages[0].sender === 'assistant');
```

## Integration with i18n

All key phrases are also available in the i18n service (`services/i18n.ts`) for dynamic translation:

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const greeting = t('namaste'); // Returns localized greeting
```

## Credits

Based on the energy trading demo video sequence specification, designed to showcase:
- Multi-language support (Sarvam AI integration)
- Smart AI recommendations
- Automatic negotiation
- Delivery tracking
- Payment reconciliation

---

**Last Updated**: February 10, 2026
**Version**: 1.0.0
