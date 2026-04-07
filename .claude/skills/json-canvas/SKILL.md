---
name: json-canvas
description: Create and edit Obsidian Canvas (.canvas) files for visual maps. Use for: agent architecture maps, app flow diagrams, pilar connections, system overview visuals with colored connections.
---

# JSON CANVAS — VergaMano Visual Maps

Crea mapas visuales en Obsidian. Perfecto para mapas de arquitectura, flujos de la app, y conexiones entre agentes/pilares.

## Estructura base

```json
{
  "nodes": [...],
  "edges": [...]
}
```

## Tipos de nodos

```json
// Texto
{
  "id": "abc123def456789a",
  "type": "text",
  "text": "# Título\nContenido en **markdown**",
  "x": 0,
  "y": 0,
  "width": 250,
  "height": 150,
  "color": "1"
}

// Archivo del vault
{
  "id": "abc123def456789b",
  "type": "file",
  "file": "vault/agentes/jefe.md",
  "x": 300,
  "y": 0,
  "width": 250,
  "height": 150
}

// URL externa
{
  "id": "abc123def456789c",
  "type": "link",
  "url": "https://vergamano-core.vercel.app",
  "x": 600,
  "y": 0,
  "width": 250,
  "height": 150
}

// Grupo contenedor
{
  "id": "abc123def456789d",
  "type": "group",
  "label": "Agentes de Dev",
  "x": -50,
  "y": -50,
  "width": 600,
  "height": 400,
  "color": "5"
}
```

## Colores disponibles (ÚSALOS para distinguir categorías)

```
"1" → rojo      — errores, bloqueos, The Void
"2" → naranja   — advertencias, pendientes
"3" → amarillo  — Nomad, atención
"4" → verde     — completado, Mercenary, activo
"5" → cyan/azul — Architect, infraestructura
"6" → púrpura   — Ghost, agentes, memoria
"#HEX"          — color personalizado (ej: "#f4f1eb" para papel)
```

## Edges (conexiones con COLOR)

```json
{
  "id": "edge123456789abc",
  "fromNode": "abc123def456789a",
  "toNode": "abc123def456789b",
  "fromSide": "right",
  "toSide": "left",
  "label": "delega a",
  "color": "5",
  "fromEnd": "none",
  "toEnd": "arrow"
}
```

### Lados de conexión
- `fromSide` / `toSide`: `"top"`, `"bottom"`, `"left"`, `"right"`
- `fromEnd` / `toEnd`: `"none"` (sin punta), `"arrow"` (flecha)

## Posicionamiento

```
Espaciado mínimo entre nodos: 50-100px
Flujo horizontal: incrementar X en 300-400px
Flujo vertical: incrementar Y en 200-300px
Grupos: margen de 50px alrededor de sus hijos
```

## CANVAS VERGAMANO — Mapa de agentes

Colores por categoría de agente:
- **Core dev** (jefe, builder, auditor): color `"5"` (azul/Architect)
- **Infra** (supabase-guardian, deploy-watcher, notion-sync): color `"4"` (verde)
- **Memoria** (tasker, vault-keeper, memory-manager): color `"6"` (púrpura)
- **Pilares** (spartan-coach, mercenary-scout): color `"2"` (naranja)

## Reglas

1. IDs: exactamente 16 caracteres hex únicos
2. Validar que todos los edge `fromNode`/`toNode` apuntan a IDs existentes
3. Usar `"color"` en edges para claridad visual
4. Groups no pueden tener children explícitos — posicionar nodos dentro del bounding box del grupo
5. Guardar en `vault/outputs/` con nombre descriptivo
