# Shine On

Shine On es una app movil construida con Expo y React Native para entregar frases inspiradoras mediante una experiencia premium, emocional y minimalista.

## Producto

- Vibe visual: `Colorful Calm`
- Plataforma objetivo actual: Android
- Navegacion: `expo-router`
- Fuente de verdad funcional: `shine-on-product.md`
- Fase actual de datos: mocks locales + persistencia con `AsyncStorage`

## Arquitectura

El repositorio sigue una arquitectura modular orientada a features:

```text
app/                    # Routing con Expo Router
src/components/         # UI reutilizable y presentacional
src/core/               # Infraestructura compartida
src/features/           # Modulos de producto
```

Regla principal:

- `app/` enruta
- `src/features/` implementa producto
- `src/core/` centraliza datos, storage, tema y contratos

## Features del MVP

- Onboarding secuencial
- Feed vertical full-screen
- Customizer 9:16 para stories
- Notificaciones locales por categorias y rango horario

## Stack

- Expo SDK `54`
- React Native + TypeScript
- `expo-router`
- `expo-linear-gradient`
- `expo-notifications`
- `expo-media-library`
- `react-native-view-shot`
- `expo-haptics`
- `@react-native-async-storage/async-storage`

## Scripts

```bash
npm install
npm run android
npm run lint
```

## Documentos clave

- `shine-on-product.md`: especificacion funcional y tecnica
- `AGENTS.md`: reglas operativas del repositorio
- `commit-plan.md`: estrategia para reconstruccion y agrupacion de commits por intencion
