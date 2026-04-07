---
name: tailwind-animations
description: Tailwind CSS animations and transitions for VergaMano. Use for: CSS-only animations, state-based animations, utility-driven effects, smooth transitions between Tailwind classes. Covers animation utilities, transition duration, and custom keyframes.
---

# TAILWIND ANIMATIONS — CSS-Driven Motion

Versión: `tailwindcss@3.4.19` + `tailwindcss-animate@1.0.7`

## Cuándo usar

- Transiciones entre estados Tailwind
- Animaciones CSS puras (sin JS)
- Hover/focus/active effects
- Pulsaciones, spins, fades
- Combinaciones de animaciones en cascada

**vs Framer Motion**: Tailwind = simple + performante. Framer = complejo + flexible.

## Animaciones built-in

```html
<!-- Fade in/out -->
<div class="animate-fadeIn"></div>

<!-- Pulse (para UI activo/atención) -->
<div class="animate-pulse"></div>

<!-- Spin (loaders) -->
<div class="animate-spin"></div>

<!-- Bounce (atención) -->
<div class="animate-bounce"></div>

<!-- Ping (efecto radar) -->
<div class="animate-ping"></div>
```

## Transiciones suaves

```html
<!-- Duración y timing -->
<button class="transition-all duration-300 ease-out hover:scale-105">
  Botón
</button>

<!-- Solo propiedades específicas -->
<div class="transition-colors duration-200">
  Cambia color suavemente
</div>
```

## Duraciones disponibles

```
duration-75    → 75ms
duration-100   → 100ms
duration-150   → 150ms
duration-200   → 200ms
duration-300   → 300ms  ← estándar VergaMano
duration-500   → 500ms
duration-700   → 700ms
duration-1000  → 1000ms (máximo recomendado)
```

## Easing functions

```
ease-linear    → uniforme
ease-in        → lento al inicio
ease-out       → lento al final
ease-in-out    → lento en ambos extremos
```

## Custom animations en Tailwind

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        // HP bajo — blink
        "hp-critical": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        // Level up — pop
        "level-up": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // XP bar fill
        "xp-fill": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "hp-critical": "hp-critical 0.5s infinite",
        "level-up": "level-up 0.6s ease-out",
        "xp-fill": "xp-fill 0.8s ease-out",
      },
    },
  },
};
```

**Usar en componente**:
```html
<div class="animate-level-up">Level Up!</div>
<div class="animate-hp-critical">⚠️ HP CRÍTICO</div>
```

## Combinaciones útiles para VergaMano

| Caso | Clases Tailwind |
|------|---|
| **Botón interactivo** | `transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95` |
| **Modal fade-in** | `animate-fadeIn duration-300` |
| **Loading spinner** | `animate-spin border-4 border-black border-t-transparent` |
| **Notification entrada** | `animate-slideIn duration-300` |
| **XP ganado flash** | `animate-pulse duration-200` (rápido) |
| **Void overlay** | `animate-fadeIn duration-200` |
| **Pilar card hover** | `transition-all duration-300 hover:shadow-[4px_4px_0_black]` |

## Tailwind + Framer Motion

```typescript
// Combina: Tailwind para base, Framer para orquestación
<motion.div
  className="transform transition-all duration-300"
  whileHover={{ scale: 1.05 }}
>
  Mejor que ambos por separado
</motion.div>
```

## Performance best practices

```html
<!-- ✅ Usa will-change sparingly -->
<div class="will-change-transform hover:scale-110 transition-transform"></div>

<!-- ✅ GPU acceleration -->
<div class="transform transition-transform"></div>

<!-- ❌ Evitar animaciones de layout -->
<!-- <div class="animate-... w-full" /> muy pesado -->
```

## Disabled animations (respeta prefers-reduced-motion)

```html
<div class="motion-safe:animate-bounce motion-reduce:block">
  Respeta preferencias de usuario
</div>
```
