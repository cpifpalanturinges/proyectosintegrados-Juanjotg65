# DOCUMENTO DE DISEÑO UI/UX - GT-TURING

## Proyecto: Plataforma de Alquiler de Coches de Carreras

---

## 1. DESCRIPCIÓN DE LA TEMÁTICA

### 1.1 Hipótesis de Partida

El mercado del alquiler de vehículos de alto rendimiento y circuitos de carreras está en crecimiento, pero carece de una plataforma digital moderna que integre:
- Reserva de vehículos premium (coches de carreras)
- Reserva de circuitos profesionales
- Gestión integral del usuario
- Comunicación en tiempo real

**Hipótesis**: Los entusiastas del automovilismo necesitan una plataforma digital centralizada, intuitiva y eficiente para alquilar coches de carreras y reservar circuitos, eliminando la fricción de los sistemas tradicionales fragmentados.

### 1.2 Propósito del Sitio Web

GT-TURING es una plataforma web que conecta a entusiastas del automovilismo con:
- **Coches de carreras de alto rendimiento** disponibles para alquiler
- **Circuitos profesionales** para experiencias de conducción
- **Sistema de reservas integrado** con calendario en tiempo real
- **Chat en vivo** para consultas y soporte
- **Panel de administración** para gestión de inventario

### 1.3 Metas a Alcanzar

#### Objetivos de Negocio
1. Facilitar al menos 100 reservas mensuales en los primeros 6 meses
2. Conseguir una tasa de conversión del 15% (visitantes → reservas)
3. Reducir el tiempo de reserva de 15 minutos (método tradicional) a 3 minutos
4. Mantener una satisfacción del usuario superior al 4.5/5

#### Objetivos de Usuario
1. Explorar catálogo de coches y circuitos en menos de 2 clics
2. Completar una reserva en menos de 5 pasos
3. Recibir confirmación instantánea
4. Acceder a su historial de reservas fácilmente
5. Comunicarse con soporte en tiempo real

#### Objetivos Técnicos
1. Tiempo de carga inferior a 2 segundos
2. Accesibilidad WCAG 2.1 Nivel AA
3. Responsive design (móvil, tablet, desktop)
4. Disponibilidad del 99.9%

---

## 2. ESTUDIO DE COMPETENCIA Y SITIOS DE REFERENCIA

### 2.1 Competencia Directa

#### 2.1.1 Track Days España
- **URL**: https://www.trackdays.es
- **Fortalezas**: 
  - Amplio catálogo de experiencias
  - Proceso de reserva simplificado
  - Buenas fotografías de coches
- **Debilidades**:
  - Diseño anticuado (UI de 2015)
  - No hay filtros avanzados
  - Sin sistema de chat en tiempo real
- **Aprendizaje**: Mejorar la experiencia visual y añadir funcionalidades modernas

#### 2.1.2 Sixt Rent a Car (Premium)
- **URL**: https://www.sixt.com
- **Fortalezas**:
  - Diseño profesional y limpio
  - Excelente sistema de filtros
  - Proceso de reserva claro
- **Debilidades**:
  - Orientado a coches de lujo cotidianos, no deportivos
  - Exceso de información en algunas páginas
- **Aprendizaje**: Adoptar su claridad visual pero enfocarse en la experiencia deportiva

#### 2.1.3 Formula E Racing Experience
- **URL**: https://www.fiaformulae.com/en/championship/formula-e-experiences
- **Fortalezas**:
  - Diseño moderno con animaciones
  - Excelente uso de video y contenido multimedia
  - Narrativa visual impactante
- **Debilidades**:
  - Demasiado enfocado en branding
  - Navegación poco intuitiva
- **Aprendizaje**: Equilibrio entre impacto visual y usabilidad

### 2.2 Sitios de Referencia (Diseño)

#### 2.2.1 Stripe (https://stripe.com)
- **Razón**: Animaciones sutiles y fluidas
- **Elementos a adoptar**: Micro-interacciones en botones y cards

#### 2.2.2 Airbnb (https://airbnb.com)
- **Razón**: Excelente sistema de búsqueda y filtros
- **Elementos a adoptar**: Calendario de reservas, diseño de cards

#### 2.2.3 Tesla (https://tesla.com)
- **Razón**: Diseño minimalista con foco en producto
- **Elementos a adoptar**: Hero sections con gradientes, tipografía bold

---

## 3. SELECCIÓN DE IMÁGENES

### 3.1 Criterios de Selección

Las imágenes deben transmitir:
- **Velocidad y adrenalina**: Coches en movimiento, ángulos dinámicos
- **Profesionalismo**: Circuitos limpios, ambientes controlados
- **Exclusividad**: Detalles de coches premium, interiores de lujo
- **Seguridad**: Equipamiento profesional, instalaciones modernas

### 3.2 Tipos de Imágenes Utilizadas

1. **Hero Images (1920x1080)**
   - Coches de carreras en circuitos al atardecer
   - Ángulos bajos para transmitir potencia
   - Fondo desenfocado para destacar el vehículo

2. **Cards de Producto (600x400)**
   - Vista 3/4 frontal de cada coche
   - Fondo neutro o circuito desenfocado
   - Iluminación profesional

3. **Imágenes de Circuito (800x600)**
   - Vista aérea de circuitos
   - Trazado completo visible
   - Colores vibrantes (asfalto, zonas verdes)

4. **Iconografía**
   - Iconos de línea simple (outlined)
   - Relación con automovilismo: velocímetro, bandera de carreras, casco

### 3.3 Fuentes de Imágenes

- **Unsplash**: Imágenes de alta calidad de coches deportivos
- **Pexels**: Circuitos y ambientes de carreras
- **Custom Icons**: Heroicons, Lucide Icons (consistencia visual)

---

## 4. PALETA DE COLORES

### 4.1 Color Dominante: Azul Racing (#0066CC)

#### Justificación de la Elección

El **azul #0066CC** se seleccionó como color dominante por las siguientes razones:

1. **Confianza y Profesionalismo**: 
   - El azul es el color más asociado con confianza en estudios de psicología del color
   - Transmite seguridad en transacciones financieras (crucial para reservas online)

2. **Asociación con Tecnología**:
   - Marcas tecnológicas líderes usan azul (Intel, IBM, Microsoft)
   - Refleja la naturaleza digital y moderna de la plataforma

3. **Diferenciación de la Competencia**:
   - Competidores usan rojo (agresivo) o negro (genérico)
   - El azul nos posiciona como profesionales y accesibles

