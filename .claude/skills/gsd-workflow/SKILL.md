---
name: gsd-workflow
description: Get Shit Done workflow for structured feature development. Use when starting a new feature, phase, or milestone. Provides planning, parallel execution, and verification commands.
---

# GSD WORKFLOW — Desarrollo Estructurado

Sistema de comandos para ejecutar features de forma estructurada con micro-tareas, agentes paralelos y verificación.

## Comandos disponibles (slash commands)

```
/gsd-map-codebase     → Analiza el proyecto antes de empezar
/gsd-plan-phase <n>   → Investiga y crea plan en 2-3 tareas atómicas
/gsd-execute-phase <n>→ Ejecuta el plan con commits atómicos
/gsd-verify-work <n>  → Verifica deliverables y diagnostica fallos
/gsd-quick            → Tarea ad-hoc sin planning completo
/gsd-next             → Auto-detecta y ejecuta siguiente paso
```

## Archivos de estado que genera

```
PROJECT.md      → Descripción del proyecto
REQUIREMENTS.md → Requisitos extraídos
ROADMAP.md      → Fases y milestones
STATE.md        → Estado actual del workflow
PLAN.md         → Plan de ejecución actual
SUMMARY.md      → Resumen del trabajo completado
```

## Adaptación para VergaMano

Para VergaMano, usar este flujo simplificado (TDA-compatible):

```
1. /gsd-map-codebase     → Lee APP_MAP.md + estado Supabase
2. /gsd-plan-phase 1     → 3 micro-tareas de 15min máximo
3. /gsd-execute-phase 1  → Ejecuta con builder agent
4. /gsd-verify-work 1    → npm run build + check Vercel
```

## Regla de micro-tareas (TDA)

Cada tarea del plan debe ser:
- ≤ 15 minutos de trabajo
- 1 archivo modificado preferiblemente
- Verificable con `npm run build` o `git diff`
- Con criterio de éxito claro

## Para features grandes → dividir en fases

```
Fase 1: Supabase schema + types
Fase 2: Hook + lógica
Fase 3: Componente UI
Fase 4: Integración + test en dev
```
