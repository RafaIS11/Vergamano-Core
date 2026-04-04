---
title: APP_MAP — VergaMano OS v5.0
updated: 2026-04-04
---

# APP_MAP — VergaMano Core

Mapa completo de la aplicación. Fuente de verdad para agentes IA y para navegación rápida.

---

## SECCIONES QUE EXISTEN

| Módulo | Componente | Estado |
|--------|-----------|--------|
| ARENA | ArenaView.tsx | Activo |
| TASKS | QuickMissionsView.tsx | Activo |
| MAP | MapView.tsx | Activo |
| LSD_INTEL | LSDFeed.tsx / LSDFeedView.tsx | Activo |
| MARKET | MarketView.tsx | Activo |
| NEURAL | NeuralLinkView.tsx | Activo |

---

## ESTRUCTURA DE ARCHIVOS

### src/main.tsx
- Punto de entrada. Monta `<GameProvider><App /></GameProvider>`.
- Deps: App.tsx, context/GameContext.tsx

### src/App.tsx
- Shell principal. Header, navegación de pilares (5), tabs de módulos (6).
- Renderiza módulo activo según `activeModule` del GameContext.
- Nombre "RAFAEL_IBARRA" hardcoded (debería venir del perfil).
- Label nav "🧠 MOLTBOT" para el módulo Neural → cosmética del juego, no bug.
- Deps: GameContext, todos los componentes vergamano/

### src/context/GameContext.tsx
- Estado centralizado. Única fuente de verdad.
- Maneja: profile, missions, cities, chatMessages, feedItems, activeModule, activePillar, isBunkerMode, isLoading.
- **3 canales Realtime activos** (ver sección REALTIME).
- **PROBLEMA CRÍTICO L7**: `USER_ID` hardcoded → `'3a95d701-18d8-4104-aea2-f9a068c7f413'`
- Cities hardcoded en fetchInitialData (10 ciudades), no viene de Supabase.
- Funciones principales: `completeMission()` (optimistic), `sendMessage()` (optimistic), `buyReward()` (optimistic).
- Deps: lib/supabase.ts, types/game.ts

### src/lib/supabase.ts
- Cliente Supabase con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Sin lógica adicional. Solo `createClient`.

### src/types/game.ts
- Tipos TypeScript del dominio: Profile, Mission, ChatMessage, City, FeedItem, GameState.
- `credits` y `level` son campos derivados calculados en runtime, no en DB.
- Mission usa campo `power` (no `pilar`) para el pilar asignado.

### src/hooks/use-mobile.ts
- Detecta viewport mobile via `matchMedia`.
- **useProfile.ts NO EXISTE todavía** (pendiente Fase 4).

### src/components/vergamano/ArenaView.tsx
- Vista principal. Avatar + TaskCards filtradas por `activePillar`.
- Deps: GameContext, TaskCard.tsx, FloAvatar.tsx

### src/components/vergamano/TaskCard.tsx
- Tarjeta de misión con timer Pomodoro, progress bar, evidence modal anti-cheat.
- Texto "Moltbot necesita prueba" → cosmética del juego.
- Llama `completeMission()` al enviar evidencia.
- Dep externa: use-sound

### src/components/vergamano/QuickMissionsView.tsx
- Genera micro-tareas via Moltbot (via chat_messages INSERT).
- Filtra `chatMessages` por `sender === 'moltbot'` para mostrar respuesta.
- Texto "BY MOLTBOT INTELLIGENCE" → cosmética del juego, no bug funcional.

### src/components/vergamano/MapView.tsx
- 10 ciudades con objetivos de conquista. Datos HARDCODED en el componente.
- Calcula ciudad actual y progreso desde `totalXP` del perfil.

### src/components/vergamano/MarketView.tsx
- Tienda de recompensas. Rewards HARDCODED (cheesecake, cita, zapatos, tech).
- Llama `buyReward()` del contexto.
- Texto "Moltbot auditará la utilidad" → cosmética del juego.

### src/components/vergamano/NeuralLinkView.tsx
- Chat con Moltbot. Muestra `chatMessages` del contexto. Input llama `sendMessage()`.
- Texto "ESCUCHANDO_FRECUENCIA_MOLTBOT" → cosmética del juego.

### src/components/vergamano/MoltbotChat.tsx
- **COMPONENTE MUERTO**. No está importado en ningún lugar activo.
- Tiene su propio canal Realtime `chat_sync` duplicando el del GameContext.
- **ELIMINAR** en próxima limpieza.

### src/components/vergamano/LSDFeed.tsx + LSDFeedView.tsx
- Feed de contenido externo. Prioriza items del pilar más débil.

### src/components/vergamano/FloAvatar.tsx
- Avatar SVG animado que reacciona a HP y totalXP.

### src/components/vergamano/ScribbleElements.tsx
- Elementos decorativos SVG (InkSplatterSVG, ChaoticScribble, ScratchMarks, BasquiatCrown).

### src/components/vergamano/effects/TheVoid.tsx
- Overlay de emergencia. Se activa cuando HP < 30%.
- Usa CSS `mix-blend-mode` + SVG `feTurbulence`. **NO usa Three.js ni GLSL**.
- Shaders GLSL son objetivo futuro, no implementado.

---

## DEPENDENCIAS ENTRE ARCHIVOS

