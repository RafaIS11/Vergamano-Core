---
name: framer-motion-patterns
description: Framer Motion animation patterns for VergaMano. Use for: React component animations, state transitions, gesture handling, page transitions, orchestrated sequences. Covers variants, spring physics, exit animations, and performance optimization.
---

# FRAMER MOTION PATTERNS — VergaMano Animation Engine

Versión: `framer-motion@12.34.3` (ya instalada en el proyecto)

## Cuándo usar

- Animar componentes React basado en estado
- Transiciones entre vistas/pilares
- Gestos (hover, tap, drag)
- Secuencias orquestadas de múltiples elementos
- Animaciones de entrada/salida (exit animations)

## PATRÓN BASE — Variant System

```typescript
import { motion } from 'framer-motion';

// Definir variantes
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Usar en componente
<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Contenido
</motion.div>
```

## Timing y Easing para VergaMano

```typescript
// Rápido (UI feedback inmediato)
transition={{ duration: 0.15, ease: 'easeOut' }}

// Normal (transiciones estándar)
transition={{ duration: 0.3, ease: 'easeOut' }}

// Suave (animaciones elaboradas)
transition={{ duration: 0.5, ease: 'easeInOut' }}

// Spring (física natural — nivel up, XP)
transition={{ type: 'spring', stiffness: 100, damping: 15 }}
```

**Regla VergaMano**: Nunca > 0.5s — mantén fluido.

## Gestos interactivos

```typescript
<motion.div
  whileHover={{ scale: 1.05, boxShadow: '4px 4px 0 black' }}
  whileTap={{ scale: 0.95 }}
  onClick={handleClick}
>
  Clickeable
</motion.div>
```

## Secuencias y stagger

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Delay entre hijos
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

## AnimatePresence — Exit animations

```typescript
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="modal"
    >
      Modal
    </motion.div>
  )}
</AnimatePresence>
```

## Casos de uso VergaMano

| Caso | Implementación |
|------|---|
| **Level up flash** | Spring transition + opacity 0→1→0 |
| **XP bar fill** | width: 0→100%, duration: 0.5s |
| **Pilar switch** | Opacity 0→1 + slide, stagger si multiple |
| **HP crítico blink** | opacity: 0→1, repeat: Infinity |
| **Modal aparición** | Scale 0.8→1 + opacity 0→1 |
| **Void overlay** | Opacity 0→0.8, duration: 0.2s |

## Performance

```typescript
// ✅ Usar transform/opacity (GPU accelerated)
<motion.div animate={{ x: 100, opacity: 0.5 }} />

// ❌ Evitar layout shifts (width, height en animación)
// <motion.div animate={{ width: 100 }} />  // MAL

// ✅ Usar layout si absolutamente necesario
<motion.div layout animate={{ height: 'auto' }} />
```

## Anti-patrones

```
❌ Animar múltiples propiedades layout (width, height, padding)
❌ Secuencias > 3 elementos sin stagger
❌ Spring en animaciones rápidas (< 200ms)
❌ Opacity y transform juntos sin medida
✅ Usar transform + opacity
✅ Stagger para listas
✅ Exit animations con AnimatePresence
```