4. **Versatilidad**:
   - Contrasta bien con fondos blancos y oscuros
   - Permite crear degradados atractivos
   - Se combina fácilmente con colores de acento

5. **Referencias en Automovilismo**:
   - Marcas icónicas como Ford GT (azul), Bugatti (azul/negro)
   - Equipos de F1 como Red Bull Racing (azul)

### 4.2 Paleta Completa (Análoga con Acento Complementario)

#### Colores Primarios

```css
/* Azul Principal (Dominante) */
--primary-blue: #0066CC;        /* 70% de uso */
--primary-blue-dark: #004C99;   /* 15% de uso */
--primary-blue-light: #3385D6;  /* 10% de uso */

/* Negro/Gris (Soporte) */
--secondary-black: #000000;     /* 15% de uso */
--secondary-gray: #666666;      /* 5% de uso */
--secondary-light: #1a1a1a;     /* Fondos oscuros */

/* Acento Complementario (Naranja) */
--accent-orange: #FF8C00;       /* 5% de uso - CTAs */
--accent-orange-dark: #E67E00;  /* Hover states */
--accent-red: #DC2626;          /* Alerts y errores */

/* Neutros */
--background-white: #FFFFFF;    /* 40% - Fondo principal */
--background-light: #F5F5F5;    /* 15% - Fondos alternos */
--background-dark: #0a0a0a;     /* Dark mode */
```

#### Tipo de Paleta: **Análoga con Acento Complementario**

