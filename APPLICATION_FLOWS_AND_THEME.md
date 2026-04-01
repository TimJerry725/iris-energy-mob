# Iris Energy Mobile App

## Overview

Iris Energy Mobile App is a role-based mobile experience for a peer-to-peer energy marketplace. The app is built with Expo, React Native, and Expo Router, and currently supports:

- onboarding and identity verification
- VC-based entry into buyer or seller experiences
- a buyer energy discovery flow
- a seller AI/chat assistant flow
- wallet, orders, and profile pages for both roles
- light mode by default, with a manual theme toggle

## Tech Stack

- `Expo`
- `React Native`
- `Expo Router`
- `TypeScript`
- `NativeWind`
- `Zustand`
- `react-i18next`
- `@expo/vector-icons` with a shared Font Awesome wrapper
- `react-native-svg`
- `react-native-safe-area-context`

## App Entry

The app entry route is:

- `/`

Current behavior:

- the root route redirects to `/(onboarding)/phone`

## Route Structure

### Onboarding routes

- `/(onboarding)/language`
- `/(onboarding)/phone`
- `/(onboarding)/otp`
- `/(onboarding)/profile`
- `/(onboarding)/user-type`
- `/(onboarding)/verification`
- `/(onboarding)/vc-access`

### Main app routes

- `/chatbot`
- `/chatbot/buyer-dashboard`
- `/chatbot/buyer-filters`
- `/chatbot/asset/[id]`
- `/chatbot/wallet`
- `/chatbot/orders`
- `/chatbot/profile`
- `/chatbot/settings`
- `/chatbot/marketplace`

## Current User Flows

## 1. Authentication and onboarding flow

Primary user flow:

1. User lands on `/(onboarding)/phone`
2. User enters a 10-digit phone number
3. User goes to `/(onboarding)/otp`
4. Test OTP is `0001`
5. User goes to `/(onboarding)/profile`
6. User enters profile details
7. User goes to `/(onboarding)/verification`
8. User verifies identity using VC options
9. User goes to `/(onboarding)/vc-access`
10. User chooses `Login as Buyer` or `Login as Seller`
11. User enters the role-based app

Optional language entry:

- user can open `/(onboarding)/language` from onboarding headers
- selected language is applied through `react-i18next`

## 2. Identity verification flow

The verification screen is `/(onboarding)/verification`.

This screen currently supports two top-level actions:

- `I already have VCs`
- `Get VCs from Provider`

### 2.1 Upload from device flow

This is currently a dummy flow.

Behavior:

1. User opens upload sheet
2. User taps `Upload from Device`
3. App shows a loading/verifying state
4. App creates a dummy VC object based on the selected user type
5. App marks the VC as verified
6. App routes to `/(onboarding)/vc-access`

Role detection behavior:

- if type is `buyer`, dummy VC exposes buyer access
- if type is `seller`, dummy VC exposes seller access
- otherwise dummy VC exposes both buyer and seller access

### 2.2 Provider-based VC flow

The provider option opens provider websites through `expo-web-browser`.

Current provider examples:

- TPDDL
- PVVNL
- BRPL

This flow currently acts as a placeholder / external link handoff, not a full in-app VC issuance workflow.

## 3. VC access routing flow

The VC access screen is `/(onboarding)/vc-access`.

This page gives two role-entry options:

- `Continue as Buyer`
- `Continue as Seller`

Current routing:

- buyer goes to `/chatbot/buyer-dashboard?role=buyer`
- seller goes to `/chatbot?role=seller`

## 4. Buyer app flow

Buyer home screen:

- `/chatbot/buyer-dashboard`

### Buyer bottom navigation

Buyer nav items:

- `Home`
- `Wallet`
- `Orders`
- `Profile`

### Buyer dashboard flow

The buyer dashboard is a listing-discovery screen focused on simple, non-technical language.

Main UI blocks:

