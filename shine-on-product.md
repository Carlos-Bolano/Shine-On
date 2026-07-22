# 🌟 SHINE ON — PRODUCT & TECHNICAL SPECIFICATION (MVP v1)

## 1. 📌 Visión General y Alcance

- **Nombre del Producto:** Shine On
- **Propósito:** Un refugio personal e íntimo de motivación e inspiración diaria. Evita mecánicas sociales intrusivas (sin seguidores, likes públicos ni comentarios) para mantener un espacio limpio, enfocado en el autocuidado.
- **Plataforma:** Aplicación móvil multiplataforma (iOS y Android) desarrollada con React Native (Expo).
- **Editor de Código:** Trae.ai.
- **Enfoque de Diseño:** Interfaz premium, minimalista y emocional (_Colorful Calm_), con fondos de gradientes suaves, animaciones fluidas y transiciones dinámicas.

---

## 2. 🏛️ Arquitectura del Software y Navegación

El proyecto se estructurará bajo una **Arquitectura Modular basada en Características (Feature-Driven Modular Architecture)** y principios SOLID.

### 🧭 Estructura de Navegación Principal

- **Navbar Superior (Header):** Presente en las pantallas principales con el logo '✨ Shine On' y acceso directo al modal de **Settings (Ajustes)**.
- **Bottom Tabs (Barra Flotante Inferior):**
  1. **🏠 Home (Dashboard):** Pantalla de inicio con saludo personalizado, la Frase del Día y el mapa de lectura.
  2. **🎴 Feed:** Scroll vertical infinito con el catálogo de frases e interacciones.
  3. **🖼️ Mis Frases (Colección):** Biblioteca privada con frases guardadas y creaciones propias.

### 📁 Estructura del Directorio (`src/`)

src/
├── assets/ # Fuentes tipográficas, iconos vectoriales y branding
├── core/ # Infraestructura global compartida
│ ├── theme/ # Design Tokens (colores, espaciados, tipografías)
│ ├── storage/ # Abstracción de persistencia local (MMKV / AsyncStorage)
│ └── database/ # Interfaces, repositorios y mocks
├── components/ # UI Components atómicos (Button, Typography, GradientView)
└── features/ # Módulos auto-contenidos (Feature-Driven)
├── onboarding/ # Bienvenida, captura de nombre/email, categorías y rangos horarios
├── home/ # Dashboard, Frase del Día y Mapa de Iluminación Diaria
├── feed/ # Feed vertical dinámico estilo tarjeta
├── customizer/ # Lienzo interactivo 9:16 (edición de plantilla y creación desde cero)
├── collection/ # Biblioteca privada (Guardadas / Mis Creaciones)
├── settings/ # Modal de configuración (idioma, notificaciones, perfil)
└── notifications/ # Orquestador de alarmas y notificaciones locales

---

## 3. 🔄 Estrategia de Datos e Idiomas (Local-First)

Para mantener la máxima agilidad en la primera fase, el proyecto adoptará una filosofía **Local-First** sin autenticación obligatoria.

### 🌐 Estrategia de Idiomas (Bilingüe Estricto)

- Cada frase cargada en el catálogo público debe incluir obligatoriamente el contenido en **Español (`es`) e Inglés (`en`)**.
- La app renderiza automáticamente el texto según el idioma seleccionado por el usuario en el modal de _Settings_.

---

## 4. 🧬 Flujos y Funcionalidades del MVP (Detalle de Pantallas)

### 4.1 Onboarding Experiencial (4 Pasos)

1. **Bienvenida:** Pantalla atmosférica con la propuesta de valor (_"A ray of light for your day ✨"_).
2. **Personalización del Usuario:**
   - Input para el **Nombre** (obligatorio): Usado para saludar en el Home y firmar las imágenes exportadas.
   - Input para el **Correo** (opcional): Captura ligera para boletines/actualizaciones sin requerir registro de contraseña.
3. **Selección de Categorías:** Grid interactivo para elegir categorías de interés (_Self-Love, Growth, Calm, Focus, Confidence, Gratitude_).
4. **Frecuencia y Horarios:** Configuración de cantidad de notificaciones diarias (1 a 5) y rango activo (ej. 08:00 AM a 09:00 PM). Solicitud de permisos locales.

