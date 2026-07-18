# 🌟 SHINE ON — PRODUCT & TECHNICAL SPECIFICATION (MVP v1)

## 1. 📌 Visión General y Alcance

* **Nombre del Producto:** Shine On
* **Plataforma:** Aplicación móvil multiplataforma (iOS y Android) desarrollada con React Native (Expo).
* **Editor de Código:** Trae.ai.
* **Enfoque de Desarrollo:** Interfaz premium, minimalista y emocional (*Colorful Calm*), con animaciones fluidas y transiciones dinámicas basadas en el estado.

---

## 2. 🏛️ Arquitectura del Software

Para garantizar la escalabilidad, la mantenibilidad y evitar el acoplamiento, el proyecto se estructurará bajo una **Arquitectura Modular basada en Características (Feature-Driven Modular Architecture)** y se guiará por principios SOLID.

### 📁 Estructura del Directorio de Trabajo

```text
src/
├── assets/                 # Fuentes tipográficas, iconos vectoriales y branding
├── core/                   # Infraestructura global compartida
│   ├── theme/              # Design Tokens (colores, espaciados, tipografías)
│   ├── storage/            # Abstracción de persistencia local (MMKV / AsyncStorage)
│   └── database/           # Capa de datos abstracta (Interfaces y adaptadores)
├── components/             # UI Components atómicos y puros (sin lógica de negocio)
│   ├── Button/             # Botones premium con respuestas animadas
│   ├── GradientView/       # Renderizado de gradientes dinámicos
│   └── Typography/         # Wrapper unificado de fuentes (Serif para frases, Sans para UI)
└── features/               # Módulos auto-contenidos (Feature-Driven)
    ├── onboarding/         # Flujo de configuración inicial, selección y rango horario
    ├── feed/               # Feed vertical infinito con gestos e interacciones
    ├── customizer/         # Lienzo interactivo 9:16 de edición y exportación
    └── notifications/      # Lógica de programación y alarmas locales
```

---

## 3. 🔄 Estrategia de Datos en Fases

Para asegurar una construcción ágil de la UI, el sistema de datos se divide en dos fases bien definidas. La app utilizará un **patrón Repository** para que el cambio de fase sea invisible para las pantallas y componentes.

```typescript
// src/core/database/phrasesRepository.ts
export interface PhrasesRepository {
  getPhrases(categories: string[]): Promise<Phrase[]>;
  toggleLike(phraseId: string): Promise<void>;
  getCategories(): Promise<Category[]>;
}
```

### 📍 Fase 1: Motor Local (Mock Data) — *ESTADO ACTUAL*
Durante esta fase, toda la aplicación consumirá datos estáticos estructurados localmente. No se realizarán peticiones de red externas. 
* **Origen de Datos:** Archivo estático `src/core/database/mocks.ts`.
* **Persistencia Local:** Preferencias del onboarding, frases favoritas ("Me tocó") y configuraciones del temporizador se guardarán de manera local utilizando almacenamiento rápido (MMKV o AsyncStorage).

### 📍 Fase 2: Integración Externa (Supabase) — *FUTURO*
Una vez que la UI, las transiciones y la lógica local estén perfeccionadas al 100%, se creará un adaptador para conectar los servicios a Supabase utilizando la SDK cliente y PostgreSQL.
* Se implementará la misma interfaz `PhrasesRepository` mapeando las llamadas hacia las tablas de Supabase.
* Se activará el mecanismo Row Level Security (RLS) en Supabase para proteger los datos.

---

## 4. 🧬 Flujos y Funcionalidades del MVP (Detalle de Implementación)

### 4.1 Onboarding Experiencial e Interactivo
El onboarding debe comportarse como un flujo secuencial controlado por un estado local persistente.

1. **Pantalla de Bienvenida:**
   * **Visual:** Degradado dinámico de fondo (vibe *Colorful Calm*), ilustración minimalista del sol.
   * **Copy:** *"A ray of light for your day ✨"*
   * **Comportamiento:** Botón de acción principal con animación de escala al presionar.
2. **Selección de Categorías:**
   * **Grid de Selección:** Multi-select visual con tarjetas animadas.
   * **Categorías MVP:** *Self-Love, Growth, Calm, Focus, Confidence, Gratitude*.
   * **UI/UX:** Al seleccionar una tarjeta, se debe activar un borde naranja brillante (`#F35C2B`), una escala táctil y un checkmark sutil de confirmación.
3. **Rhythm Configuration (Frecuencia y Horarios):**
   * **Frecuencia:** Slider personalizado que permite seleccionar entre 1 y 5 notificaciones al día.
   * **Rango Horario:** Selector visual de rango (ej. *From 08:00 AM to 09:00 PM*) para evitar interrumpir las horas de descanso del usuario.
