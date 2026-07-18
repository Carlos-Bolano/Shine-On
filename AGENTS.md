# Shine On — Agent Instructions

## Source of Truth

- Base every implementation decision on `shine-on-product.md`.
- Preserve the product identity: premium, minimal, emotional, and "Colorful Calm".
- Treat this repository as a mobile-first Expo app. The product vision is iOS + Android, but the current project prioritizes Android and does not need web support.

## Mandatory Technical Rules

### Expo Version

- Always use **Expo SDK 54.0.0**.
- Read versioned docs from https://docs.expo.dev/versions/v54.0.0/ before adding or changing framework-specific code.

### Architecture Principles

1. **Feature-Driven Modular Architecture**: Organize code by feature under `src/features/`.
2. **Repository Pattern**: All phrase/category data access must go through `PhrasesRepository`.
3. **Strict Separation of Concerns**:
   - UI components are presentational and reusable.
   - Business logic belongs in features, services, and hooks.
   - Components must not access storage, notifications, APIs, or databases directly.
4. **SOLID Principles**: Prefer small, maintainable units with clear responsibilities.
5. **Hook-Based Composition**: Expose use cases through hooks such as `usePhrases` and `useOnboardingSettings`.

## Directory Structure

```text
src/
├── core/                   # Shared infrastructure
│   ├── theme/              # Design tokens, gradients, spacing, typography
│   ├── storage/            # Local persistence abstraction (AsyncStorage)
│   └── database/           # Interfaces, repositories, adapters
├── components/             # Pure atomic UI components
│   ├── GradientBackground.tsx
│   ├── PremiumButton.tsx
│   └── Typography.tsx
└── features/               # Self-contained product modules
    ├── onboarding/
    ├── feed/
    ├── customizer/
    └── notifications/
```

## Product Identity

### Brand

- Product name: **Shine On**
- Visual vibe: **Colorful Calm**
- Experience target: premium, polished, soft, emotional, and highly tactile
- Primary accent: `#ee5f2b`
- Selected category highlight: bright orange around `#F35C2B`

### Typography

- UI text uses **Plus Jakarta Sans**
- Quotes and emotional copy use **Instrument Serif**
- Load fonts at app startup with `expo-font`
- Prefer native italic variants instead of simulated italics

### Visual Language

- Use gradients defined in `src/core/theme/index.ts`
- Prioritize smooth state-driven transitions and subtle animated feedback
- Design for full-screen, immersive compositions with generous spacing
- Keep visuals minimal, but not plain

## Data Strategy

### Current Phase: Local Mock Engine

- The app currently runs entirely on local structured data.
- Use `src/core/database/mockData.ts` as the source of phrases and categories.
- Persist onboarding settings, likes, and timing preferences locally with `AsyncStorage`.
- Do not introduce network calls for core phrase flows in this phase.

### Future Phase: Supabase Adapter

- Keep data flows repository-driven so the app can swap from mocks to Supabase without changing screens.
- Future integrations must implement the same `PhrasesRepository` contract.
- Plan for RLS-compatible models and adapters, but do not couple the UI to Supabase now.

### Repository Contract

```ts
export interface PhrasesRepository {
  getCategories(): Promise<Category[]>;
  getPhrases(categoryIds?: string[]): Promise<Phrase[]>;
  toggleLike(phraseId: string): Promise<void>;
}
```

## Feature Requirements

### 1. Onboarding

- Flow order: Welcome -> Category Selection -> Rhythm Configuration -> Notification Permission
- Welcome screen must use a dynamic gradient background, a minimal sun illustration, and the copy: `"A ray of light for your day ✨"`
- Category selection is multi-select with the six MVP categories: `Self-Love`, `Growth`, `Calm`, `Focus`, `Confidence`, `Gratitude`
- Selected cards should show animated scale feedback, a bright orange border, and a subtle confirmation checkmark
- Rhythm configuration must let the user choose `1` to `5` notifications per day and a safe time range
- On completion, request notification permissions and persist `hasCompletedOnboarding: true`
- Persist selected categories, frequency, and time range locally
- Use haptic feedback on key interactions

### 2. Feed

- Use a vertical full-screen list with `pagingEnabled`
- Show one phrase per screen, centered and highly readable
- Adapt the background gradient to the phrase category
- Include a floating action bar for:
  - `Like / Me toco`
  - `Hazla tuya / Customize`
  - `Compartir / Share`
- Likes must persist locally in the current phase
- Keep feed rendering smooth and optimized for 60fps behavior

### 3. Customizer

- Build a 9:16 preview canvas sized for Stories-style export
- The canvas should include the Shine On logo, decorative quote mark, phrase, author, and dynamic signature
- Allow editing of the signature text in real time
- Provide background presets: `Dopamine`, `Grainy`, `Cloudy`, `Pastel`, `Silk`
- Provide font options: `Jakarta Sans`, `Modern Serif`, `Classic Mono`
- Export with `react-native-view-shot`
- Save to gallery with `expo-media-library`, preferably inside a `Shine On` album
- Allow native sharing after capture/export

### 4. Notifications

- Use `expo-notifications` compatible with Expo SDK 54
- Schedule local notifications based on selected categories, daily frequency, and time range
- Divide the selected time range into even intervals and place notification times within that range
- Notification content must match the user's selected categories
- Notification triggers must include an explicit `type`, such as `type: 'daily'`
- When required by the SDK/platform behavior, include Android-safe scheduling fields like channel configuration

## Data Models

### Category

```ts
interface Category {
  id: string;
  name: string;
  icon: string;
  colorLight: string;
  colorDark: string;
  iconColor: string;
  gradients: string[];
}
```

### Phrase

```ts
interface Phrase {
  id: string;
  text: string;
  author: string;
  categoryId: string;
  createdAt: string;
  isActive: boolean;
  likes: number;
}
```

## Non-Functional Requirements

- Maintain smooth, premium-feeling interactions and transitions
- Target 60fps visual performance for the vertical feed
- Use `expo-haptics` for important presses, selections, and confirmation moments
- Use `SafeAreaView` from `react-native-safe-area-context` for Android notch-safe layouts
- Avoid unnecessary re-renders in full-screen feed or animated surfaces
- Keep UI components pure and portable

## Dependencies to Prefer

- `expo-router` for routing
- `expo-linear-gradient` for backgrounds
- `@react-native-async-storage/async-storage` for persistence
- `expo-notifications` for local notifications
- `expo-media-library` for saving images
- `react-native-view-shot` for capture/export
- `expo-haptics` for tactile feedback
- `@expo-google-fonts/plus-jakarta-sans`
- `@expo-google-fonts/instrument-serif`
- `expo-font` for font loading

## Implementation Guardrails

- Do not add direct network logic inside screens or presentational components
- Do not bypass repositories with ad hoc data reads
- Do not introduce web-only patterns or styling assumptions
- Keep code aligned with the repository's feature-first structure
- When the spec and existing project behavior differ, prefer the documented project constraints needed for the current codebase while preserving the product intent
