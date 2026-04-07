---
name: defuddle
description: Extract clean markdown from web pages with less tokens. Use INSTEAD of WebFetch for articles, docs, blog posts. Saves 40-60% tokens vs raw HTML fetch.
---

# DEFUDDLE — Web Content Extractor

Extrae markdown limpio de páginas web. Más eficiente que WebFetch para contenido de lectura.

## Cuándo usar Defuddle vs WebFetch

| Situación | Herramienta |
|-----------|-------------|
| Artículo, blog, documentación | `defuddle` ✅ |
| Página con mucho nav/ads | `defuddle` ✅ |
| Archivo `.md` directo (GitHub raw) | WebFetch |
| API JSON | WebFetch |
| Página con auth requerida | MCP específico |

## Comandos

```bash
# Markdown limpio (recomendado)
defuddle parse <url> --md

# JSON con metadata
defuddle parse <url> --json

# Solo metadata
defuddle parse <url> -p title
defuddle parse <url> -p description
defuddle parse <url> -p domain

# HTML sin procesar
defuddle parse <url>
```

## Instalación (si no está disponible)

```bash
npm install -g defuddle
```

## Casos de uso en VergaMano

```bash
# Buscar patrones de gamificación en artículos
defuddle parse https://uxplanet.org/gamification-article --md

# Documentación de Supabase
defuddle parse https://supabase.com/docs/guides/realtime --md

# Ideas para pilares
defuddle parse https://blog.example.com/calistenia-progresion --md
```

## Ahorro de tokens estimado

- Página típica con ads/nav: ~3000 tokens (WebFetch) → ~1200 tokens (defuddle)
- Documentación técnica: ~2000 tokens → ~900 tokens
- Ahorro promedio: **40-60%**

## Reglas

1. Siempre `--md` para output legible
2. No usar para páginas .md de GitHub Raw (ya son markdown)
3. Si falla: fallback a WebFetch con prompt de extracción