4. **Activación de Permisos:**
   * Al presionar "Comenzar a brillar" / "Continue Journey", se solicitarán formalmente los permisos del sistema para notificaciones locales.
   * Al completarse con éxito, se guardará la bandera `hasCompletedOnboarding: true` en el almacenamiento local para redirigir siempre al Feed en los siguientes inicios de la app.

### 4.2 Feed Vertical de Frases (Paging UI)
* **Comportamiento del scroll:** Scroll vertical continuo de pantalla completa (`pagingEnabled` nativo o `FlashList` optimizado).
* **Presentación:** Cada pantalla muestra una sola frase renderizada con una tipografía Serif elegante y legible, alineada al centro.
* **Fondo Dinámico:** El gradiente de fondo se adaptará estéticamente según la categoría asignada a la frase (ej. gradiente lavanda para *Calm*, coral para *Self-Love*).
* **Barra de Acciones Flotante:**
  * **❤️ Botón "Me tocó" (Like):** Incrementa un contador local con feedback háptico. El estado "Liked" se persiste localmente en esta fase.
  * **✨ Botón "Hazla tuya" (Style):** Navega al editor de personalización inyectando la frase y el autor activos.
  * **📤 Botón "Compartir":** Lanza la hoja de compartir nativa del sistema operativo.

### 4.3 Editor de Personalización ("Make It Yours")
Una funcionalidad viral clave para exportar e interactuar con la marca.

* **Lienzo de Previsualización (Canvas):** Un contenedor con relación de aspecto de aspecto 9:16 (ajustado para Stories) que contiene:
  * Logo minimalista de *Shine On* en la parte superior.
  * Símbolo estético de comillas.
  * La frase seleccionada y su autor.
  * Firma dinámica: *"shared by [Nombre del usuario] via Shine On"*
* **Controles de Edición:**
  * **Personalizar Firma:** Campo de entrada de texto interactivo para actualizar el nombre en tiempo real.
  * **Estilo de Fondo:** Selector horizontal con opciones preestablecidas (*Dopamine, Grainy, Cloudy, Pastel, Silk*).
  * **Tipografía:** Selector para alternar la fuente del Canvas entre *Jakarta Sans, Modern Serif y Classic Mono*.
* **Exportador:** El botón "Export to Story" utiliza `react-native-view-shot` para capturar de manera exacta la vista en un archivo de imagen temporal y abrir el menú para guardarlo o compartirlo.

### 4.4 Orquestador de Notificaciones Locales (Fase 1)
* **Lógica:** Un servicio que toma la configuración del usuario (ej. frecuencia de 3 veces al día entre las 08:00 AM y las 09:00 PM).
* **Cálculo:** Divide el rango horario en intervalos iguales y programa alarmas locales aleatorias utilizando `expo-notifications`.
* **Contenido:** Cada notificación programada se cargará con frases que coincidan estrictamente con las categorías seleccionadas por el usuario durante su onboarding.

---

## 5. 🗄️ Modelo de Datos y Estructura de Mocks

Para facilitar el mapeo idéntico cuando se integre Supabase en la Fase 2, la mock data respetará la siguiente estructura relacional:

### Categorías (`Category`)
```typescript
interface Category {
  id: string;          // Ej: 'self-love'
  name: string;        // Ej: 'Self-Love'
  color: string[];     // Array de strings hexadecimales para el degradado
  icon: string;        // Nombre del icono vectorial (MaterialIcons o Lucide)
  description: string; // Descripción corta para accesibilidad
}
```

### Frases (`Phrase`)
```typescript
interface Phrase {
  id: string;
  text: string;        // El contenido de la frase de inspiración
  author: string;      // Autor de la frase
  category_id: string; // Relación con el ID de la categoría correspondiente
  created_at: string;
  is_active: boolean;
}
```

---

## 6. 🛠️ Requerimientos No Funcionales y Calidad de Código

* **Rendimiento Visual:** El scroll vertical debe mantenerse a 60fps estables. Se implementarán optimizaciones de renderizado en imágenes de fondo y gradientes.
* **Feedback Físico:** Implementar respuestas hápticas (`expo-haptics`) de tipo *light* o *medium* en cada interacción táctil clave (selección de categorías, botones del feed y personalizador) para proporcionar una sensación premium.
* **Desacoplamiento Absoluto:** Ningún componente visual del Feed o del Onboarding debe instanciar llamadas de red o consultar bases de datos directamente. Todo debe resolverse mediante hooks personalizados de React (ej. `usePhrases`, `useOnboardingSettings`) que aíslen el origen de los datos.
