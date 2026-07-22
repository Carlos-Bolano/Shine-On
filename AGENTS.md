# Shine On — Agent Instructions

## Source of Truth

- Base every implementation decision strictly on `shine-on-product.md`[cite: 1].
- Preserve the product identity: premium, minimal, emotional, personal sanctuary, and "Colorful Calm"[cite: 1].
- Treat this repository as a mobile-first Expo app. The product vision targets iOS + Android, prioritizing Android local development without web support[cite: 1].

## Mandatory Technical Rules

### Expo Version

- Always use **Expo SDK 54.0.0**[cite: 1].
- Read versioned docs from https://docs.expo.dev/versions/v54.0.0/ before adding or changing framework-specific code.

### Architecture Principles

1. **Feature-Driven Modular Architecture**: Organize code strictly by feature under `src/features/`[cite: 1].
2. **Repository Pattern**: All quote, category, activity, and user data access must go through `QuotesRepository`[cite: 1].
3. **Strict Separation of Concerns**:
   - UI components are presentational and reusable[cite: 1].
   - Business logic belongs exclusively in features, services, and custom hooks[cite: 1].
   - Components must not access storage, notifications, APIs, or databases directly[cite: 1].
4. **SOLID Principles**: Prefer small, maintainable units with single responsibilities[cite: 1].
5. **Hook-Based Composition**: Expose use cases through hooks such as `useQuotes`, `useUserProfile`, and `useOnboardingSettings`[cite: 1].

## Directory Structure

src/
├── assets/ # Typography, vector icons, branding assets[cite: 1]
├── core/ # Shared infrastructure[cite: 1]
│ ├── theme/ # Design tokens, gradients, spacing, typography[cite: 1]
│ ├── storage/ # Local persistence abstraction (AsyncStorage / MMKV)[cite: 1]
│ └── database/ # Interfaces, repositories, adapters, and mock data[cite: 1]
├── components/ # Pure atomic UI components (Button, Typography, GradientBackground)[cite: 1]
└── features/ # Self-contained product modules[cite: 1]
├── onboarding/ # Welcome, user name/email capture, categories, active hours[cite: 1]
├── home/ # Dashboard, Quote of the Day, Daily Light Map (GitHub-style streak)[cite: 1]
├── feed/ # Vertical paging feed with dynamic QuoteStyles[cite: 1]
├── customizer/ # 9:16 Canvas (editing existing quotes & blank canvas creations)[cite: 1]
├── collection/ # Private sanctuary (Saved quotes & My Creations)[cite: 1]
├── settings/ # Modal sheet (language toggle, notifications, profile)[cite: 1]
└── notifications/ # Local notification scheduler and triggers[cite: 1]

## Product Identity & Navigation

### Brand & Visual Language

- Product name: **Shine On**[cite: 1]
- Visual vibe: **Colorful Calm**[cite: 1]
- Experience target: personal sanctuary, warm, polished, soft, emotional, tactile[cite: 1]
- Primary accent: `#ee5f2b` / `#F35C2B`[cite: 1]
- Gradients: Use tokens defined in `src/core/theme/`[cite: 1]
- Prioritize smooth state-driven transitions and tactile feedback[cite: 1]

### Navigation Layout

- **Top Navbar Header:** Features logo '✨ Shine On' and gear icon opening the Settings Modal sheet[cite: 1].
- **Bottom Navigation Bar (Floating Capsule):**
  1. `Home`: Dashboard with greeting, Quote of the Day, and Daily Light Map[cite: 1].
  2. `Feed`: Vertical infinite scroll[cite: 1].
  3. `My Collection`: Private library (Saved & My Creations)[cite: 1].

### Typography

- UI text uses **Plus Jakarta Sans**[cite: 1]
- Quotes and emotional copy use **Instrument Serif** or **Cormorant**[cite: 1]
- Load fonts at app startup with `expo-font`[cite: 1]

## Data Strategy (Local-First)

### Current Phase: Local Engine

- The app operates **Local-First** with no mandatory registration or remote authentication[cite: 1].
- Source catalog data lives in `src/core/database/mockData.ts`[cite: 1].
- Persist user profile, custom quotes, likes, settings, and daily activity logs locally[cite: 1].

### Strict Bilingual Rules (i18n)

- All catalog quotes **MUST** provide both Spanish (`es`) and English (`en`) texts (`QuoteText`)[cite: 1].
- The active UI language is controlled in `UserProfile` (`es` | `en`) and toggled via the Settings Modal[cite: 1].

### Repository Contract (`QuotesRepository`)

