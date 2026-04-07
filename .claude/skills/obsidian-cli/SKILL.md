---
name: obsidian-cli
description: Interact with a running Obsidian instance via CLI. Use for: creating notes directly in vault, searching, appending to daily logs, reloading plugins, checking vault state from terminal.
---

# OBSIDIAN CLI — Vault Operations

Interactúa con Obsidian desde el terminal. Requiere que Obsidian esté abierto.

## Comandos clave para VergaMano

```bash
# Crear nota nueva
obsidian create name="vault/memoria/daily-logs/2026-04-05"

# Buscar en vault
obsidian search query="xp_spartan"
obsidian search query="bloqueo" limit=5

# Añadir a daily log de hoy
obsidian daily:append content="- [x] ARCHITECT: setup GitHub Actions — +50 XP"

# Leer nota
obsidian read path="vault/HUB.md"

# Abrir nota específica
obsidian open path="vault/memoria/MEMORY.md"
```

## Sintaxis de parámetros

```bash
# Parámetros con = 
obsidian search query="término"

# Flags booleanos
obsidian create name="nota" open=true

# Vault específico (si tienes múltiples)
obsidian search query="término" vault="Cerebro_VergaMano"
```

## Para VergaMano — operaciones comunes

```bash
# Ver estado del vault
obsidian search query="estado" limit=10

# Actualizar daily log
obsidian daily:append content="## Completado\n- [x] SPARTAN: 45min calistenia — +50 XP"

# Buscar agentes
obsidian search query="agente" limit=12

# Recargar plugins (después de cambios)
obsidian dev:reload-plugin id="obsidian-git"
```

## Vault path para Cerebro_VergaMano

```
/Users/rafaelibarra/Desktop/VergaMano/Cerebro_VergaMano
```

## Ayuda completa

```bash
obsidian help
```

## Notas importantes

- Obsidian debe estar abierto y corriendo
- El vault por defecto es el último enfocado
- Para operaciones de CI/CD: usar Read/Write tools del vault directamente
- Usar principalmente para operaciones interactivas desde terminal