- search bar
- filter button with active filter count
- summary cards for offers and filters
- filter chips
- compact offer cards

### Buyer offer card design

Each card is designed to be easier for common users to understand.

Current card content:

- offer / project name
- source label such as `Solar power`
- price shown as `Rs. X / unit`
- location
- available energy in `kWh`
- selling time slot
- power board / discom
- source type

Current time slot examples:

- Morning: `6 AM - 12 PM`
- Afternoon: `12 PM - 6 PM`
- Evening: `6 PM - 12 AM`
- Night: `12 AM - 6 AM`

Each buyer offer card has two actions:

- `More Details`
- `Buy Now`

### Buyer more-details flow

`More Details` routes to:

- `/chatbot/asset/[id]`

### Buyer buy-now flow

`Buy Now` routes to:

- `/chatbot/asset/[id]?mode=buy&role=buyer`

On this route:

- the asset details page shows a buy-ready message
- primary CTA becomes `Confirm Buy`
- confirm action routes to `/chatbot/orders?role=buyer`

## 5. Buyer filters flow

Buyer filters screen:

- `/chatbot/buyer-filters`

The filter state is stored in Zustand in:

- `stores/useBuyerFiltersStore.ts`

Supported filters:

- energy source
- maximum rate
- minimum quantity
- save money toggle
- preferred time
- discom

Current source filter options:

- Solar
- Battery
- Grid
- Hybrid
- Renewable

Current time filter options:

- Morning
- Afternoon
- Evening
- Night

Current discom options:

- All Discoms
- Tata Power DDL
- Adani Electricity
- BESCOM
- Yamuna Power

Current quantity presets:

- Any
- 10 kWh
- 50 kWh
- 100 kWh
- 200 kWh

## 6. Seller app flow

Seller home screen:

- `/chatbot`

### Seller bottom navigation

Seller nav items:

- `Home`
- `Buy`
- `Wallet`
- `Orders`
- `Profile`

### Seller home behavior

The seller home is an AI/chat assistant style screen.

Main capabilities:

- seller mode entry state
- quick action cards
- assistant chat messages
- message suggestions
- input composer
- slide-out sidebar

Seller quick actions currently include:

- Sell Energy
- Market Prices
- Smart Trade
- Wallet

Sidebar functions currently include:

- new chat
- theme toggle
- marketplace entry
- recent chats

### Seller buy tab behavior

The seller `Buy` tab routes to the buyer dashboard with seller role context:

- `/chatbot/buyer-dashboard?role=seller`

This allows sellers to browse and purchase power using the same listings UI.

## 7. Shared secondary flows

### Wallet

Route:

- `/chatbot/wallet`

Used by:

- buyer
- seller

Current content:

- available balance summary
- add funds action
- withdraw action
- carbon credits summary
- energy volume summary
- recent transaction list

### Orders

Route:

- `/chatbot/orders`

Used by:

- buyer
- seller

Current content:

- open orders summary
- monthly order summary
- role-based order list
- status chips such as active, scheduled, pending, completed

### Profile

Route:

- `/chatbot/profile`

Used by:

- buyer
- seller

Current content:

- profile summary
- theme toggle
- verified account info
- language info
- support entry

## 8. Asset details flow

Route:

- `/chatbot/asset/[id]`

Current content:

- back navigation
- asset name and symbol
- current price
- price trend graph
- location
- capacity
- descriptive summary
- action buttons

Modes:

- normal details mode
- buy mode

Buy mode behavior:

- shows a buy intent message
- switches CTA to `Confirm Buy`
- routes into orders after confirmation

## 9. Marketplace and settings

These routes exist as supporting screens:

- `/chatbot/marketplace`
- `/chatbot/settings`

### Marketplace

Current purpose:

- market-style exploration view
- search
- price movements
- charts / graph styling

### Settings

Current purpose:

- appearance settings
- language selection
- lightweight profile information

Note:

- the newer tab-based profile screen is now the primary profile destination for buyer and seller flows