### 4.2 Home / Dashboard (Pantalla de Inicio)

- **Saludo Dinámico:** Personalizado según la hora y el nombre del usuario (ej. _"Good morning, Carlos"_).
- **Frase del Día (Hero Card):** Una tarjeta destacada con gradiente especial que rota estrictamente cada 24 horas. Incluye accesos directos a compartir o abrir en el editor.
- **Mapa de Iluminación Diaria (Retention Tracker):** Malla/grilla horizontal inspirada en las contribuciones de GitHub pero en tonos cálidos (`#F35C2B`). Registra los días que el usuario ha abierto la app o leído frases.
- **Acceso Rápido por Categorías:** Carrusel horizontal con accesos directos a filtrar frases.

### 4.3 Feed Vertical de Frases

- Scroll vertical continuo de pantalla completa (`pagingEnabled`).
- **Personalidad Visual:** Cada frase se renderiza aplicando su propio `QuoteStyle` (fuente, alineación, color de texto y gradiente predeterminado).
- **Barra de Acciones Flotante:**
  - **❤️ "Me tocó" (Like):** Guarda la frase en la biblioteca local.
  - **✨ "Hazla tuya" (Style):** Navega al editor con la frase activa precargada.
  - **📤 "Compartir":** Menú nativo del sistema.

### 4.4 Editor "Make It Yours" (Personalizador + Creador desde Cero)

- **Lienzo 9:16 (Preview para Stories):** Renderiza el logo de Shine On, el texto, el autor y la firma (_"shared by [Nombre]"_).
- **Dos Modos de Operación:**
  1. _Modo Edición:_ Modifica el estilo de una frase existente del Feed o Home para exportar a Stories.
  2. _Modo Creación (Lienzo en Blanco):_ Se abre desde la pestaña de _Mis Frases_. Permite escribir una frase original, personalizar la tipografía, fondo y colores, y guardarla en la colección personal con `isCustom: true`.
- **Exportador:** Renderizado de alta resolución con `react-native-view-shot` para guardar en la galería o compartir en Instagram/TikTok.

### 4.5 Mis Frases / Biblioteca Privada

- **Pestaña doble (Segmented Control):**
  - _Guardadas:_ Frases del catálogo público marcadas con "Me tocó".
  - _Mis Creaciones:_ Frases escritas por el usuario desde el lienzo en blanco.
- **Boton Flotante (FAB):** Acceso rápido para escribir una nueva frase desde cero.

### 4.6 Modal de Ajustes (Settings)

- **Idioma de la App:** Selector dinámico entre Español e Inglés.
- **Gestión de Notificaciones:** Reconfiguración de frecuencia, rango horario y categorías.
- **Datos Personales:** Modificación del nombre y correo del usuario.

---

## 5. 🗄️ Modelo de Datos y Tipos (TypeScript)

export interface QuoteStyle {
fontFamily: 'JakartaSans' | 'ModernSerif' | 'Cormorant';
fontSize: 'sm' | 'md' | 'lg';
textAlign: 'left' | 'center' | 'right';
textColor: string;
backgroundColor: string; // Token de gradiente ('Dopamine', 'Cloudy', etc.)
showQuotes: boolean;
showLogo: boolean;
}

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
isCustom?: boolean; // true si fue creada localmente por el usuario
createdAt: string;
}

export interface UserProfile {
name: string;
email?: string;
hasCompletedOnboarding: boolean;
selectedCategories: string[];
notificationFrequency: number; // 1 - 5
activeHours: {
from: string; // "08:00 AM"
until: string; // "09:00 PM"
};
language: 'es' | 'en';
}

export interface DailyActivity {
date: string; // Formato 'YYYY-MM-DD'
count: number;
}

---

## 6. 🛠️ Requerimientos No Funcionales y Experiencia de Usuario

- **Respuesta Háptica (`expo-haptics`):** Vibraciones ligeras y sutiles al pulsar botones principales, cambiar categorías o guardar frases.
- **Rendimiento Visual:** Mantenimiento de 60fps en el Feed vertical mediante `FlashList` u optimización de componentes.
- **Widgets Nativos (Roadmap MVP):** Preparar la persistencia de la "Frase del Día" para habilitar la lectura desde un Widget de pantalla de inicio en iOS y Android.
