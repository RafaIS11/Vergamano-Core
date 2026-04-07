---
name: supadata
description: Extract transcripts from YouTube, TikTok, Instagram videos and scrape web content. Use for LSD INTEL feed: get video transcripts, web articles, and social media content as structured JSON.
---

# SUPADATA — Extracción de Contenido Web/Video

API para extraer transcripciones de videos y scraping de webs. Úsalo para alimentar el LSD INTEL feed con contenido de video y web.

## Casos de uso para VergaMano

| Pilar | Fuente | Qué extraer |
|-------|--------|------------|
| Architect | YouTube tutoriales Claude/n8n/Supabase | Transcripción → resumen |
| Spartan | YouTube calistenia, TikTok fitness | Transcripción → ejercicios clave |
| Mercenary | YouTube Indie Hackers, podcasts startups | Transcripción → insights de negocio |
| Nomad | Videos sobre Berlín, Europa | Transcripción → info práctica |
| Ghost | Podcasts filosofía, Stoicismo | Transcripción → citas y conceptos |

## API de Transcripción

```javascript
// YouTube transcript
const response = await fetch('https://api.supadata.ai/v1/youtube/transcript', {
  method: 'GET',
  headers: { 'x-api-key': process.env.SUPADATA_API_KEY },
  // params: ?url=https://youtube.com/watch?v=...&text=true
});

// Response
{
  content: [{ text: "...", offset: 0, duration: 5.2 }],
  lang: "en",
  availableLangs: ["en", "es"]
}
```

## API de Web Scraping

```javascript
// Scrape URL
const response = await fetch('https://api.supadata.ai/v1/web/scrape', {
  method: 'GET', 
  headers: { 'x-api-key': process.env.SUPADATA_API_KEY },
  // params: ?url=https://...
});
```

## Integración con n8n (workflow LSD Feed)

```
Schedule Trigger (diario 8am)
  → HTTP Request (Supadata YouTube transcript)
  → Code Node (extraer puntos clave del transcript)
  → Supabase Node (INSERT en content_feed)
    { type: "video", content: puntos_clave, url: video_url, pilar: "architect" }
```

## Límites y consideraciones

- API key requerida (supadata.ai — registrar cuenta)
- Rate limits: verificar en dashboard
- Transcripciones: solo videos con captions disponibles
- Preferir `text=true` para output limpio sin timestamps
- Combinar con `defuddle` para artículos web

## Variable de entorno requerida

```
SUPADATA_API_KEY=tu_api_key
```
Añadir en: Vergamano-Core/.env + Vercel environment variables
