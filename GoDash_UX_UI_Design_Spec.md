# GoDash - UX/UI Design Specification
## Design System & User Experience Document

**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Equipo:** Product Design  
**Stack:** Next.js 15, Tailwind CSS, Framer Motion

---

# TABLA DE CONTENIDOS

1. [Principios de Diseño](#1-principios-de-diseño)
2. [Design System](#2-design-system)
3. [User Flows](#3-user-flows)
4. [Wireframes y Pantallas](#4-wireframes-y-pantallas)
5. [Componentes Clave](#5-componentes-clave)
6. [Responsive Design](#6-responsive-design)
7. [Accessibility](#7-accessibility)
8. [Animaciones y Microinteracciones](#8-animaciones-y-microinteracciones)

---

# 1. PRINCIPIOS DE DISEÑO

## 1.1 Filosofía de Diseño

GoDash es una herramienta profesional de entrenamiento, no un juego. El diseño debe ser:

### Clean & Focused
- Interfaz minimalista que no distrae del contenido
- Jerarquía visual clara: lo importante es grande y destacado
- Espacios en blanco generosos (breathing room)
- Sin adornos innecesarios

### Confident & Professional
- Tipografía robusta y legible
- Colores que comunican seriedad y confianza
- No usar gradientes excesivos ni efectos "flashy"
- Evitar estética de "startup juguetona"

### Feedback-Driven
- Cada acción tiene respuesta visual inmediata
- Estados de loading claros (no dejar al usuario esperando sin info)
- Confirmaciones visuales (checkmarks, progress bars)
- Error states explicativos (no solo "Error", sino "Por qué" y "Qué hacer")

### Performance-Oriented
- Carga instantánea de interfaces (skeleton screens mientras carga data)
- Transiciones fluidas pero rápidas (<300ms)
- No sacrificar velocidad por animaciones bonitas

## 1.2 Inspiraciones de Referencia

**Adoptar de:**
- **Linear**: Interfaz rápida, clean, shortcuts de teclado, estados de loading elegantes
- **Stripe**: Profesionalismo, documentación clara, error messages útiles
- **Figma**: Canvas-based interactions, comandos rápidos, UI que desaparece cuando no se necesita
- **Duolingo**: Feedback inmediato, progreso visible, microinteracciones deliciosas

**Evitar:**
- Gamificación excesiva tipo mobile games (explosiones de confetti, sonidos irritantes)
- Overdesign tipo Dribbble (bello pero no funcional)
- Interfaces densas tipo enterprise legacy (SAP, Oracle)

---

# 2. DESIGN SYSTEM

## 2.1 Colores

### Primary Palette

```css
/* Primary - Azul Profesional */
--primary-50: #EFF6FF;   /* Backgrounds muy suaves */
--primary-100: #DBEAFE;  /* Hover states suaves */
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3B82F6;  /* PRIMARY - Botones, links, acciones principales */
--primary-600: #2563EB;  /* Hover de botones primarios */
--primary-700: #1D4ED8;
--primary-800: #1E40AF;
--primary-900: #1E3A8A;
```

### Neutral Palette

```css
/* Grises - Texto, borders, backgrounds */
--neutral-50: #FAFAFA;   /* Background general de la app */
--neutral-100: #F5F5F5;  /* Cards, panels */
--neutral-200: #E5E5E5;  /* Borders suaves */
--neutral-300: #D4D4D4;  /* Borders normales */
--neutral-400: #A3A3A3;  /* Placeholder text */
--neutral-500: #737373;  /* Secondary text */
--neutral-600: #525252;  /* Body text */
--neutral-700: #404040;  /* Headings */
--neutral-800: #262626;
--neutral-900: #171717;  /* Texto principal, casi negro */
```

### Semantic Colors

```css
/* Success - Verde */
--success-50: #F0FDF4;
--success-500: #22C55E;   /* Feedback positivo, checkmarks */
--success-600: #16A34A;   /* Hover */

/* Warning - Amarillo/Naranja */
--warning-50: #FFFBEB;
--warning-500: #F59E0B;   /* Advertencias, "válido pero mejorable" */
--warning-600: #D97706;

/* Error - Rojo */
--error-50: #FEF2F2;
--error-500: #EF4444;     /* Errores, respuestas incorrectas */
--error-600: #DC2626;

/* Info - Azul claro */
--info-50: #EFF6FF;
--info-500: #3B82F6;      /* Tips, información contextual */
--info-600: #2563EB;
```

### Skill-Specific Colors

```css
/* Para representar cada skill en dashboards */
--skill-discovery: #8B5CF6;      /* Púrpura */
--skill-qualification: #06B6D4;  /* Cyan */
--skill-objections: #F59E0B;     /* Naranja */
--skill-closing: #10B981;        /* Verde */
```

## 2.2 Tipografía

### Font Stack

```css
/* Primary Font - Inter (sistema) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

/* Monospace - Código, datos numéricos */
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Type Scale

```css
/* Headings */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Section titles */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-xl: 1.25rem;    /* 20px - Subsection titles */
--text-lg: 1.125rem;   /* 18px - Large body */

/* Body */
--text-base: 1rem;     /* 16px - Default body text */
--text-sm: 0.875rem;   /* 14px - Secondary text, captions */
--text-xs: 0.75rem;    /* 12px - Labels, timestamps */
```

### Font Weights

```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Buttons, emphasis */
--font-semibold: 600;  /* Headings */
--font-bold: 700;      /* Strong emphasis */
```

### Line Heights

```css
--leading-tight: 1.25;   /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

## 2.3 Espaciado

Sistema de espaciado basado en 4px (Tailwind standard):

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px - Base unit */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

**Reglas de uso:**
- Padding interno de componentes: múltiplos de 4 (4px, 8px, 12px, 16px)
- Margins entre secciones: múltiplos de 8 (16px, 24px, 32px, 48px)
- Gutters de grids: 24px o 32px

## 2.4 Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Modals, large cards */
--radius-2xl: 1.5rem;   /* 24px - Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

## 2.5 Shadows

```css
/* Elevaciones sutiles */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

/* Elevaciones fuertes (modals, popovers) */
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

**Reglas:**
- Cards: `shadow-sm` o `shadow-md`
- Hover de cards: `shadow-lg`
- Modals/Dropdowns: `shadow-xl` o `shadow-2xl`
- No usar shadows en elementos pequeños (buttons, badges)

---

# 3. USER FLOWS

## 3.1 Onboarding Flow (Primera Vez)

```
Landing Page
    ↓
Sign Up (Email + Password)
    ↓
Email Verification
    ↓
[Onboarding Wizard]
    ├─ Step 1/3: ¿Cuánto tiempo llevas vendiendo?
    │   Options: <2 años / 2-5 años / 5+ años
    ↓
    ├─ Step 2/3: ¿Qué necesitas entrenar HOY?
    │   Options: Nuevo producto / Objeciones / Canal específico / Pitch complejo
    ↓
    ├─ Step 3/3: ¿Cuánto tiempo tienes?
    │   Options: 10-15 min/día / 30-60 min/día / 1-2 horas/día
    ↓
[Personalización]
    ↓
Recomendación de Track Inicial
    ├─ "Basado en tu perfil, te recomendamos: [Standard Track]"
    ├─ "O crea tu propio track personalizado"
    ↓
    │
    ├─ [Opción A: Selecciona Standard Track]
    │   ↓
    │   Dashboard con Track seleccionado
    │
    └─ [Opción B: Crear AI Track]
        ↓
        Input: "Describe qué vendes y a quién"
        ↓
        Loading (30-60 segundos): "Generando tu track personalizado..."
        ↓
        Preview del Track generado
        ↓
        Dashboard con Track custom
```

## 3.2 Flujo Principal: Completar Módulo

```
Dashboard
    ↓
Selecciona Track activo
    ↓
[Track View]
    ├─ Ve módulos (1-12)
    ├─ Ve progreso (3/10 completados)
    ↓
Click en "Siguiente módulo" o módulo específico
    ↓
[Módulo Type: LEARN]
    ├─ Teoría (2 min) - Video/Text
    ├─ Caso Real (3 min) - Audio player con transcripción
    ├─ Checkpoint (2 min) - 2-3 preguntas multiple choice
    ├─ Feedback inmediato si falla
    ↓
    [Botón: Continuar a Práctica]
    ↓
[Módulo Type: TRAIN - Reflex Gym]
    ├─ 10 objeciones en modo swipe
    ├─ Timer de 5 segundos
    ├─ Feedback inmediato
    ├─ Progress bar (7/10 completadas)
    ↓
    [Botón: Ir a Simulación]
    ↓
[Módulo Type: EXECUTE - Deal Room]
    ├─ Brief del cliente (30 seg de lectura)
    ├─ Selección de canal (WhatsApp/Email/Phone/F2F)
    ├─ [Simulación - 10-15 min]
    │   ├─ Conversación en tiempo real
    │   ├─ Indicador de "cliente escribiendo..." o "cliente escuchando..."
    │   ├─ Opción de terminar early
    ↓
    [Simulación termina]
    ↓
[Feedback Screen]
    ├─ Score: 72/100
    ├─ Skill breakdown: Discovery 85, Qualification 60, Objections 75, Closing 55
    ├─ ✅ Fortalezas (2-3 bullets)
    ├─ ⚠️ Debilidades (2-3 bullets)
    ├─ 🎯 Próximos pasos (3 acciones)
    ├─ [Botón: Volver a Dashboard]
    ├─ [Botón: Intentar de nuevo]
    ├─ [Botón: Siguiente módulo]
```

## 3.3 Flujo: Reflex Gym (Standalone)

```
Dashboard
    ↓
Click en "Reflex Gym" (sidebar navigation)
    ↓
[Reflex Gym Home]
    ├─ Stats personales:
    │   ├─ Objeciones dominadas: 23/50
    │   ├─ Tiempo promedio respuesta: 2.1 seg
    │   ├─ Streak: 7 días consecutivos
    ├─ [Botón grande: Empezar Drill (5 min)]
    ├─ [Tabs: Por practicar / Dominadas / Todas]
    ↓
Click "Empezar Drill"
    ↓
[Drill Session]
    ├─ Objeción aparece (texto grande)
    ├─ Timer: 5 segundos (cuenta regresiva visual)
    ├─ 3 opciones (A, B, C)
    ├─ Usuario selecciona
    ↓
    [Feedback inmediato]
    ├─ ✅ Correcto: Checkmark verde + breve explicación
    ├─ ❌ Incorrecto: X roja + explicación de por qué + cuál era la correcta
    ↓
    [Siguiente objeción]
    (Repite 10 veces)
    ↓
[Resumen del Drill]
    ├─ 8/10 correctas
    ├─ Tiempo promedio: 2.3 seg
    ├─ Objeciones nuevas dominadas: 2
    ├─ [Botón: Drill de nuevo]
    ├─ [Botón: Volver a Dashboard]
```

## 3.4 Flujo: Deal Room (Standalone)

```
Dashboard
    ↓
Click en "Deal Room" (sidebar navigation)
    ↓
[Deal Room Home]
    ├─ "Practica escenarios específicos sin seguir un track"
    ├─ Filtros:
    │   ├─ Canal: WhatsApp / Email / Phone / F2F
    │   ├─ Dificultad: Fácil / Medio / Difícil / Extremo
    │   ├─ Tipo de cliente: Analítico / Escéptico / Impulsivo / Ejecutivo ocupado
    ├─ Grid de escenarios sugeridos (cards)
    ↓
Click en escenario o "Custom"
    ↓
[Si Custom]
    ├─ "Describe el cliente ideal para practicar"
    ├─ Input: Rol, industria, problema, personalidad
    ├─ [Botón: Generar simulación (30 seg)]
    ↓
[Simulación - igual que en flow de módulo]
    ↓
[Feedback Screen]
    ↓
[Botón: Guardar como escenario favorito]
[Botón: Practicar de nuevo]
[Botón: Nuevo escenario]
```

---

# 4. WIREFRAMES Y PANTALLAS

## 4.1 Landing Page (Pre-Login)

### Hero Section

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo GoDash]                  [Login] [Sign Up - Primary] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│           Entrena Ventas con IA, Mejora Resultados          │
│              [H1 - 48px, Bold, Center]                       │
│                                                               │
│      Simulaciones hiperrealistas que replican tus           │
│       conversaciones reales de venta. Feedback              │
│         inmediato. Mejora 15-25% en 90 días.                │
│              [P - 20px, Center, Max-width 600px]             │
│                                                               │
│           [CTA Grande: Empezar Gratis - Primary]            │
│           [Secondary: Ver Demo (2 min)]                      │
│                                                               │
│              ↓ [Scroll indicator animation]                  │
└─────────────────────────────────────────────────────────────┘
```

### Social Proof Section

```
┌─────────────────────────────────────────────────────────────┐
│  "Mejoramos nuestra tasa de cierre de 18% a 24% en Q1"     │
│   — Juan Pérez, Sales Manager @ TechCorp                    │
│                                                               │
│  [Logos de clientes: 4-6 empresas]                          │
└─────────────────────────────────────────────────────────────┘
```

### Feature Cards (3 columns)

```
┌─────────────┬─────────────┬─────────────┐
│  [Icon]     │  [Icon]     │  [Icon]     │
│             │             │             │
│  Simulador  │  Feedback   │  Práctica   │
│  Realista   │  Accionable │  Ilimitada  │
│             │             │             │
│  Replica    │  Score +    │  24/7 sin   │
│  WhatsApp,  │  consejos   │  consecuen- │
│  Phone, F2F │  tácticos   │  cias       │
└─────────────┴─────────────┴─────────────┘
```

## 4.2 Dashboard (Post-Login)

### Layout Structure

```
┌──────────────┬────────────────────────────────────────────────┐
│              │  [Header]                                       │
│  [Sidebar]   │  User avatar, notifications, search            │
│              ├────────────────────────────────────────────────┤
│  - Dashboard │  [Main Content Area]                           │
│  - Mi Track  │                                                 │
│  - Reflex    │  ┌─────────────────────────────────────────┐  │
│    Gym       │  │  Track Activo: Venta SaaS B2B           │  │
│  - Deal Room │  │  Progress: 6/10 módulos (60%)           │  │
│  - Analytics │  │  [Progress bar visual]                   │  │
│              │  │  [Botón: Continuar - Módulo 7]          │  │
│  [Profile]   │  └─────────────────────────────────────────┘  │
│  [Settings]  │                                                 │
│              │  ┌───────────────┬───────────────┐            │
│              │  │  Win Rate     │  Avg Score    │            │
│              │  │  67%          │  74/100       │            │
│              │  │  [Graph mini] │  [+12 vs D30] │            │
│              │  └───────────────┴───────────────┘            │
│              │                                                 │
│              │  [Skill Radar Chart]                           │
│              │  Discovery: 80%, Qualification: 60%           │
│              │  Objections: 90%, Closing: 40%                │
│              │                                                 │
│              │  [Próximas Acciones - Cards]                  │
│              │  - Módulo sugerido                             │
│              │  - Drill de objeciones                         │
│              │  - Simulación de práctica                      │
└──────────────┴────────────────────────────────────────────────┘
```

### Sidebar Collapsed (Mobile)

```
┌──┐
│ ☰│ Hamburger menu
│ 🏠│ Dashboard
│ 📚│ Track
│ ⚡│ Gym
│ 🎯│ Deal Room
│ 📊│ Analytics
│  │
│ 👤│ Profile
└──┘
```

## 4.3 Módulo LEARN (Teoría + Caso)

### Teoría View

```
┌─────────────────────────────────────────────────────────────┐
│  [← Volver a Track]            Módulo 5/10                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Manejo de Objeción de Precio                               │
│  [H2 - 30px, Bold]                                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [Video Player]                                      │    │
│  │  Framework LAER                                      │    │
│  │  Duración: 2:30                                      │    │
│  │                                                       │    │
│  │  [Play button - Center]                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Concepto Clave: LAER Framework                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━                                │
│                                                               │
│  📌 Listen: Escucha completa sin interrumpir                │
│  📌 Acknowledge: Valida la preocupación                     │
│  📌 Explore: Pregunta para entender contexto                │
│  📌 Respond: Responde con valor, no con descuento           │
│                                                               │
│  [Panel expandible: Ver ejemplo transcrito]                 │
│                                                               │
│  [Botón Primary: Continuar al Checkpoint]                   │
└─────────────────────────────────────────────────────────────┘
```

### Checkpoint View

```
┌─────────────────────────────────────────────────────────────┐
│  Checkpoint: ¿Entendiste el concepto?                       │
│  [Progress: 1/3]                                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Cliente dice: "Es muy caro para nosotros"                  │
│  ¿Cuál es la PRIMERA acción según LAER?                     │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │  A) Ofrecer descuento del 10%                     │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │  B) Preguntar: "¿Comparado con qué?"             │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │  C) Explicar el ROI del producto                  │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Feedback (Si falla)

```
┌─────────────────────────────────────────────────────────────┐
│  ❌ No es correcto                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Ofrecer descuento inmediatamente comunica que tu precio    │
│  no está justificado. Según LAER, primero debes Explorar   │
│  para entender el contexto real de la objeción.             │
│                                                               │
│  ✅ Respuesta correcta: B) Preguntar "¿Comparado con qué?" │
│                                                               │
│  Esto te permite entender si el problema es:                │
│  • Comparación con competidor más barato                    │
│  • Falta de presupuesto real                                │
│  • Percepción de bajo valor                                 │
│                                                               │
│  [Botón: Intentar de nuevo]                                 │
│  [Link: Revisar teoría]                                     │
└─────────────────────────────────────────────────────────────┘
```

## 4.4 Deal Room - WhatsApp Skin

```
┌─────────────────────────────────────────────────────────────┐
│  [← Salir]      Juan Pérez - CFO                    [...]   │
│  En línea                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Background: WhatsApp pattern sutil]                       │
│                                                               │
│                           ┌──────────────────────┐          │
│                           │ Hola Juan! Soy Ana   │          │
│                           │ de TechSolutions.    │          │
│                           │ ¿Cómo estás?         │          │
│                           │            10:23 ✓✓│          │
│                           └──────────────────────┘          │
│                                                               │
│  ┌────────────────────┐                                     │
│  │ Hola Ana. Bien.    │                                     │
│  │ ¿Qué necesitas?    │                                     │
│  │          10:24 ✓✓│                                     │
│  └────────────────────┘                                     │
│                                                               │
│                           [escribiendo...]                   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [Input box: Escribe tu mensaje]              [Enviar →]   │
└─────────────────────────────────────────────────────────────┘

[Panel lateral derecho - Info del cliente]
┌──────────────────────────┐
│  Cliente: Juan Pérez     │
│  Rol: CFO                │
│  Empresa: TechCorp       │
│  Problema: Costos altos  │
│  Pain Level: 7/10        │
│                          │
│  Personalidad: Analítico │
│  Autoridad: Decision     │
│  maker                   │
└──────────────────────────┘
```

## 4.5 Deal Room - F2F (Presencial)

```
┌─────────────────────────────────────────────────────────────┐
│  [← Salir]      Reunión con Juan Pérez          [Timer]    │
│  Sala Ejecutiva - TechCorp HQ                    12:34      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Background: Sala de reuniones elegante - imagen]          │
│                                                               │
│            ┌────────────────────────────┐                    │
│            │                            │                    │
│            │   [Avatar de Juan Pérez]   │                    │
│            │   [Foto profesional]       │                    │
│            │                            │                    │
│            │   [Halo de "escuchando"]   │                    │
│            └────────────────────────────┘                    │
│                                                               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [Panel inferior - Lenguaje Corporal]                       │
│  💼 Cliente abre laptop                                     │
│  👀 Hace contacto visual directo                            │
│                                                               │
│  [Botón grande: 🎤 Hablar]  [Botón: Terminar reunión]      │
└─────────────────────────────────────────────────────────────┘

[Panel lateral derecho - igual que WhatsApp]
```

## 4.6 Feedback Screen Post-Simulación

```
┌─────────────────────────────────────────────────────────────┐
│  Resultado de la Simulación                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Score General: 72/100                      │     │
│  │         [Circular progress - 72%]                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Skill Breakdown                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                         │
│                                                               │
│  Discovery        ████████░░ 85/100  ✅                     │
│  Qualification    ██████░░░░ 60/100  ⚠️                     │
│  Obj. Handling    ███████░░░ 75/100  ✅                     │
│  Closing          █████░░░░░ 55/100  ❌                     │
│                                                               │
│                                                               │
│  ✅ Fortalezas                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                         │
│  • Usaste preguntas SPIN efectivas                          │
│  • Mantuviste tono profesional                              │
│                                                               │
│                                                               │
│  ⚠️ Áreas de Mejora                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                         │
│  • Hablaste 75% del tiempo (ideal: 40%)                     │
│  • No confirmaste presupuesto antes de pricing              │
│  • Cerraste sin manejar objeción final                      │
│                                                               │
│                                                               │
│  🎯 Próximos Pasos                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                         │
│  1. Módulo: Active Listening Techniques                     │
│  2. Drill: 10 objeciones de presupuesto                     │
│  3. Revisar: Framework Doble Alternativa                    │
│                                                               │
│                                                               │
│  [Botón Primary: Siguiente Módulo]                          │
│  [Botón Secondary: Intentar de Nuevo]                       │
│  [Link: Ver Transcripción Completa]                         │
└─────────────────────────────────────────────────────────────┘
```

## 4.7 Reflex Gym - Drill Session

```
┌─────────────────────────────────────────────────────────────┐
│  Reflex Gym - Drill de Objeciones                          │
│  [Progress: 7/10]  ●●●●●●●○○○                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│           "No tenemos presupuesto                            │
│            este trimestre"                                   │
│           [Texto grande, center, bold]                       │
│                                                               │
│                                                               │
│                    Timer: ⏱️ 3 segundos                     │
│                    [Circular countdown]                      │
│                                                               │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │  A) "Entiendo, podemos esperar al próximo        │      │
│  │      trimestre"                                    │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │  B) "¿Cuándo revisan el presupuesto para         │      │
│  │      aprobar nuevas inversiones?"                 │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │  C) "Ofrecemos planes de financiamiento"         │      │
│  └───────────────────────────────────────────────────┘      │
│                                                               │
│                                                               │
│  [Status bar: 6 correctas, 0 incorrectas]                   │
└─────────────────────────────────────────────────────────────┘
```

### Feedback Inmediato (Correcto)

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ Correcto!                                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Checkmark animation - verde]                              │
│                                                               │
│  Opción B es óptima porque exploras la situación            │
│  (LAER framework) sin ceder control ni asumir que           │
│  no hay presupuesto.                                         │
│                                                               │
│  Tiempo de respuesta: 2.1 seg ⚡ ¡Excelente!               │
│                                                               │
│                                                               │
│  [Auto-avanza en 2 segundos a siguiente objeción]          │
│  O [Botón: Continuar →]                                     │
└─────────────────────────────────────────────────────────────┘
```

## 4.8 Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Analytics - Tu Progreso                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Tabs: Overview | Por Canal | Por Skill | Historia]       │
│                                                               │
│  ┌──────────────────────┬──────────────────────┐           │
│  │  Simulaciones        │  Win Rate            │           │
│  │  47 total            │  67%                 │           │
│  │  [+12 vs mes pasado] │  [+8% vs mes pasado] │           │
│  └──────────────────────┴──────────────────────┘           │
│                                                               │
│  Score Promedio - Últimos 30 Días                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
│  [Line chart: Eje Y: 0-100, Eje X: Fechas]                │
│  Muestra tendencia creciente de 62 → 74                    │
│                                                               │
│                                                               │
│  Skill Radar                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
│  [Radar chart with 4 axes]                                  │
│  - Discovery: 80%                                            │
│  - Qualification: 60%                                        │
│  - Objections: 90%                                           │
│  - Closing: 40% ⚠️                                          │
│                                                               │
│                                                               │
│  Performance por Canal                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
│  WhatsApp     ████████░░ 18/20 (90%) ✅                    │
│  Email        ███████░░░ 14/20 (70%) ✅                    │
│  Phone        ██████░░░░ 12/20 (60%) ⚠️                    │
│  F2F          █████░░░░░  8/15 (53%) ⚠️                    │
│                                                               │
│                                                               │
│  🔴 Debilidades Detectadas                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
│  • Cierras sin confirmar presupuesto (8 veces este mes)    │
│  • Usas jerga técnica con no-técnicos (12 instancias)      │
│  • Pausas incómodas cuando te interrumpen (avg 4.2 seg)    │
│                                                               │
│  [Botones: Exportar Data | Compartir Progreso]             │
└─────────────────────────────────────────────────────────────┘
```

---

# 5. COMPONENTES CLAVE

## 5.1 Buttons

### Primary Button

```css
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all 150ms ease;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Secondary Button

```css
.btn-secondary {
  background: transparent;
  color: var(--primary-500);
  border: 2px solid var(--primary-500);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
}

.btn-secondary:hover {
  background: var(--primary-50);
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: var(--neutral-700);
  padding: 12px 24px;
  border-radius: var(--radius-md);
}

.btn-ghost:hover {
  background: var(--neutral-100);
}
```

### Sizes

```css
/* Small */
.btn-sm { padding: 8px 16px; font-size: var(--text-sm); }

/* Medium (default) */
.btn-md { padding: 12px 24px; font-size: var(--text-base); }

/* Large */
.btn-lg { padding: 16px 32px; font-size: var(--text-lg); }
```

## 5.2 Cards

### Base Card

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
  transition: all 200ms ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Card con Header

```html
<div class="card">
  <div class="card-header">
    <h3>Track Activo</h3>
    <span class="badge">6/10</span>
  </div>
  <div class="card-body">
    <p>Venta SaaS B2B - Empresas Medianas</p>
    <progress value="60" max="100"></progress>
  </div>
  <div class="card-footer">
    <button class="btn-primary">Continuar</button>
  </div>
</div>
```

## 5.3 Progress Indicators

### Progress Bar

```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 60%"></div>
</div>
```

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
  transition: width 500ms ease;
}
```

### Circular Progress (Score)

```html
<svg class="circular-progress" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="none" 
          stroke="var(--neutral-200)" stroke-width="8"/>
  <circle cx="50" cy="50" r="40" fill="none" 
          stroke="var(--primary-500)" stroke-width="8"
          stroke-dasharray="251.2" stroke-dashoffset="75.36"
          transform="rotate(-90 50 50)"/>
  <text x="50" y="50" text-anchor="middle" dy="7" 
        font-size="20" font-weight="600">72</text>
</svg>
```

## 5.4 Input Fields

```html
<div class="input-group">
  <label for="email">Email</label>
  <input type="email" id="email" placeholder="tu@email.com">
  <span class="input-hint">Usaremos esto para tu login</span>
</div>
```

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-group label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--neutral-700);
}

.input-group input {
  padding: 12px 16px;
  border: 2px solid var(--neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: border-color 150ms ease;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.input-hint {
  font-size: var(--text-xs);
  color: var(--neutral-500);
}
```

## 5.5 Badges

```html
<span class="badge badge-success">Completado</span>
<span class="badge badge-warning">En progreso</span>
<span class="badge badge-neutral">Bloqueado</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.badge-success {
  background: var(--success-50);
  color: var(--success-600);
}

.badge-warning {
  background: var(--warning-50);
  color: var(--warning-600);
}

.badge-neutral {
  background: var(--neutral-100);
  color: var(--neutral-600);
}
```

## 5.6 Modals

```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h3>¿Salir de la simulación?</h3>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
      <p>Perderás el progreso de esta simulación. ¿Estás seguro?</p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost">Cancelar</button>
      <button class="btn-primary">Sí, salir</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-2xl);
}

.modal-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

## 5.7 Toasts (Notifications)

```html
<div class="toast toast-success">
  <span class="toast-icon">✓</span>
  <p>Módulo completado exitosamente</p>
</div>
```

```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  min-width: 300px;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: var(--shadow-lg);
  animation: slideIn 300ms ease;
}

.toast-success {
  background: var(--success-500);
  color: white;
}

.toast-error {
  background: var(--error-500);
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

# 6. RESPONSIVE DESIGN

## 6.1 Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Tablets portrait */
--breakpoint-md: 768px;   /* Tablets landscape */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

## 6.2 Layout Adaptations

### Desktop (>1024px)
- Sidebar visible y fijo
- Main content: max-width 1200px, centrado
- Cards en grid de 3 columnas
- Modales: max-width 600px

### Tablet (768px - 1024px)
- Sidebar colapsable (hamburger menu)
- Main content: max-width 100%, padding lateral
- Cards en grid de 2 columnas
- Modales: max-width 90%

### Mobile (<768px)
- Sidebar como overlay full-screen al abrir
- Main content: full width, padding 16px
- Cards en columna única (stack vertical)
- Modales: full-screen en móviles pequeños (<640px)

## 6.3 Typography Scaling

```css
/* Desktop */
h1 { font-size: 2.25rem; }  /* 36px */
h2 { font-size: 1.875rem; } /* 30px */
body { font-size: 1rem; }   /* 16px */

/* Mobile */
@media (max-width: 768px) {
  h1 { font-size: 1.875rem; }  /* 30px */
  h2 { font-size: 1.5rem; }    /* 24px */
  body { font-size: 0.875rem; } /* 14px */
}
```

## 6.4 Touch Targets (Mobile)

Todos los elementos interactivos deben tener mínimo 44x44px en móvil:

```css
@media (max-width: 768px) {
  button, a, input {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

# 7. ACCESSIBILITY

## 7.1 Color Contrast

Todos los textos deben cumplir WCAG AA:
- Texto normal: contrast ratio mínimo 4.5:1
- Texto grande (>18px o >14px bold): contrast ratio mínimo 3:1

Combinaciones aprobadas:
- `--neutral-900` sobre blanco: 16.7:1 ✅
- `--primary-500` sobre blanco: 4.57:1 ✅
- `--neutral-600` sobre blanco: 5.74:1 ✅

## 7.2 Keyboard Navigation

**Orden de Tab:**
1. Header (logo, search, user menu)
2. Sidebar navigation (top to bottom)
3. Main content (left to right, top to bottom)
4. Footer

**Focus States:**

```css
*:focus-visible {
  outline: 3px solid var(--primary-500);
  outline-offset: 2px;
}
```

**Shortcuts de Teclado:**
- `/` - Focus en search bar
- `Esc` - Cerrar modal/overlay
- `Enter` - Confirmar acción
- `Space` - Play/Pause en videos
- `Arrow keys` - Navegar opciones en Reflex Gym

## 7.3 Screen Reader Support

```html
<!-- Buttons -->
<button aria-label="Cerrar modal">×</button>

<!-- Progress -->
<div role="progressbar" aria-valuenow="60" aria-valuemin="0" 
     aria-valuemax="100" aria-label="Progreso del track">
  <div style="width: 60%"></div>
</div>

<!-- Loading States -->
<div role="status" aria-live="polite" aria-atomic="true">
  Generando tu track personalizado...
</div>

<!-- Alerts -->
<div role="alert" aria-live="assertive">
  Error: No se pudo conectar con el servidor
</div>
```

## 7.4 Alt Text Guidelines

```html
<!-- Avatares -->
<img src="avatar.jpg" alt="Juan Pérez, CFO de TechCorp">

<!-- Iconos decorativos -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Iconos funcionales -->
<svg aria-label="Menú de navegación">...</svg>
```

---

# 8. ANIMACIONES Y MICROINTERACCIONES

## 8.1 Principios de Animación

**Performance First:**
- Solo animar `transform` y `opacity` (GPU-accelerated)
- Evitar animar `width`, `height`, `top`, `left` (cause repaints)

**Timing:**
- Micro: 150ms (hover, focus)
- Quick: 300ms (modales, toasts)
- Standard: 500ms (page transitions)

**Easing:**
- `ease-out`: Para elementos que entran (feels snappy)
- `ease-in`: Para elementos que salen
- `ease-in-out`: Para movimientos naturales

## 8.2 Hover Effects

```css
.card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

## 8.3 Loading States

### Skeleton Screens

```html
<div class="skeleton">
  <div class="skeleton-header"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-text short"></div>
</div>
```

```css
.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton-header {
  height: 24px;
  background: var(--neutral-200);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.skeleton-text {
  height: 16px;
  background: var(--neutral-200);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
}

.skeleton-text.short {
  width: 60%;
}
```

### Spinners

```html
<div class="spinner" role="status">
  <span class="sr-only">Cargando...</span>
</div>
```

```css
.spinner {
  border: 4px solid var(--neutral-200);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## 8.4 Feedback Animations

### Success Checkmark

```css
@keyframes checkmark {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

.checkmark-success {
  animation: checkmark 500ms ease-out;
}
```

### Error Shake

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.error-shake {
  animation: shake 500ms ease-in-out;
}
```

## 8.5 Page Transitions (Framer Motion)

```jsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

---

# 9. ESTADOS DE ERROR

## 9.1 Empty States

### No Tracks Yet

```html
<div class="empty-state">
  <svg class="empty-icon">...</svg>
  <h3>No tienes tracks todavía</h3>
  <p>Crea tu primer track personalizado o elige uno del catálogo</p>
  <button class="btn-primary">Crear Track</button>
</div>
```

### No Simulations Yet

```html
<div class="empty-state">
  <svg class="empty-icon">...</svg>
  <h3>Aún no has practicado</h3>
  <p>Completa tu primera simulación para ver tu progreso aquí</p>
  <button class="btn-primary">Empezar Práctica</button>
</div>
```

## 9.2 Error States

### Network Error

```html
<div class="error-state">
  <svg class="error-icon">...</svg>
  <h3>No pudimos conectarnos</h3>
  <p>Verifica tu conexión a internet y vuelve a intentar</p>
  <button class="btn-primary">Reintentar</button>
</div>
```

### API Error (500)

```html
<div class="error-state">
  <svg class="error-icon">...</svg>
  <h3>Algo salió mal</h3>
  <p>Estamos trabajando para solucionarlo. Intenta de nuevo en unos minutos.</p>
  <button class="btn-primary">Volver al Dashboard</button>
</div>
```

---

# 10. ICONOGRAFÍA

## 10.1 Icon System

**Librería:** Lucide React (consistente, open-source, ligera)

```jsx
import { Home, Zap, Target, BarChart3, User, Settings } from 'lucide-react';
```

**Sizes:**
- Small: 16px (inline text)
- Medium: 20px (buttons, navigation)
- Large: 24px (section headers)
- XL: 32px (empty states)

**Stroke Width:**
- Default: 2px
- Light: 1.5px (para iconos grandes)
- Bold: 2.5px (para énfasis)

## 10.2 Icon Usage

```jsx
{/* Navigation */}
<nav>
  <a href="/dashboard"><Home size={20} /> Dashboard</a>
  <a href="/gym"><Zap size={20} /> Reflex Gym</a>
  <a href="/dealroom"><Target size={20} /> Deal Room</a>
</nav>

{/* Buttons */}
<button>
  <Play size={16} /> Empezar Simulación
</button>

{/* Status */}
<div className="status">
  <CheckCircle size={16} color="var(--success-500)" /> Completado
</div>
```

---

**Documento preparado para equipo de diseño y desarrollo frontend.**  
**Versión 1.0 - Febrero 2026**
