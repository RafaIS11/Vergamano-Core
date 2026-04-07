---
name: vibe-kanban
description: Project management for Claude Code agents. Use for: organizing features into kanban boards, running multiple agents in parallel on different tasks, tracking PRs from Claude Code work.
---

# VIBE KANBAN — Gestión de Tareas con Agentes

Sistema kanban diseñado para coordinar múltiples agentes Claude Code. 30K+ usuarios, 100K+ PRs creados.

## Qué hace

```
Plan   → Organiza tareas en columnas (Backlog, En progreso, Review, Done)
Prompt → Instruye agentes Claude Code directamente desde el kanban
Review → Examina código generado con comentarios inline
```

## Casos de uso en VergaMano

### Coordinar múltiples features en paralelo
```
Columna "En progreso":
  - [builder] Implementar shaders GLSL para TheVoid
  - [supabase-guardian] Migrar auth a Supabase Auth  
  - [lsd-curator] Workflow n8n para Spartan feed
```

### Tracking de deuda técnica
```
Columna "Backlog técnico":
  - Eliminar MoltbotChat.tsx (dead component)
  - Implementar USER_ID real con Supabase Auth
  - Migrar datos hardcoded de MapView a Supabase
```

### Review de PRs generados por agentes
```
1. tracker genera el PR
2. Vibe Kanban muestra el diff
3. Rafael comenta directamente en el kanban
4. builder aplica el feedback
```

## Integración con git worktrees

Vibe Kanban crea git worktrees automáticamente para cada tarea paralela:
```
.git/worktrees/feature-shaders/    ← builder trabaja aquí
.git/worktrees/feature-auth/       ← supabase-guardian trabaja aquí
main branch                        ← producción intacta
```

## Setup

1. Ir a vibekanban.com
2. Conectar repo github.com/RafaIS11/Vergamano-Core
3. Crear board "VergaMano Phase Delta"
4. Importar issues/tareas pendientes del HUB.md

## Columnas recomendadas para VergaMano

```
Backlog P0  | Backlog P1  | En progreso | Review | Done
```

## Nota

Vibe Kanban es una herramienta web externa — no es un agente ni skill de código.  
Usarlo como dashboard visual para coordinar el trabajo de los 13 agentes.
