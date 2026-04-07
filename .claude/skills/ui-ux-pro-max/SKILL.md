---
name: ui-ux-pro-max
description: Design intelligence for VergaMano UI. Invoke for ANY new component, color decision, typography, animation, or UI review. Enforces brutalismo B&W + Space Mono + gamification aesthetics.
---

# UI/UX PRO MAX — VergaMano Edition

Soy el sistema de diseño de VergaMano. Brutalismo Digital. Sin blur. Sin gradientes. Solo bloques sólidos.

## INVOCAR OBLIGATORIAMENTE cuando:
- Creas un componente nuevo en `src/components/vergamano/`
- Cambias colores, tipografía o espaciado
- Diseñas animaciones o transiciones
- Haces review de UI antes de commit
- Implementas estados de juego (HP bajo, level up, void)

## SISTEMA DE DISEÑO VERGAMANO

### Paleta de colores
```
Background:   #f4f1eb  (papel envejecido — base)
Primary:      #000000  (negro puro)
Surface:      #ffffff  (blanco puro)
Accent:       #000000  (sin color de acento — todo es B&W)
Void:         #000000  (modo castigo — overlay)

-- Excepciones de estado (únicas permitidas) --
HP crítico:   #FF0000  (solo en indicadores de HP < 30%)
XP ganado:    #00FF00  (solo flash momentáneo en level up)
Pilares (solo iconos/badges, no fondos):
  Architect:  #4A90E2  (azul)
  Spartan:    #E24A4A  (rojo)
  Mercenary:  #4AE2A0  (verde)
  Nomad:      #E2C14A  (amarillo)
  Ghost:      #9B4AE2  (púrpura)
```

### Tipografía
```
Font family:  'Space Mono', monospace — SIEMPRE, sin excepción
Weights:      400 (body), 700 (bold), no otros
Sizes:        12px (meta), 14px (body), 18px (h3), 24px (h2), 32px+ (h1)
Transform:    uppercase en títulos y labels
Tracking:     tracking-widest en títulos
Line-height:  1.4 body, 1.2 headings
```

### Borders y shadows (identidad visual)
```css
/* Border estándar */
border: 2px solid black;

/* Shadow de bloque (NO box-shadow difuso) */
box-shadow: 4px 4px 0 black;   /* pequeño */
box-shadow: 6px 6px 0 black;   /* mediano */
box-shadow: 8px 8px 0 black;   /* grande — hover */

/* Hover state */
transform: translate(-2px, -2px);
box-shadow: 6px 6px 0 black;

/* Active/pressed */
transform: translate(2px, 2px);
box-shadow: 2px 2px 0 black;
```

### Spacing (grid de 4px)
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
NO usar valores arbitrarios
```

## COMPONENTES VERGAMANO — PATRONES

### Botón primario
```tsx
<button className="
  font-mono font-bold uppercase tracking-widest
  border-2 border-black px-6 py-3
  bg-black text-white
  hover:translate-x-[-2px] hover:translate-y-[-2px]
  hover:shadow-[6px_6px_0_black]
  active:translate-x-[2px] active:translate-y-[2px]
  transition-all duration-150
">
```

### Card de misión/tarea
```tsx
<div className="
  border-2 border-black p-4
  shadow-[4px_4px_0_black]
  bg-[#f4f1eb]
  hover:shadow-[6px_6px_0_black]
  hover:translate-x-[-2px] hover:translate-y-[-2px]
  transition-all duration-150
">
```

### Barra de HP/XP
```tsx
<div className="w-full h-4 border-2 border-black bg-white">
  <div 
    className="h-full bg-black transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Badge de pilar (única excepción de color)
```tsx
const pillarColors = {
  architect: '#4A90E2',
  spartan: '#E24A4A',
  mercenary: '#4AE2A0',
  nomad: '#E2C14A',
  ghost: '#9B4AE2'
};
<span 
  className="font-mono text-xs uppercase tracking-widest px-2 py-1 border border-black font-bold"
  style={{ backgroundColor: pillarColors[pilar], color: '#000' }}
>
```

## ANIMACIONES (framer-motion patterns)

```tsx
// Entrada de componente
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.2 }}

// Level up flash
initial={{ scale: 1 }}
animate={{ scale: [1, 1.2, 1] }}
transition={{ duration: 0.3 }}

// The Void pulse (HP crítico)
animate={{ opacity: [0.3, 1, 0.3] }}
transition={{ duration: 2, repeat: Infinity }}
```

## ANTI-PATRONES (NUNCA en VergaMano)
- ❌ `border-radius > 4px` (excepto pills de tags)
- ❌ `blur()` o `backdrop-filter`
- ❌ Gradientes suaves (linear-gradient con colores distintos a B&W)
- ❌ Sombras difusas (`box-shadow: 0 4px 20px rgba(...)`)
- ❌ Colores pastel o paletas de color para fondos
- ❌ Fuentes distintas a Space Mono
- ❌ Animaciones > 300ms (excepto The Void)
- ❌ Íconos de emoji — usar SVG o texto

## QA CHECKLIST (antes de cada commit de UI)
- [ ] ¿Space Mono en todos los textos?
- [ ] ¿Borders solid 2px?
- [ ] ¿Shadow de bloque (no difuso)?
- [ ] ¿Hover con translate + shadow increase?
- [ ] ¿Animaciones < 300ms?
- [ ] ¿Sin colores de fondo excepto #f4f1eb, #000, #fff?
- [ ] ¿Estados de pilar usan solo los colores definidos?
