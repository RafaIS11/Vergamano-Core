---
name: ruflo-patterns
description: Multi-agent orchestration patterns from Ruflo/ClaudeFlow. Use for: swarm coordination, task routing by complexity, memory isolation between agents, background workers patterns.
---

# RUFLO PATTERNS — Orquestación Multi-Agente

Patrones de Ruflo (ex-ClaudeFlow) para coordinar múltiples agentes eficientemente.

## Patrones de topología de swarm

### Hierarchical (VergaMano principal)
```
jefe (Queen)
  ├── builder (Worker — código)
  ├── supabase-guardian (Worker — DB)
  ├── lsd-curator (Worker — n8n)
  └── vault-keeper (Worker — docs)
```
Uso: tareas de coding donde el jefe no debe driftar del objetivo.

### Star (para análisis rápido)
```
jefe (Hub)
  ├── auditor → análisis código
  ├── deploy-watcher → análisis prod
  └── memory-manager → análisis vault
```
Todos trabajan en paralelo, jefe integra resultados.

### Ring (para flujos secuenciales)
```
tasker → builder → tracker → deploy-watcher
(genera)  (codea)  (commita) (verifica)
```
Uso: pipeline completo de una feature.

## Routing de tareas por complejidad

```
Simple (< 5min):      haiku  — tasker, auditor, tracker
Medio (5-15min):      sonnet — builder, vault-keeper
Complejo (>15min):    sonnet + subagentes — jefe + swarm
```

## Aislamiento de memoria entre agentes

Cada agente debe tener su propio contexto inicial:
```
vergamano-context → contexto base (todos los agentes)
+ skill específica → contexto especializado
+ NO compartir estado mutable entre agentes paralelos
```

## Background workers para VergaMano

Inspirado en los 12 workers de Ruflo:

| Worker | Trigger | Agente |
|--------|---------|--------|
| `compact-memory` | Semanal | memory-manager |
| `audit-dead-code` | Cada commit | auditor |
| `update-vault` | Post-sesión | vault-keeper |
| `check-deploy` | Post-push | deploy-watcher |
| `refresh-lsd-feed` | Diario 8am | lsd-curator |

## Token optimizer (adaptar de Ruflo)

```
Tarea trivial → skill específica sin context completo
Tarea media  → vergamano-context + skill
Tarea compleja → vergamano-context + APP_MAP + skills
```

Nunca cargar todo el vault para tareas simples.
Aplicar reglas del QLC (vault-agent-protocol.md).

## Hooks útiles (patrones de Ruflo)

```yaml
# Pre-task: cargar contexto mínimo
pre-task: read vergamano-context skill

# Post-task: actualizar vault
post-task: vault-keeper update HUB.md

# Post-commit: verificar build
post-commit: deploy-watcher check latest
```
