---
name: parallel-agents
description: Dispatch multiple subagents in parallel for independent tasks. Use when 2+ tasks are independent and can run simultaneously. Reduces total time by 40-70%.
---

# PARALLEL AGENTS — Ejecución Paralela

Lanza múltiples subagentes en paralelo para tareas independientes. Clave para reducir tiempo en VergaMano.

## Cuándo usar

- 2+ tareas **independientes** (no dependen entre sí)
- Análisis de múltiples archivos simultáneamente
- Búsquedas en vault + búsquedas en código al mismo tiempo
- Generar múltiples componentes UI sin dependencias

## Cuándo NO usar

- Tarea B necesita resultado de tarea A
- Modifican el mismo archivo
- Hay riesgo de conflictos git

## Patrón de uso (jefe → subagentes)

```
JEFE identifica tareas paralelas:
  Tarea A: auditor → revisar src/components/
  Tarea B: supabase-guardian → verificar schema
  Tarea C: vault-keeper → actualizar HUB.md

→ Las 3 son independientes → lanzar en paralelo
→ Esperar resultados → integrar en una respuesta
```

## Para VergaMano — ejemplos prácticos

### Análisis inicial de sesión (paralelo)
```
Subagente 1: leer APP_MAP.md + git status
Subagente 2: leer vault/memoria/MEMORY.md
Subagente 3: verificar último deploy en Vercel
```

### Feature nueva (paralelo)
```
Subagente 1 (builder): componente UI
Subagente 2 (supabase-guardian): migration SQL
→ Integrar cuando ambos terminen
```

### Limpieza periódica (paralelo)
```
Subagente 1 (auditor): detectar dead code en src/
Subagente 2 (vault-keeper): actualizar vault/app/errores.md
Subagente 3 (memory-manager): compactar daily logs
```

## Reglas

1. Cada subagente recibe contexto completo independiente
2. No compartir estado mutable entre subagentes
3. Integrar resultados en el agente padre, no en subagentes
4. Si un subagente falla → los otros continúan
5. Máx 3 subagentes en paralelo para VergaMano (TDA — no overwhelming)
