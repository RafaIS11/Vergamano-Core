---
name: mem-search
description: Search persistent cross-session memory. Use when asked "did we already do X?", "how did we solve this before?", or when starting a session to recall prior context. Uses 3-layer search to save 10x tokens.
---

# MEM-SEARCH — Búsqueda de Memoria Persistente

Recupera contexto de sesiones anteriores de Claude Code. No busques en vault — busca en la base de datos de memoria del proyecto.

## Cuándo activar

- "¿Ya resolvimos esto antes?"
- "¿Cómo lo hicimos la última vez?"
- "¿Qué hicimos en la sesión anterior?"
- Al inicio de sesión para recuperar contexto previo
- Antes de tomar decisiones de arquitectura ya debatidas

## Protocolo 3-layer (SIEMPRE en este orden)

```
CAPA 1 — search()
  → Obtiene tabla indexada con IDs y metadata
  → ~50-100 tokens por resultado
  → Filtrar por: proyecto, fecha, tipo

CAPA 2 — timeline()
  → Examina contexto alrededor de un resultado específico
  → Ver qué pasó antes/después del hallazgo

CAPA 3 — get_observations()
  → Solo para IDs relevantes filtrados
  → ~500-1000 tokens por observación completa
  → Acepta múltiples IDs en una sola llamada
```

**REGLA CRÍTICA**: NUNCA usar `get_observations()` sin filtrar primero. Ahorra 10x tokens.

## Comandos MCP (si claude-mem está instalado)

```
search(query, filters)          → Capa 1
timeline(observation_id)        → Capa 2  
get_observations([id1, id2])    → Capa 3
```

## Para VergaMano — qué buscar

```
# Decisiones de arquitectura previas
search("USER_ID hardcoded auth decision")

# Bugs ya resueltos
search("Supabase Realtime channel cleanup")

# Contexto de agentes
search("agentes claude code vergamano")

# Decisiones de diseño
search("brutalismo B&W Space Mono decision")
```

## Fallback si claude-mem no está instalado

```bash
# Buscar en vault
grep -r "query" vault/memoria/
cat vault/memoria/MEMORY.md
cat vault/memoria/daily-logs/[fecha].md
```

## Instalación de claude-mem

```bash
# Via Claude Code marketplace
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```
