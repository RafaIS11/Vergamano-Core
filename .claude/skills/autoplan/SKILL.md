---
name: autoplan
description: Auto-generate a step-by-step build plan before executing any feature or fix. Inspired by gitstack's stacked-branch philosophy and the-architect's blueprint pattern. Use when starting any non-trivial task in VergaMano.
---

# AUTOPLAN — Blueprint Antes de Ejecutar

Antes de tocar código, genera un plan explícito con fases ordenadas.
Inspirado en: **the-architect** (blueprint) + **gitstack** (stacked phases) + **token-efficient** (carga mínima).

## Cuándo usar

- Feature nueva (cualquier tamaño)
- Bug que toca más de 1 archivo
- Refactor de componente/hook
- Migración de DB

**NO usar**: fixes de 1 línea, typos, cambios triviales de estilo.

## Formato del plan

```markdown
## AUTOPLAN: [nombre de la feature]

**Archetype**: [bug | feature | refactor | infra | schema]
**Impacto**: [qué archivos/tablas/componentes afecta]
**Riesgo**: [Bajo | Medio | Alto]

### Build Order
- [ ] Fase 1 (15min): [agente] → [acción concreta] → [criterio de éxito]
- [ ] Fase 2 (15min): [agente] → [acción concreta] → [criterio de éxito]
- [ ] Fase 3 (15min): [agente] → [acción concreta] → [criterio de éxito]

### Verificación final
- [ ] npm run build sin errores
- [ ] Comportamiento correcto en dev
- [ ] Commit con mensaje descriptivo
```

## Ejemplo: Implementar Auth real

```markdown
## AUTOPLAN: Supabase Auth

**Archetype**: feature
**Impacto**: GameContext.tsx, useProfile.ts, lib/supabase.ts, Supabase DB
**Riesgo**: Alto (toca estado global)

### Build Order
- [ ] Fase 1 (15min): supabase-guardian → habilitar Auth en Supabase + crear tabla sessions → SQL migración OK
- [ ] Fase 2 (15min): builder → crear useAuth.ts hook con session listener → compila
- [ ] Fase 3 (15min): builder → conectar useAuth a GameContext, quitar USER_ID hardcoded → build OK
- [ ] Fase 4 (15min): tracker → commit + push → Vercel deploy green

### Verificación final
- [ ] npm run build sin errores
- [ ] Login/logout funciona en dev
- [ ] USER_ID ya no hardcoded
```

## Reglas del plan

1. **Máx 5 fases** — si necesitas más, es que el scope es demasiado grande. Dividir.
2. **Cada fase = 1 agente + 1 acción + 1 criterio verificable**
3. **Fases independientes → ejecutar en paralelo** (usar parallel-agents skill)
4. **Fases dependientes → secuencial** — no saltar fases
5. **Si una fase falla → STOP y diagnosticar** antes de continuar

## Stacked branches (gitstack pattern)

Para features grandes, crear branches apiladas:
```
main
  └── feat/schema-auth        (Fase 1 — supabase-guardian)
        └── feat/hook-auth    (Fase 2 — depende de schema)
              └── feat/ui-auth (Fase 3 — depende del hook)
```
Cada branch es un PR pequeño y reviewable independientemente.
Comando: cada branch sale de la anterior, no de main directamente.