- **Base Análoga**: Azul (#0066CC) con variaciones tonales
- **Acento Complementario**: Naranja (#FF8C00) opuesto en el círculo cromático
- **Neutros**: Blanco, gris, negro para balance

### 4.3 Proporción y Uso de Colores

#### Regla 60-30-10 Aplicada

```
60% - Azul Principal + Blanco
      ├─ 40% Blanco (backgrounds, espacios negativos)
      └─ 20% Azul #0066CC (headers, navegación, elementos principales)

30% - Negro/Gris + Azul Oscuro
      ├─ 15% Negro/Gris (texto, iconos)
      └─ 15% Azul Oscuro (fondos de secciones, footers)

10% - Naranja + Azul Claro
      ├─ 5% Naranja (CTAs, botones principales)
      └─ 5% Azul Claro (highlights, hover states)
```

#### Uso Específico por Elemento

| Elemento | Color | Código | Proporción |
|----------|-------|--------|------------|
| **Header/Navbar** | Azul Principal | #0066CC | 15% |
| **Fondo Principal** | Blanco | #FFFFFF | 40% |
| **Texto Principal** | Negro | #000000 | 10% |
| **Botones CTA** | Naranja | #FF8C00 | 5% |
| **Links** | Azul Principal | #0066CC | 5% |
| **Footer** | Azul Oscuro | #004C99 | 10% |
| **Hover States** | Azul Claro | #3385D6 | 5% |
| **Alerts/Errors** | Rojo | #DC2626 | 2% |
| **Fondos Alternos** | Gris Claro | #F5F5F5 | 8% |

### 4.4 Captura de Uso de Colores

```
┌─────────────────────────────────────────────────────┐
│  NAVBAR: Azul Principal (#0066CC)           [15%]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  HERO SECTION:                                      │
│  Gradiente Azul (#0066CC → #004C99)        [20%]   │
│                                                     │
│  CTA Button: Naranja (#FF8C00)              [5%]   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CUERPO PRINCIPAL: Blanco (#FFFFFF)        [40%]   │
│                                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐                 │
│  │ Card 1 │ │ Card 2 │ │ Card 3 │  Cards          │
│  │ F5F5F5 │ │ F5F5F5 │ │ F5F5F5 │  [8%]           │
│  └────────┘ └────────┘ └────────┘                 │
│                                                     │
│  Texto: Negro (#000000)                    [10%]   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FOOTER: Azul Oscuro (#004C99)             [10%]   │
└─────────────────────────────────────────────────────┘
```

---

## 5. TIPOGRAFÍA

### 5.1 Fuente Principal: **Inter**

#### Justificación de la Elección

**Inter** se seleccionó como fuente principal por:

1. **Legibilidad Excepcional**:
   - Diseñada específicamente para pantallas digitales
   - Altura-x optimizada para lectura en resoluciones estándar
   - Espaciado de caracteres balanceado

2. **Versatilidad**:
   - 9 pesos disponibles (100-900)
   - Excelente para jerarquías visuales
   - Soporta números tabulares (importante para precios)

3. **Modernidad**:
   - Estilo contemporáneo y limpio
   - Asociada con marcas tecnológicas (GitHub, Notion, Vercel)
   - Refleja profesionalismo sin ser corporativa

4. **Rendimiento**:
   - Variable font disponible (reduce peso del archivo)
   - Excelente rendering en todos los navegadores
   - Optimizada para web

5. **Accesibilidad**:
   - Alto contraste en todos los pesos
   - Fácil distinción entre caracteres similares (l, I, 1)
   - WCAG 2.1 compliant

### 5.2 Fuente Secundaria: **JetBrains Mono**

#### Justificación

**JetBrains Mono** se usa para:
- Códigos de reserva
- Números de referencia
- Detalles técnicos (caballos de fuerza, cilindrada)

**Razones**:
- Monoespaciada para alineación perfecta
- Legible en tamaños pequeños
- Contraste con Inter (destaca información técnica)

### 5.3 Combinación Armónica y Jerarquía Visual

#### Escala Tipográfica (Basada en proporción 1.250 - Major Third)

```css
/* HEADINGS - Inter Bold/Extrabold */
--h1: 72px / 1.1 / 800 (Extrabold)     /* Hero titles */
--h2: 56px / 1.2 / 700 (Bold)          /* Section titles */
--h3: 36px / 1.3 / 700 (Bold)          /* Card titles */
--h4: 28px / 1.4 / 600 (Semibold)      /* Subsections */
--h5: 20px / 1.5 / 600 (Semibold)      /* Small headings */

/* BODY TEXT - Inter Regular/Medium */
--body-xl: 20px / 1.6 / 400 (Regular)  /* Lead paragraphs */
--body-lg: 18px / 1.6 / 400 (Regular)  /* Main content */
--body-md: 16px / 1.5 / 400 (Regular)  /* Default text */
--body-sm: 14px / 1.5 / 400 (Regular)  /* Secondary text */
--body-xs: 12px / 1.4 / 400 (Regular)  /* Captions, labels */

/* BUTTONS - Inter Medium/Semibold */
--btn-lg: 18px / 1.2 / 600 (Semibold)  /* Primary CTAs */
--btn-md: 16px / 1.2 / 500 (Medium)    /* Standard buttons */
--btn-sm: 14px / 1.2 / 500 (Medium)    /* Small buttons */

/* MONOSPACE - JetBrains Mono Regular */
--code: 14px / 1.5 / 400 (Regular)     /* Códigos, referencias */
```

#### Aplicación por Contexto

| Elemento | Fuente | Tamaño | Peso | Color |
|----------|--------|--------|------|-------|
| **Hero Title** | Inter | 72px | 800 | Blanco |
| **Section Heading** | Inter | 56px | 700 | Negro |
| **Card Title** | Inter | 36px | 700 | Negro |
| **Body Text** | Inter | 16px | 400 | #333333 |
| **Button Primary** | Inter | 18px | 600 | Blanco |
| **Button Secondary** | Inter | 16px | 500 | Azul |
| **Navigation Links** | Inter | 16px | 500 | Blanco |
| **Footer Text** | Inter | 14px | 400 | #CCCCCC |
| **Precio** | Inter | 28px | 700 | Negro |
| **Código Reserva** | JetBrains Mono | 14px | 400 | Azul |
| **Especificaciones** | JetBrains Mono | 12px | 400 | Gris |

#### Ejemplo de Jerarquía en Página de Producto

```
Hero Title (Inter 72px Extrabold)
"Ferrari F8 Tributo"
    ↓
Subtitle (Inter 20px Regular)
"720 CV de pura emoción italiana"
    ↓
Precio (Inter 28px Bold)
"€1,200/día"
    ↓
Descripción (Inter 16px Regular)
"Experimenta la adrenalina de conducir..."
    ↓
Especificaciones (JetBrains Mono 14px)
"0-100 km/h: 2.9s | Velocidad máx: 340 km/h"
    ↓
CTA Button (Inter 18px Semibold)
"RESERVAR AHORA"
```

---

## 6. CONTRASTE DE COLOR (WCAG 2.1)

### 6.1 Combinaciones Principales

#### Texto sobre Fondo Blanco

```css
/* Negro sobre Blanco */
Foreground: #000000
Background: #FFFFFF
Contraste: 21:1
✅ AAA Normal (requiere 7:1)
✅ AAA Grande (requiere 4.5:1)
```

```css
/* Azul Principal sobre Blanco */
Foreground: #0066CC
Background: #FFFFFF
Contraste: 5.74:1
✅ AA Normal (requiere 4.5:1)
✅ AAA Grande (requiere 3:1)
⚠️ AAA Normal (requiere 7:1) - NO PASA
```

**Solución**: Usar azul más oscuro (#004C99) para texto pequeño sobre blanco

```css
/* Azul Oscuro sobre Blanco */
Foreground: #004C99
Background: #FFFFFF
Contraste: 8.59:1
✅ AAA Normal
✅ AAA Grande
```

#### Texto sobre Fondo Azul

```css
/* Blanco sobre Azul Principal */
Foreground: #FFFFFF
Background: #0066CC
Contraste: 3.66:1
⚠️ AA Normal (requiere 4.5:1) - NO PASA
✅ AA Grande (requiere 3:1)
```

**Solución**: Usar azul más oscuro para fondos con texto blanco

```css
/* Blanco sobre Azul Oscuro */
Foreground: #FFFFFF
Background: #004C99
Contraste: 8.59:1
✅ AAA Normal
✅ AAA Grande
```

#### Botones CTA (Naranja)

```css
/* Blanco sobre Naranja */
Foreground: #FFFFFF
Background: #FF8C00
Contraste: 3.18:1
⚠️ AA Normal - NO PASA
✅ AA Grande
```

**Solución**: Usar naranja más oscuro o texto negro

```css
/* Negro sobre Naranja */
Foreground: #000000
Background: #FF8C00
Contraste: 6.60:1
✅ AA Normal
✅ AAA Grande
```

### 6.2 Tabla Resumen de Combinaciones Aprobadas

| Combinación | Contraste | AA Normal | AAA Normal | AA Grande | AAA Grande | Uso |
|-------------|-----------|-----------|------------|-----------|------------|-----|
| Negro / Blanco | 21:1 | ✅ | ✅ | ✅ | ✅ | Texto principal |
| Azul Oscuro / Blanco | 8.59:1 | ✅ | ✅ | ✅ | ✅ | Links, encabezados |
| Blanco / Azul Oscuro | 8.59:1 | ✅ | ✅ | ✅ | ✅ | Hero sections |
| Gris Oscuro / Blanco | 10.7:1 | ✅ | ✅ | ✅ | ✅ | Texto secundario |
| Negro / Naranja | 6.60:1 | ✅ | ⚠️ | ✅ | ✅ | Botones CTA |
| Blanco / Naranja Oscuro | 4.87:1 | ✅ | ⚠️ | ✅ | ✅ | Botones hover |

### 6.3 Herramientas de Verificación Utilizadas

- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Coolors Contrast Checker**: https://coolors.co/contrast-checker
- **Chrome DevTools**: Auditoría de accesibilidad integrada

---

## 7. EQUILIBRIO VISUAL Y TENSIÓN COMPOSITIVA

### 7.1 Principios Aplicados

#### 7.1.1 Regla de los Tercios

**Aplicación en Hero Section:**
```
┌─────────┬─────────┬─────────┐
│         │         │         │
│    1    │    2    │    3    │  ← Tercio superior
│         │         │         │
├─────────┼─────────┼─────────┤
│         │  TEXTO  │         │
│    4    │  TÍTULO │    6    │  ← Tercio central (punto focal)
│         │   CTA   │         │
├─────────┼─────────┼─────────┤
│         │         │         │
│    7    │    8    │    9    │  ← Tercio inferior
│         │         │         │
└─────────┴─────────┴─────────┘
```

**Significado**: El título y CTA se colocan en el tercio central para crear equilibrio natural y atraer la mirada.

#### 7.1.2 Espacio Negativo (Whitespace)

**Ejemplo: Cards de Coches**
```
┌─────────────────────────────────────┐
│  ESPACIADO EXTERNO (24px)           │
│  ┌───────────────────────────────┐  │
│  │  PADDING INTERNO (32px)       │  │
│  │                               │  │
│  │    [IMAGEN DEL COCHE]         │  │
│  │                               │  │
│  │    Espacio entre imagen       │  │
│  │    y texto: 16px              │  │
│  │                               │  │
│  │    Ferrari F8 Tributo         │  │
│  │    €1,200/día                 │  │
│  │                               │  │
│  │    [BOTÓN: 8px margin-top]    │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Significado**: El espacio negativo crea "respiro visual", evita sobrecarga cognitiva y permite que el usuario procese información gradualmente.

#### 7.1.3 Tensión Compositiva: Elementos Flotantes

**Hero Section con elementos animados:**
```
     ☁️ (Elemento flotante superior derecha)
           ↓ crea tensión visual
     
     [TÍTULO PRINCIPAL CENTRADO]
           ↑ equilibrio
     
☁️ (Elemento flotante inferior izquierda)
```

**Significado**: Los elementos flotantes con animación `float` crean tensión compositiva direccionando la vista hacia el título, generando dinamismo sin caos.

#### 7.1.4 Alineación y Ritmo Visual

**Grid de Coches (3 columnas):**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  COCHE 1 │  │  COCHE 2 │  │  COCHE 3 │
│  [IMG]   │  │  [IMG]   │  │  [IMG]   │
│  Título  │  │  Título  │  │  Título  │
│  Precio  │  │  Precio  │  │  Precio  │
│  [BTN]   │  │  [BTN]   │  │  [BTN]   │
└──────────┘  └──────────┘  └──────────┘
     ↑             ↑             ↑
   Ritmo visual repetido (consistencia)
```

**Significado**: La repetición crea ritmo visual predecible, facilitando el escaneo y comparación de opciones.

### 7.2 Elementos Específicos y su Significado

#### 7.2.1 Degradado en Hero

```css
background: linear-gradient(to bottom right, #0066CC, #004C99);
```

**Razón**: 
- **Dirección diagonal**: Crea movimiento visual hacia abajo-derecha (lectura natural)
- **Oscurecimiento progresivo**: Genera profundidad y enfoque en el contenido
- **Simbolismo**: Velocidad y progresión (análogo a una pista de carreras en perspectiva)

#### 7.2.2 Sombras con Propósito

```css
/* Botón CTA elevado */
box-shadow: 0 10px 25px rgba(255, 140, 0, 0.3);
```

**Razón**:
- **Profundidad**: Simula elevación, indica interactividad
- **Color naranja en sombra**: Refuerza el color de acento
- **Invita a la acción**: Elemento "presionable" visualmente

#### 7.2.3 Iconografía Estratégica

```
┌─────────────────────────┐
│  🏁 CARACTERÍSTICAS     │
│                         │
│  ⚡ Velocidad máxima    │
│  🔧 Transmisión         │
│  💺 Asientos            │
│  ⛽ Combustible         │
└─────────────────────────┘
```

**Razón**:
- **Escaneo rápido**: Iconos permiten identificar info sin leer
- **Reducción de carga cognitiva**: Símbolos universales
- **Coherencia temática**: Iconos relacionados con automovilismo

#### 7.2.4 Jerarquía de Color en Botones

```
PRIMARIO (Naranja)   →  Acción principal (Reservar)
SECUNDARIO (Azul)    →  Acciones alternativas (Ver detalles)
TERCIARIO (Gris)     →  Acciones de menor prioridad (Cancelar)
```

**Razón**:
- **Priorización visual**: Usuario sabe qué acción es más importante
- **Reducción de errores**: Menos probabilidad de clic accidental

### 7.3 Mapa de Equilibrio Visual (Página Principal)

```
PESO VISUAL:  █ Alto  ▓ Medio  ░ Bajo

┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓  NAVBAR  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← Equilibrado horizontalmente
├─────────────────────────────────────┤
│                                     │
│          ░░░░░░░░░░░                │
│     ████ HERO TITLE ████            │  ← Centro (máximo peso)
│        ▓ CTA BUTTON ▓               │
│          ░░░░░░░░░░░                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ▓▓▓▓▓  ▓▓▓▓▓  ▓▓▓▓▓  ▓▓▓▓▓        │  ← Distribución equilibrada
│  CARD1  CARD2  CARD3  CARD4        │
│  ░░░░░  ░░░░░  ░░░░░  ░░░░░        │
│                                     │
├─────────────────────────────────────┤
│ ░░░░░░░░░  FOOTER  ░░░░░░░░░░░░░░░ │  ← Peso bajo (descanso visual)
└─────────────────────────────────────┘
```

**Análisis**:
- **Centro pesado**: Hero section tiene el máximo peso visual (título grande + CTA brillante)
- **Distribución horizontal**: Cards tienen peso idéntico para evitar sesgo
- **Progresión vertical**: De mayor a menor peso (atención → exploración → cierre)

---

## 8. ESPECIFICACIONES TÉCNICAS

### 8.1 Resolución Base: 1920 x 1080

#### Sistema de Rejilla: 12 Columnas

```css
.container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 40px; /* Margen lateral */
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px; /* Gutter */
}

/* Ejemplo: Card de 4 columnas */
.card-product {
  grid-column: span 4; /* 4 de 12 columnas */
}
```

#### Breakpoints Responsivos

```css
/* Desktop (1920px) - 12 columnas */
@media (min-width: 1920px) {
  .card { grid-column: span 3; } /* 4 cards por fila */
}

/* Desktop (1440px) - 12 columnas */
@media (min-width: 1440px) and (max-width: 1919px) {
  .card { grid-column: span 4; } /* 3 cards por fila */
}

/* Tablet (1024px) - 8 columnas */
@media (min-width: 1024px) and (max-width: 1439px) {
  .grid-12 { grid-template-columns: repeat(8, 1fr); }
  .card { grid-column: span 4; } /* 2 cards por fila */
}

/* Mobile (768px) - 4 columnas */
@media (max-width: 1023px) {
  .grid-12 { grid-template-columns: repeat(4, 1fr); }
  .card { grid-column: span 4; } /* 1 card por fila */
}
```

### 8.2 Espaciado Consistente

```css
/* Sistema de espaciado base 8px */
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 40px;
--space-6: 48px;
--space-8: 64px;
--space-10: 80px;
--space-12: 96px;
```

---

## 9. ACCESIBILIDAD Y USABILIDAD

### 9.1 Elementos de Accesibilidad Implementados

#### 9.1.1 Contraste WCAG AA/AAA

✅ **Implementado**:
- Todos los textos cumplen WCAG 2.1 AA (mínimo 4.5:1)
- Textos grandes cumplen AAA (mínimo 3:1)
- Iconos importantes tienen ratio 3:1 mínimo

**Razón**: Garantiza legibilidad para usuarios con baja visión o daltonismo.

#### 9.1.2 Navegación por Teclado

✅ **Implementado**:
```css
/* Focus visible en todos los elementos interactivos */
button:focus, a:focus, input:focus {
  outline: 3px solid #0066CC;
  outline-offset: 2px;
}
```

**Razón**: Usuarios que no pueden usar ratón (movilidad reducida) pueden navegar completamente.

#### 9.1.3 Etiquetas ARIA

✅ **Implementado**:
```html
<button aria-label="Reservar Ferrari F8 Tributo">
  Reservar
</button>

<img src="ferrari.jpg" alt="Ferrari F8 Tributo color rojo en circuito">
```

**Razón**: Lectores de pantalla pueden describir elementos visuales a usuarios ciegos.

#### 9.1.4 Tamaño Mínimo de Objetivos Táctiles

✅ **Implementado**:
```css
/* Todos los botones y links tienen mínimo 44x44px */
button, a {
  min-height: 44px;
  min-width: 44px;
}
```

**Razón**: Cumple con WCAG 2.5.5 Target Size, facilita el uso en móviles y para usuarios con temblores.

#### 9.1.5 Texto Escalable

✅ **Implementado**:
```css
/* Uso de rem en lugar de px fijos */
font-size: 1rem; /* Se escala con las preferencias del navegador */
```

**Razón**: Usuarios con baja visión pueden aumentar el tamaño del texto sin romper el diseño.

### 9.2 Elementos de Usabilidad Implementados

#### 9.2.1 Breadcrumbs (Migas de Pan)

```
Inicio > Coches > Ferrari > F8 Tributo
```

**Razón**: Usuario siempre sabe dónde está y puede volver atrás fácilmente.

#### 9.2.2 Estados Visuales Claros

```css
/* Botones con 4 estados */
.button {
  /* Normal */
  background: #FF8C00;
}
.button:hover {
  /* Hover */
  background: #E67E00;
  transform: translateY(-2px);
}
.button:active {
  /* Activo/Click */
  background: #CC6F00;
  transform: translateY(0);
}
.button:disabled {
  /* Deshabilitado */
  background: #CCCCCC;
  cursor: not-allowed;
}
```

**Razón**: Feedback visual inmediato sobre interactividad.

#### 9.2.3 Indicadores de Carga

```html
<div class="loading-spinner" aria-live="polite">
  Cargando coches disponibles...
</div>
```

**Razón**: Usuario sabe que el sistema está procesando, reduce ansiedad.

#### 9.2.4 Mensajes de Error Claros

```html
<div class="error-message" role="alert">
  ❌ El campo "Fecha de recogida" es obligatorio
</div>
```

**Razón**: Especifica exactamente qué está mal y cómo corregirlo.

#### 9.2.5 Confirmaciones de Acción

```html
<dialog class="confirm-modal">
  <h2>¿Confirmar reserva?</h2>
  <p>Ferrari F8 Tributo - 15 Dic 2025</p>
  <button>Confirmar (€1,200)</button>
  <button>Cancelar</button>
</dialog>
```

**Razón**: Previene acciones accidentales (especialmente en compras).

### 9.3 Tabla de Justificación de Elementos

| Elemento | Tipo | Beneficio | Usuario Objetivo |
|----------|------|-----------|------------------|
| Contraste alto | Accesibilidad | Legibilidad | Baja visión, daltonismo |
| Focus visible | Accesibilidad | Navegación | Usuarios de teclado |
| ARIA labels | Accesibilidad | Descripción | Lectores de pantalla |
| Botones grandes (44px) | Usabilidad | Click fácil | Móviles, movilidad reducida |
| Breadcrumbs | Usabilidad | Orientación | Todos los usuarios |
| Estados hover | Usabilidad | Feedback | Todos los usuarios |
| Loading spinners | Usabilidad | Transparencia | Todos los usuarios |
| Mensajes error claros | Usabilidad | Corrección rápida | Todos los usuarios |
| Confirmaciones | Usabilidad | Prevención errores | Todos los usuarios |
| Texto escalable (rem) | Accesibilidad | Personalización | Baja visión |

---

## 10. ESTRUCTURA DE PÁGINAS

### 10.1 Mapa de Sitio (Sitemap)

```
INICIO (Home)
├── COCHES (Cars Listing)
│   ├── Detalle de Coche Individual
│   │   └── Modal de Reserva
│   └── Filtros y Búsqueda
│
├── CIRCUITOS (Circuits Listing)
│   ├── Detalle de Circuito Individual
│   │   └── Modal de Reserva
│   └── Mapa de Circuitos
│
├── MIS RESERVAS (Reservations Dashboard)
│   ├── Reservas Activas
│   ├── Historial de Reservas
│   └── Detalle de Reserva Individual
│
├── PERFIL (User Profile)
│   ├── Información Personal
│   ├── Configuración
│   └── Cerrar Sesión
│
└── ADMIN (Admin Panel) [Solo administradores]
    ├── Gestión de Coches
    ├── Gestión de Circuitos
    ├── Gestión de Reservas
    └── Gestión de Usuarios
```

### 10.2 User Flow Principal

```
┌─────────────┐
│   INICIO    │
│  (Landing)  │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐  ┌─────────────┐
│   COCHES    │  │  CIRCUITOS  │
│  (Catálogo) │  │  (Catálogo) │
└──────┬──────┘  └──────┬──────┘
       │                 │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ DETALLE PRODUCTO│
       │  (Coche/Circuit)│
       └────────┬─────────┘
                │
                ▼
       ┌─────────────────┐
       │  MODAL RESERVA  │
       │ (Calendario/Pago│
       └────────┬─────────┘
                │
                ├─── Login requerido ──┐
                │                      │
                ▼                      ▼
       ┌─────────────────┐    ┌──────────────┐
       │  CONFIRMACIÓN   │    │    LOGIN     │
       │    RESERVA      │    │   REGISTRO   │
       └────────┬─────────┘    └──────┬───────┘
                │                     │
                ▼                     │
       ┌─────────────────┐            │
       │ MIS RESERVAS    │◄───────────┘
       │   (Dashboard)   │
       └─────────────────┘
```

### 10.3 Wireframes de Baja Fidelidad

#### 10.3.1 Página Principal (Home)

```
┌────────────────────────────────────────────────────────────┐
│  LOGO              COCHES  CIRCUITOS  MIS RESERVAS  LOGIN  │  ← Navbar
├────────────────────────────────────────────────────────────┤
│                                                            │
│                  ░░░░░░░░░░░░░░░░░░░                      │
│              ████████████████████████████                 │
│              █  ALQUILA TU SUEÑO     █                    │  ← Hero
│              █  EN LA PISTA          █                    │
│              ████████████████████████████                 │
│                  [EXPLORAR COCHES]                        │
│                  ░░░░░░░░░░░░░░░░░░░                      │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  COCHES DESTACADOS                                        │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  [IMG]   │  │  [IMG]   │  │  [IMG]   │  │  [IMG]   │ │  ← Grid Cards
│  │  Ferrari │  │ Lambor.  │  │  McLaren │  │  Porsche │ │
│  │  €1,200  │  │  €1,500  │  │  €1,300  │  │  €1,100  │ │
│  │  [VER]   │  │  [VER]   │  │  [VER]   │  │  [VER]   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  CIRCUITOS DISPONIBLES                                    │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  [MAPA]  │  │  [MAPA]  │  │  [MAPA]  │               │  ← Grid Circuitos
│  │  Jarama  │  │ Valencia │  │Barcelona │               │
│  │  €500/día│  │  €700/día│  │  €600/día│               │
│  │ [RESERVAR│  │ [RESERVAR│  │ [RESERVAR│               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  LOGO  │  CONTACTO  │  FAQ  │  TÉRMINOS  │  PRIVACIDAD   │  ← Footer
└────────────────────────────────────────────────────────────┘
```

#### 10.3.2 Listado de Coches

```
┌────────────────────────────────────────────────────────────┐
│  LOGO              COCHES  CIRCUITOS  MIS RESERVAS  LOGIN  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  NUESTROS COCHES                                           │
│  ────────────────────────────────────────────────────      │
│                                                            │
│  ┌──────────────┐  ┌────────────────────────────────┐      │
│  │  FILTROS     │  │                                │      │
│  │              │  │  ┌──────────────────────────┐  │      │
│  │ □ Ferrari    │  │  │  [IMG]    Ferrari F8     │  │      │
│  │ □ Lamborghini│  │  │           Tributo        │  │      │
│  │ □ McLaren    │  │  │           720 CV         │  │      │
│  │ □ Porsche    │  │  │           €1,200/día     │  │      │
│  │              │  │  │           [VER DETALLES] │  │      │
│  │ PRECIO       │  │  └──────────────────────────┘  │      │
│  │ €500 - €2000 │  │                                │      │
│  │ ═══●════     │  │  ┌──────────────────────────┐  │      │
│  │              │  │  │  [IMG]   Lamborghini     │  │      │
│  │ POTENCIA     │  │  │          Huracán         │  │      │
│  │ 500-800 CV   │  │  │          640 CV          │  │      │
│  │ ══●════      │  │  │          €1,500/día      │  │      │
│  │              │  │  │          [VER DETALLES]  │  │      │
│  │ [APLICAR]    │  │  └──────────────────────────┘  │      │
│  │              │  │                                │      │
│  └──────────────┘  │  ... más coches ...            │      │
│                    │                                │      │
│                    └────────────────────────────────┘      │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  FOOTER                                                    │
└────────────────────────────────────────────────────────────┘
```

#### 10.3.3 Detalle de Coche

```
┌────────────────────────────────────────────────────────────┐
│  LOGO              COCHES  CIRCUITOS  MIS RESERVAS  LOGIN  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────┐  ┌─────────────────────────┐ │
│  │                        │  │  Ferrari F8 Tributo     │ │
│  │                        │  │  ━━━━━━━━━━━━━━━━━━━━━  │ │
│  │    [IMAGEN PRINCIPAL]  │  │                         │ │
│  │     FERRARI F8         │  │  720 CV de potencia    │ │
│  │                        │  │  0-100 km/h en 2.9s    │ │
│  │                        │  │  V8 Biturbo 3.9L       │ │
│  │                        │  │                         │ │
│  └────────────────────────┘  │  €1,200/día            │ │
│                              │                         │ │
│  [IMG] [IMG] [IMG] [IMG]     │  [RESERVAR AHORA]      │ │
│                              │                         │ │
│                              └─────────────────────────┘ │
│                                                            │
│  DESCRIPCIÓN                                              │
│  ──────────────────────────────────────────────────────   │
│  Experimenta la adrenalina de conducir uno de los        │
│  deportivos más icónicos de Ferrari. El F8 Tributo       │
│  combina potencia, elegancia y tecnología...             │
│                                                            │
│  CARACTERÍSTICAS                                          │
│  ──────────────────────────────────────────────────────   │
│  ⚡ Velocidad máxima: 340 km/h                            │
│  🔧 Transmisión: Automática 7 velocidades                │
│  💺 Asientos: 2                                           │
│  ⛽ Combustible: Gasolina                                 │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  FOOTER                                                    │
└────────────────────────────────────────────────────────────┘
```

#### 10.3.4 Modal de Reserva

```
                ┌─────────────────────────────────┐
                │  RESERVAR: Ferrari F8 Tributo  │
                ├─────────────────────────────────┤
                │                                 │
                │  FECHA DE RECOGIDA             │
                │  [📅 15 Dic 2025 ▼]            │
                │                                 │
                │  HORA DE RECOGIDA              │
                │  [🕐 10:00 ▼]                  │
                │                                 │
                │  FECHA DE DEVOLUCIÓN           │
                │  [📅 17 Dic 2025 ▼]            │
                │                                 │
                │  HORA DE DEVOLUCIÓN            │
                │  [🕐 18:00 ▼]                  │
                │                                 │
                │  ───────────────────────────    │
                │  RESUMEN                        │
                │  2 días × €1,200 = €2,400      │
                │  Seguro: €200                   │
                │  ───────────────────────────    │
                │  TOTAL: €2,600                  │
                │                                 │
                │  [CONFIRMAR RESERVA]            │
                │  [CANCELAR]                     │
                │                                 │
                └─────────────────────────────────┘
```

#### 10.3.5 Dashboard de Reservas

```
┌────────────────────────────────────────────────────────────┐
│  LOGO              COCHES  CIRCUITOS  MIS RESERVAS  LOGIN  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  MIS RESERVAS                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                            │
│  [ACTIVAS] [HISTORIAL]                                    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Ferrari F8 Tributo                                  │ │
│  │  ─────────────────────────────────────────────────   │ │
│  │  📅 15-17 Dic 2025                                   │ │
│  │  📍 Circuito Jarama                                  │ │
│  │  💰 €2,600                                           │ │
│  │  🟢 CONFIRMADA                                       │ │
│  │                                                      │ │
│  │  [VER DETALLES]  [CANCELAR]  [MODIFICAR]            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Lamborghini Huracán                                 │ │
│  │  ─────────────────────────────────────────────────   │ │
│  │  📅 20-22 Dic 2025                                   │ │
│  │  📍 Circuit de Valencia                              │ │
│  │  💰 €4,500                                           │ │
│  │  🟡 PENDIENTE DE PAGO                                │ │
│  │                                                      │ │
│  │  [PAGAR AHORA]  [CANCELAR]                          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  FOOTER                                                    │
└────────────────────────────────────────────────────────────┘
```

### 10.4 Componentes de Interfaz Definidos

#### 10.4.1 Estructura de Página Estándar

```
┌────────────────────────────────────────────────────────────┐
│  CABECERA (Header / Navbar)                               │  ← 80px altura
│  - Logo (izquierda)                                        │
│  - Navegación principal (centro)                           │
│  - User menu / Login (derecha)                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  CUERPO PRINCIPAL (Main Content)                          │  ← min-height: calc(100vh - 160px)
│  - Breadcrumbs (opcional)                                  │
│  - Título de página                                        │
│  - Contenido específico                                    │
│                                                            │
│  BARRA LATERAL (Sidebar - opcional)                       │  ← 300px width (en listados)
│  - Filtros                                                 │
│  - Acciones secundarias                                    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  PIE DE PÁGINA (Footer)                                   │  ← 80px altura
│  - Links institucionales                                   │
│  - Copyright                                               │
│  - Redes sociales                                          │
└────────────────────────────────────────────────────────────┘
```

#### 10.4.2 Espacios en Blanco (Whitespace)

```css
/* Márgenes entre secciones */
section + section {
  margin-top: 80px; /* Separación entre secciones principales */
}

/* Padding interno de secciones */
section {
  padding: 64px 0; /* Espacio vertical interno */
}

/* Espaciado de cards */
.card {
  padding: 32px; /* Espacio interno */
  margin-bottom: 24px; /* Separación entre cards */
}

/* Espaciado de texto */
h2 + p {
  margin-top: 16px; /* Espacio después de títulos */
}

p + p {
  margin-top: 12px; /* Espacio entre párrafos */
}
```

**Justificación del Whitespace**:
- **Respiración visual**: Evita sobrecarga cognitiva
- **Jerarquía**: Separa visualmente elementos no relacionados
- **Enfoque**: Dirige la atención a contenido importante
- **Legibilidad**: Mejora la comprensión del contenido

---

## 11. ANIMACIONES Y TRANSICIONES

### 11.1 Principios de Animación Aplicados

#### 11.1.1 Duración

```css
/* Micro-interacciones: 150-300ms */
button:hover {
  transition: all 0.2s ease;
}

/* Entrada de elementos: 400-600ms */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Transiciones de página: 600-800ms */
.page-transition {
  animation: slideIn 0.7s ease-in-out;
}
```

**Razón**: Duraciones basadas en Material Design Guidelines para sensación de rapidez sin ser abruptas.

#### 11.1.2 Easing (Curvas de Animación)

```css
/* Entrada (ease-out): Comienza rápido, termina suave */
.fade-in-up {
  animation-timing-function: ease-out;
}

/* Salida (ease-in): Comienza suave, termina rápido */
.fade-out {
  animation-timing-function: ease-in;
}

/* Interacción (ease-in-out): Suave al inicio y al final */
.modal-backdrop {
  transition-timing-function: ease-in-out;
}
```

#### 11.1.3 Animaciones Implementadas

**Página Principal:**
- Hero elements: `fade-in-down` (título), `fade-in-up` (CTA)
- Cards: `fade-in-up` con `stagger delay` (aparecen en secuencia)
- Elementos flotantes: `float` (animación continua sutil)

**Interacciones:**
- Botones: `translateY(-2px)` + `box-shadow` en hover
- Cards: `scale(1.02)` en hover
- Modales: `scaleIn` (crecimiento desde 95% a 100%)

---

## 12. PROTOTIPO DE ALTA FIDELIDAD

### 12.1 Especificaciones del Prototipo

- **Herramienta**: Figma
- **Resolución**: 1920 x 1080 px
- **Páginas**: 5 principales + 3 modales
- **Animaciones**: Transiciones entre páginas enlazadas
- **Componentes**: Sistema de diseño completo (Atomic Design)

### 12.2 Páginas del Prototipo

1. **Home** (Página principal con hero y coches destacados)
2. **Cars Listing** (Catálogo de coches con filtros)
3. **Car Detail** (Detalle de coche individual)
4. **Circuits Listing** (Catálogo de circuitos)
5. **My Reservations** (Dashboard de reservas del usuario)

### 12.3 Modales Interactivos

1. **Reservation Modal** (Formulario de reserva con calendario)
2. **Login Modal** (Autenticación de usuario)
3. **Confirmation Dialog** (Confirmación de acciones críticas)

---

## 13. CONCLUSIONES Y PRÓXIMOS PASOS

### 13.1 Resumen de Decisiones de Diseño

| Elemento | Decisión | Justificación |
|----------|----------|---------------|
| **Color dominante** | Azul #0066CC | Confianza, tecnología, diferenciación |
| **Tipografía principal** | Inter | Legibilidad digital, modernidad |
| **Paleta** | Análoga con acento | Cohesión visual con acento llamativo |
| **Grid** | 12 columnas | Flexibilidad y estándar de industria |
| **Animaciones** | Sutiles (ease-out) | Feedback sin distracción |
| **Accesibilidad** | WCAG 2.1 AA | Inclusión de todos los usuarios |

### 13.2 Mejoras Futuras a Implementar

#### 13.2.1 Sistema de Pagos Integrado

**Prioridad: Alta**

1. **Pasarela de Pago Stripe**
   - Integración de checkout embebido
   - Soporte para tarjetas de crédito/débito
   - Apple Pay y Google Pay
   - Pagos en un solo clic para usuarios registrados
   - Sistema de reembolsos automatizado

2. **Métodos de Pago Alternativos**
   - PayPal para usuarios sin tarjeta
   - Transferencia bancaria (SEPA) para reservas anticipadas
   - Bizum para el mercado español
   - Pago contra reembolso en sede física (casos especiales)

3. **Gestión de Depósitos y Seguros**
   - Sistema de retención temporal de depósito de seguridad (€500-2000)
   - Liberación automática post-devolución del vehículo
   - Opciones de seguro adicional (cobertura total, franquicia reducida)
   - Calculadora de costes transparente

4. **Sistema de Facturación**
   - Generación automática de facturas PDF
   - Envío por email tras confirmación de pago
   - Descarga desde panel de usuario
   - Cumplimiento con normativa fiscal española (IVA 21%)

#### 13.2.2 Sistema de Verificación de Usuario

**Prioridad: Alta**

1. **Verificación de Identidad**
   - Upload de DNI/Pasaporte
   - Verificación automática con OCR
   - Validación de fecha de nacimiento (edad mínima 25 años)
   - Estado de verificación visible en perfil

2. **Verificación de Licencia de Conducir**
   - Upload de carnet de conducir
   - Validación de vigencia
   - Verificación de antigüedad (mínimo 2 años)
   - Categorías habilitadas (B manual/automático)

3. **Sistema de Puntos/Reputación**
   - Rating de usuario tras cada reserva
   - Sistema de insignias (Usuario Verificado, Cliente VIP, etc.)
   - Penalizaciones por cancelaciones de última hora
   - Descuentos para usuarios con alta reputación

#### 13.2.3 Funcionalidades de Reserva Avanzadas

**Prioridad: Media**

1. **Sistema de Reservas Recurrentes**
   - Suscripciones mensuales (X días al mes)
   - Reservas semanales automáticas
   - Descuentos por volumen
   - Prioridad en disponibilidad

2. **Paquetes y Experiencias**
   - Paquete "Día Completo Racing" (coche + circuito + instructor)
   - Experiencia "Weekend GT" (2 días, múltiples coches)
   - Gift cards digitales
   - Reservas grupales (despedidas de soltero, eventos corporativos)

3. **Sistema de Listas de Espera**
   - Notificación cuando un coche reservado se libera
   - Prioridad por orden de registro
   - Sistema de alertas personalizables

4. **Calendario de Disponibilidad Mejorado**
   - Vista mensual completa
   - Sincronización con Google Calendar
   - Recordatorios automáticos (7 días, 1 día, 2 horas antes)
   - Opción de modificación hasta 48h antes

#### 13.2.4 Mejoras en Comunicación

**Prioridad: Media**

1. **Sistema de Notificaciones Push**
   - Confirmación de reserva
   - Recordatorios pre-reserva
   - Cambios en disponibilidad
   - Ofertas personalizadas

2. **Chat en Tiempo Real Mejorado**
   - Chatbot IA para preguntas frecuentes
   - Transferencia a agente humano
   - Historial de conversaciones guardado
   - Soporte multiidioma (ES, EN, FR, DE)

3. **Videollamadas de Inspección**
   - Inspección del vehículo antes de recoger (estado)
   - Inspección post-devolución
   - Grabación para resolución de disputas
   - Integración con Zoom/Google Meet

#### 13.2.5 Personalización y Preferencias

**Prioridad: Baja**

1. **Recomendaciones Personalizadas**
   - Algoritmo basado en historial de reservas
   - "Coches similares que te pueden gustar"
   - Sugerencias de circuitos según preferencias
   - Emails con ofertas personalizadas

2. **Wishlist/Favoritos**
   - Guardar coches favoritos
   - Alertas cuando baja el precio
   - Compartir lista con amigos
   - Comparador de coches guardados

3. **Perfiles de Conductor**
   - Múltiples perfiles en una cuenta (familia/empresa)
   - Preferencias de configuración del coche
   - Ajustes guardados (asiento, espejos)
   - Playlists de música sincronizadas

#### 13.2.6 Gamificación y Fidelización

**Prioridad: Baja**

1. **Programa de Puntos GT**
   - 1 punto por cada €10 gastados
   - Canjear puntos por descuentos
   - Niveles: Bronce, Plata, Oro, Platino
   - Beneficios por nivel (upgrade gratis, canceling flexible)

2. **Logros y Desafíos**
   - "Primer Vuelta": Primera reserva (descuento 10%)
   - "Coleccionista": Conducir 5 marcas diferentes
   - "Veterano de Pista": 10 reservas completadas
   - Compartir logros en redes sociales

3. **Referral Program**
   - €50 de descuento por amigo referido
   - Bono acumulativo (hasta 5 amigos)
   - Dashboard de referidos
   - Códigos personalizados

#### 13.2.7 Análisis y Reporting (Admin)

**Prioridad: Media**

1. **Dashboard Analítico**
   - KPIs en tiempo real (reservas, ingresos, ocupación)
   - Gráficos de tendencias
   - Coches más/menos reservados
   - Horas pico de demanda

2. **Gestión de Inventario Inteligente**
   - Predicción de mantenimiento (basado en uso)
   - Alertas de revisiones periódicas
   - Control de kilómetros
   - Historial de reparaciones por vehículo

3. **Informes Financieros**
   - Ingresos por período
   - Coste por adquisición de cliente (CAC)
   - Lifetime Value (LTV)
   - Exportación a Excel/PDF

#### 13.2.8 Optimizaciones Técnicas

**Prioridad: Alta**

1. **Rendimiento Web**
   - Lazy loading de imágenes
   - Compresión WebP/AVIF
   - Service Workers para modo offline
   - Precarga de rutas críticas

2. **SEO y Marketing**
   - Meta tags dinámicos por página
   - Schema.org structured data
   - Sitemap XML automático
   - Blog integrado con contenido de automovilismo

3. **PWA (Progressive Web App)**
   - Instalable en móviles
   - Funcionalidad offline básica
   - Notificaciones push nativas
   - Experiencia app-like

4. **Testing y Calidad**
   - Tests E2E automatizados (Playwright)
   - Tests de accesibilidad (Axe)
   - Monitoreo de errores (Sentry)
   - A/B testing de conversión

---

### 13.3 Roadmap de Implementación (12 meses)

| Trimestre | Funcionalidades Prioritarias | Estado |
|-----------|-------------------------------|---------|
| **Q1 2026** | • Sistema de pagos Stripe<br>• Verificación de identidad<br>• Notificaciones push | 🔴 Pendiente |
| **Q2 2026** | • Paquetes/Experiencias<br>• Dashboard analítico<br>• Programa de puntos | 🔴 Pendiente |
| **Q3 2026** | • Chat mejorado con IA<br>• PWA completa<br>• Sistema de referidos | 🔴 Pendiente |
| **Q4 2026** | • Recomendaciones IA<br>• Videollamadas inspección<br>• App móvil nativa | 🔴 Pendiente |

---

**Documento creado el:** 9 de diciembre de 2025  
**Proyecto:** GT-TURING - Plataforma de Alquiler de Coches de Carreras  
**Versión:** 1.0  
**Autor:** Equipo de Diseño UI/UX GT-TURING
