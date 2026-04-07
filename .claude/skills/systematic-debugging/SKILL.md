---
name: systematic-debugging
description: 4-phase root cause analysis for bugs. Use when a bug is unclear, repeated, or affects Supabase Realtime channels. Never guess — trace to root cause first.
---

# SYSTEMATIC DEBUGGING — Análisis de Causa Raíz

Proceso de 4 fases para diagnosticar bugs de forma sistemática. Para VergaMano: Realtime channels, TypeScript errors, Supabase queries.

## Las 4 fases

### Fase 1 — REPRODUCIR
```
1. Identificar síntoma exacto (mensaje de error, comportamiento)
2. Reproducir consistentemente (¿siempre? ¿bajo qué condiciones?)
3. Aislar: ¿en dev? ¿en prod? ¿ambos?
4. Documentar: qué input → qué output vs esperado
```

### Fase 2 — RASTREAR
```
1. Leer los logs completos (no solo el error final)
2. Trazar hacia atrás desde el error: ¿qué lo causó?
3. Verificar assumptions: ¿los datos llegan correctamente?
4. Identificar el componente/función exacta del fallo
```

### Fase 3 — HIPÓTESIS
```
1. Formular 2-3 hipótesis ordenadas por probabilidad
2. Diseñar test para cada hipótesis (sin cambiar código aún)
3. Ejecutar el test más simple primero
4. Confirmar o descartar con evidencia, no intuición
```

### Fase 4 — FIX + VERIFICAR
```
1. Aplicar fix mínimo (solo lo que resuelve el root cause)
2. Verificar que el síntoma desaparece
3. Verificar que no se rompió nada más (npm run build)
4. Documentar: qué era, por qué pasó, cómo se resolvió
```

## Bugs comunes en VergaMano

### Supabase Realtime channel leak
```
Síntoma: Multiple GoTrueClient instances / channel subscribed twice
Root cause: useEffect sin cleanup o component re-mount
Fix: supabase.removeChannel(channel) en return del useEffect
```

### TypeScript types desincronizados
```
Síntoma: Property X does not exist on type Profile
Root cause: Schema Supabase cambió pero types/game.ts no
Fix: supabase-guardian → generate_typescript_types
```

### Build pasa local pero falla en Vercel
```
Síntoma: Deploy error en Vercel, local funciona
Root cause: Env vars no configuradas en Vercel, o imports absolutos
Fix: deploy-watcher → get_deployment_build_logs → línea exacta
```

### Realtime no dispara eventos
```
Síntoma: UI no actualiza cuando cambia Supabase
Root cause: Filter incorrecto, tabla sin Replication habilitada, o USER_ID mismatch
Fix: Verificar filter: `id=eq.${USER_ID}`, verificar Supabase Replication settings
```

## Regla de oro

**NUNCA cambiar código sin reproducir el bug primero.**  
**NUNCA asumir el root cause sin evidencia.**  
Si no puedes reproducirlo → no está roto.