```
main.tsx
  └── App.tsx
        ├── GameContext (estado global)
        ├── ArenaView → TaskCard → GameContext
        ├── QuickMissionsView → GameContext
        ├── MapView (standalone, datos hardcoded)
        ├── LSDFeed → GameContext
        ├── MarketView → GameContext
        ├── NeuralLinkView → GameContext
        ├── FloAvatar → GameContext
        ├── ScribbleElements (standalone)
        └── effects/TheVoid → GameContext
```

---

## TABLAS SUPABASE

| Tabla | Campos clave | Uso en app |
|-------|-------------|-----------|
| `profile` | id, hp, xp_architect/spartan/mercenary/nomad/ghost, streak_days, avatar_state | Estado del jugador |
| `tasks` | id, user_id, title, power, status, xp_base, steps[], timer_minutes | Misiones activas |
| `chat_messages` | id, user_id, content, sender ('rafael'/'moltbot'), created_at | Chat Neural Link |
| `content_feed` | id, title, url, source, category, how_to_apply | LSD Feed |

---

## CANALES REALTIME ACTIVOS (GameContext.tsx)

| Canal | Tabla | Evento | Efecto en app |
|-------|-------|--------|--------------|
| `realtime_chat` | chat_messages | INSERT donde sender='moltbot' | Agrega mensajes Moltbot al chat |
| `realtime_tasks` | tasks | INSERT + UPDATE | Añade/actualiza/elimina misiones |
| `realtime_profile` | profile | UPDATE | Actualiza HP/XP sin recargar |

---

## GAME LOOP REAL (implementado en código)

```
1. fetchInitialData() al montar GameProvider
2. Usuario selecciona pilar → App.tsx filtra pillar cards
3. ArenaView muestra TaskCards filtradas por activePillar
4. Usuario inicia timer → ejecuta tarea → abre evidence modal
5. Envía evidencia → completeMission() → optimistic update inmediato
6. Background: UPDATE en Supabase tasks + profile
7. Supabase Realtime profile channel → confirma update en otros dispositivos
8. Moltbot (VPS) puede insertar tasks via Telegram → realtime_tasks → se añade al array
9. Si HP < 30 → TheVoid.tsx se activa con intensidad proporcional
```

---

## ERRORES TÉCNICOS

| Severidad | Ubicación | Problema | Solución |
|-----------|-----------|---------|---------|
| P1 | GameContext.tsx:7 | USER_ID hardcoded | Implementar Supabase Auth (sesión futura) |
| P2 | MoltbotChat.tsx | Componente muerto con canal Realtime duplicado | Eliminar el archivo |
| P3 | MapView.tsx, MarketView.tsx | Datos hardcoded (cities, rewards) | Mover a Supabase (sesión futura) |

---

## ARCHIVOS DUPLICADOS — ELIMINAR

```
src/context/GameContext 2.tsx
src/lib/supabase 2.ts
src/lib/game 2.ts
src/components/vergamano/NomadView 2.tsx
src/components/vergamano/XPTestTrigger 2.tsx
schema_v5 2.sql
vercel 2.json
```

---

## REFERENCIAS CLAWBOT/MOLTBOT (catalogadas)

Son **cosmética del juego**, no bugs funcionales. No bloquean nada.

| Archivo | Línea | Referencia | Tipo |
|---------|-------|-----------|------|
| GameContext.tsx | ~135 | `sender === 'moltbot'` | Funcional (game loop) |
| QuickMissionsView.tsx | ~14 | filtra por moltbot | Funcional |
| QuickMissionsView.tsx | ~39 | "BY MOLTBOT INTELLIGENCE" | UI label |
| NeuralLinkView.tsx | ~29 | "ESCUCHANDO_FRECUENCIA_MOLTBOT" | UI label |
| TaskCard.tsx | ~248 | "Moltbot necesita prueba" | UI label |
| MarketView.tsx | ~71 | "Moltbot auditará la utilidad" | UI label |
| App.tsx | ~29 | label tab "🧠 MOLTBOT" | UI label |
| **MoltbotChat.tsx** | todo | **Componente entero** | **MUERTO — ELIMINAR** |

---

## ESTADO DE FEATURES

| Feature | Estado | Notas |
|---------|--------|-------|
| Supabase Realtime | ✅ Activo | 3 canales en GameContext |
| Optimistic UI | ✅ Activo | completeMission, sendMessage, buyReward |
| XP / HP / Level | ✅ Activo | Calculados en runtime |
| 5 Pilares | ✅ Activo | architect, spartan, mercenary, nomad, ghost |
| Tienda (Market) | ✅ Activo | Rewards hardcoded |
| Mapa de ciudades | ✅ Activo | 10 ciudades hardcoded |
| LSD Feed | ✅ Activo | Datos desde content_feed |
| TheVoid (HP<30%) | ✅ Activo | CSS/SVG, no GLSL |
| Shaders GLSL | ❌ No existe | Objetivo futuro |
| Auth real | ❌ No existe | USER_ID hardcoded |
| useProfile hook | ❌ No existe | Pendiente Fase 4 |
| PWA | ⚠️ Config existente | vite-plugin-pwa en vite.config.ts |

---

## DEPLOY

- Vercel: deploy automático desde GitHub main
- URL: vergamano-core.vercel.app
- Config: vercel.json en raíz de Vergamano-Core/