export interface QuotesRepository {
getCategories(): Promise<Category[]>;
getQuotes(categoryIds?: string[]): Promise<Quote[]>;
getQuoteOfTheDay(): Promise<Quote>;
toggleLike(quoteId: string): Promise<void>;
saveCustomQuote(quote: Omit<Quote, 'createdAt' | 'id'>): Promise<Quote>;
getSavedQuotes(): Promise<Quote[]>;
getUserCreations(): Promise<Quote[]>;
getDailyActivity(): Promise<DailyActivity[]>;
recordActivityToday(): Promise<void>;
}

## Feature Implementation Details

### 1. Onboarding (4 Steps)

1. **Welcome:** Atmosphere screen (`"A ray of light for your day ✨"`)[cite: 1].
2. **User Personalization:**
   - **Name (Mandatory):** Used for personalized greetings and Story signatures[cite: 1].
   - **Email (Optional):** Lightweight newsletter opt-in field without password friction[cite: 1].
3. **Category Selection:** Multi-select grid (`Self-Love`, `Growth`, `Calm`, `Focus`, `Confidence`, `Gratitude`)[cite: 1].
4. **Active Hours & Notifications:** Frequency (1–5 times/day) and active time window (e.g., 08:00 AM - 09:00 PM)[cite: 1]. Request permissions and persist `hasCompletedOnboarding: true`[cite: 1].

### 2. Home / Dashboard

- **Dynamic Greeting:** Time-based greeting with user's name (e.g., _"Good morning, Carlos"_)[cite: 1].
- **Quote of the Day (Hero Card):** Featured card with special gradient, rotating every 24 hours[cite: 1]. Includes quick action to share or customize[cite: 1].
- **Daily Light Map (Retention Tracker):** Horizontal activity graph (GitHub commit-style heatmap) using warm orange dots (`#F35C2B`) tracking active reading days[cite: 1].

### 3. Feed

- Full-screen vertical list with `pagingEnabled` or optimized `FlashList`[cite: 1].
- Dynamically apply each quote's individual `QuoteStyle` (font family, text alignment, colors, background tokens)[cite: 1].
- Floating action bar: `Like (Me tocó)`[cite: 1], `Make It Yours (Style)`[cite: 1], and `Share`[cite: 1].

### 4. Customizer ("Make It Yours")

- 9:16 Story canvas container rendering logo, quote, author, and signature (_"shared by [Name]"_)[cite: 1].
- **Dual Mode:**
  1. _Edit Mode:_ Modifies pre-existing quotes for Story export[cite: 1].
  2. _Create Mode (Blank Canvas):_ Opened via FAB in My Collection[cite: 1]. Allows writing custom text, formatting styling, and saving locally with `isCustom: true`[cite: 1].
- Export high-resolution images via `react-native-view-shot`[cite: 1].

### 5. My Collection (Sanctuary)

- Top segmented control tabs: `Saved Quotes` vs. `My Creations`[cite: 1].
- Floating Action Button (FAB) at bottom-right to write a new custom quote[cite: 1].

### 6. Settings Modal

- Modal sheet overlay triggered from top header[cite: 1].
- Contains Language switcher (`es` / `en`), Notification frequency, Active Hours, and Profile editor[cite: 1].

## Data Models

### QuoteStyle

export interface QuoteStyle {
fontFamily: 'JakartaSans' | 'ModernSerif' | 'Cormorant';
fontSize: 'sm' | 'md' | 'lg';
textAlign: 'left' | 'center' | 'right';
textColor: string;
backgroundColor: string;
showQuotes: boolean;
showLogo: boolean;
}

### Quote

export interface QuoteText {
en: string;
es: string;
}

export interface Quote {
id: string;
text: QuoteText;
author: string;
categoryId: string;
style: QuoteStyle;
isCustom?: boolean;
createdAt: string;
}

### UserProfile

export interface UserProfile {
name: string;
email?: string;
hasCompletedOnboarding: boolean;
selectedCategories: string[];
notificationFrequency: number;
activeHours: {
from: string;
until: string;
};
language: 'es' | 'en';
}

### DailyActivity

export interface DailyActivity {
date: string; // 'YYYY-MM-DD'
count: number;
}

## Non-Functional Guardrails

- Target smooth 60fps visual performance[cite: 1].
- Use `expo-haptics` for tactile feedback on selections and actions[cite: 1].
- Use `SafeAreaView` from `react-native-safe-area-context` for Android notch-safe layouts[cite: 1].
- Never add direct network logic inside UI screens or presentational components[cite: 1].
- Never bypass repository interfaces[cite: 1].