## Navigation Model

## 1. Bottom navigation

The shared bottom nav component is:

- `components/AppBottomNav.tsx`

Behavior:

- role-based tabs
- fixed to bottom of screen
- safe-area aware
- separate active-tab highlighting

## 2. Screen layout system

The shared screen wrapper is:

- `components/IrisScreen.tsx`

Current layout rules:

- safe-area aware
- shared light/dark background
- default horizontal page padding: `16px`
- default vertical page padding: `16px`

## Theme System

Theme provider:

- `context/ThemeContext.tsx`

Current theme behavior:

- app starts in `light` mode by default
- user can toggle between `light` and `dark`
- palette is shared via context

## Brand gradient colors

These colors come from the upper-arrow logo gradient and are used as brand colors in both themes:

- `Primary`: `#00E673`
- `Secondary`: `#1FD0B4`
- `Tertiary`: `#3EBAF4`

## Light mode palette

- `primary`: `#00E673`
- `secondary`: `#1FD0B4`
- `tertiary`: `#3EBAF4`
- `onPrimary`: `#04150E`
- `onSecondary`: `#061514`
- `onTertiary`: `#071823`
- `background`: `#F6FBFA`
- `foreground`: `#0F1F1D`
- `card`: `#EBF2F1`
- `muted`: `#4A5E5B`
- `border`: `#D6E4E2`
- `success`: `#00E673`
- `danger`: `#D64545`
- `warning`: `#B7791F`

## Dark mode palette

- `primary`: `#00E673`
- `secondary`: `#1FD0B4`
- `tertiary`: `#3EBAF4`
- `onPrimary`: `#04150E`
- `onSecondary`: `#061514`
- `onTertiary`: `#071823`
- `background`: `#071514`
- `foreground`: `#F3FFFC`
- `card`: `#132A28`
- `muted`: `#9AB5B1`
- `border`: `#21403C`
- `success`: `#00E673`
- `danger`: `#FF7B7B`
- `warning`: `#FFC857`

## Color usage guidance in the current app

- `primary` is the main green action color
- `secondary` is used for supporting status and accent surfaces
- `tertiary` is used for alternate CTAs and buyer-side highlights
- `background` is the full-screen background
- `card` is the main surface color for blocks and cards
- `foreground` is the default readable text color
- `muted` is used for secondary labels and helper text
- `border` is used for dividers and card outlines
- `success`, `danger`, and `warning` support status messaging

## Icons

The app currently uses a shared icon wrapper in:

- `components/AppIcons.tsx`

The wrapper is based on:

- `FontAwesome6` from `@expo/vector-icons`

This wrapper is used across onboarding and main-app screens for icon consistency.

## Current Data Model Notes

The buyer marketplace currently uses static demo market data from:

- `constants/marketData.ts`

Current example asset types:

- solar
- wind
- grid
- hydro

Additional derived listing metadata is currently mapped in the buyer filter store:

- quantity per asset
- discom per asset
- time slot per asset

This means some values shown in the buyer listing cards are mocked or mapped demo values rather than coming from a backend.

## Important Current Assumptions

- phone verification is mock-driven with OTP `0001`
- VC upload from device is currently a dummy verification flow
- provider-based VC acquisition is currently a browser handoff
- buyer and seller content is largely demo / prototype content
- orders, wallet, and profile use static sample data
- the asset purchase confirmation currently routes to the orders screen rather than a real checkout backend

## Current UX conventions

- light mode is the default startup mode
- bottom navigation is fixed at the bottom of buyer and seller app pages
- standard horizontal screen padding is `16px`
- onboarding screens use simple step-by-step progression
- buyer listing cards prefer simple everyday language over trading-heavy wording

## Suggested Future Documentation Expansion

If needed, this document can be extended later with:

- component inventory
- state management map
- API integration plan
- backend contract expectations
- VC validation and wallet integration architecture
- localization coverage
- test strategy
