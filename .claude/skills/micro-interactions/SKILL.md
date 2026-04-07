---
name: micro-interactions
description: Micro-interactions and gestural feedback for VergaMano. Use for: haptic feedback patterns, click/tap states, loading states, error animations, confirmation sequences, button states. Small animations that improve UX without overwhelming.
---

# MICRO-INTERACTIONS — Gestural Feedback & Polish

Patrones pequeños, rápidos y efectivos que hacen que la UI se sienta responsiva.

## Cuándo usar

- Feedback inmediato de clicks/taps
- Loading spinners y estados en progreso
- Confirmaciones visuales (checkmark, erro)
- Transiciones entre estados de componentes
- Indicadores de progreso animados

## PATRÓN BASE — Button States

```typescript
// Estados de botón con animaciones
const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05, boxShadow: '4px 4px 0 black' },
  tap: { scale: 0.95 },
  loading: { opacity: 0.6 },
};

<motion.button
  variants={buttonVariants}
  initial="idle"
  whileHover="hover"
  whileTap="tap"
  animate={isLoading ? "loading" : "idle"}
  transition={{ duration: 0.15 }}
>
  {isLoading ? <Spinner /> : 'Enviar'}
</motion.button>
```

## Loading states

### 1. Spinner minimalista
```typescript
<motion.div
  className="w-6 h-6 border-2 border-black border-t-transparent"
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
/>
```

### 2. Pulse de atención
```typescript
<motion.div
  animate={{ opacity: [1, 0.3, 1] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
>
  ⏳ Procesando...
</motion.div>
```

### 3. Barras de progreso
```typescript
<motion.div
  className="h-1 bg-black"
  animate={{ width: progress + '%' }}
  transition={{ duration: 0.3 }}
/>
```

## Confirmaciones (checkmark, error)

```typescript
const confirmationVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
  exit: { scale: 0, opacity: 0 },
};

// ✅ Confirmación exitosa
<motion.div variants={confirmationVariants}>
  <div className="text-4xl">✓</div>
</motion.div>

// ❌ Error
<motion.div 
  variants={confirmationVariants}
  animate={{ x: [-10, 10, -10, 0] }}  // Shake
>
  <div className="text-4xl">✗</div>
</motion.div>
```

## Estado activo/inactivo

```typescript
// Toggle con indicador visual
<motion.div
  className="flex items-center gap-2"
  layout
>
  <motion.div
    className="w-8 h-8 border-2 border-black"
    animate={{
      backgroundColor: isActive ? '#000' : '#fff',
      borderColor: isActive ? '#000' : '#ddd',
    }}
    transition={{ duration: 0.2 }}
  />
  {isActive ? 'Activo' : 'Inactivo'}
</motion.div>
```

## VergaMano-specific micro-interactions

### 1. XP ganado (flash momentáneo)
```typescript
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: [1, 1, 0], y: [0, -20, -20] }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="font-black text-green-500"
>
  +{xpAmount} XP
</motion.div>
```

### 2. HP crítico (blink)
```typescript
<motion.div
  animate={{ 
    opacity: hp < 30 ? [1, 0.3, 1] : 1,
    backgroundColor: hp < 30 ? '#FF0000' : '#f4f1eb'
  }}
  transition={{ 
    repeat: hp < 30 ? Infinity : 0,
    duration: 0.5 
  }}
>
  HP: {hp}
</motion.div>
```

### 3. Level up (pop effect)
```typescript
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ 
    type: 'spring',
    stiffness: 200,
    damping: 10
  }}
>
  🎉 ¡LEVEL {newLevel}!
</motion.div>
```

### 4. Pilar unlocked (slide in)
```typescript
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
  className="p-4 border-4 border-black"
>
  Nuevo Pilar Desbloqueado: {pilar}
</motion.div>
```

## Timing reference

```typescript
// Feedback inmediato (user siente acción)
0.15s  → tap feedback
0.2s   → hover effect
0.3s   → modal fade-in
0.5s   → XP animation
0.8s   → level up pop
1.0s   → nivel máximo permitido
```

**Regla**: Si tarda > 0.3s, debe ser claramente intencional (animation, no lag).

## Anti-patrones

```
❌ Animaciones que distraen del contenido
❌ Transiciones > 1 segundo (salvo casos especiales)
❌ Múltiples animaciones simultáneas confusas
❌ Falta de feedback en acciones críticas
✅ Feedback inmediato en interacciones
✅ Transiciones suaves pero rápidas
✅ Una animación principal por contexto
```

## Testing micro-interactions

```bash
# Ver cómo se ve en slow motion (DevTools)
# Chrome → Animations → Playback rate slider
```
