---
name: vergamano-context
description: Loads VergaMano project context efficiently. Use at the START of any session before coding, when you need to know the current system state, game loop, or before touching any file in this repo.
---

# VergaMano Context Loader

## When to use

- Start of any session working on VergaMano
- Before modifying any src/ file
- When asked "what's the state of the project"
- When the agent doesn't know the current phase or architecture

## Load sequence (< 3000 tokens total)

```
1. Read: Vergamano-Core/docs/APP_MAP.md         ← app structure
2. Read: Cerebro_VergaMano/vault/CLAUDE.md       ← Rafael + reglas
3. Read: Cerebro_VergaMano/vault/HUB.md          ← estado sistema
4. Read: Cerebro_VergaMano/vault/memoria/MEMORY.md ← estado detallado
```

Only read additional files if the task requires it (see vault-agent-protocol).

## Project constants

```typescript
// src/lib/supabase.ts
const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413'

// Supabase tables
'profile'        // xp_architect, xp_spartan, xp_mercenary, xp_nomad, xp_ghost, hp, level, credits
'tasks'          // id, title, pilar, status, xp_reward, user_id
'chat_messages'  // id, content, user_id, created_at
'content_feed'   // id, type, content, created_at

// Realtime channels
'realtime_chat'     → chat_messages
'realtime_tasks'    → tasks
'realtime_profile'  → profile
'profile_changes'   → useProfile.ts hook (filter by USER_ID)
```

## Tech stack

```
React 19 + TypeScript + Vite
Tailwind CSS (brutalismo B&W)
@supabase/supabase-js ^2.95
framer-motion (animaciones)
Space Mono font
Deployed: Vercel (vergamano-core.vercel.app)
```

## Brutalismo rules (never break these)

- Colors: black `#000`, white `#FFF`, paper `#f4f1eb`
- Font: Space Mono exclusively
- Borders: solid, `border-[Npx] border-black`
- Shadows: `Npx Npx 0 black` (offset block shadows)
- NO blur, NO gradients, NO rounded corners (except pills)
- NO pastel colors

## Rafael context

- TDA → micro-tareas 15min máximo
- Madrid → objetivo Berlín (necesita €3K/mes)
- Single user app (no multi-tenant)
- Keto + calistenia (Front Lever objetivo)

## Game loop

```
completeMission(task)
  → optimistic UI update (local state immediately)
  → supabase.rpc('complete_task', { task_id })
  → Supabase triggers XP update on profile
  → Realtime broadcasts profile UPDATE
  → useProfile hook receives payload.new
  → UI reflects new XP/HP/Level
```

## Known issues (don't fix unless instructed)

1. USER_ID hardcoded (auth pendiente)
2. MoltbotChat.tsx — dead component, not imported anywhere
3. TheVoid uses CSS/SVG (GLSL shaders future)
4. n8n on Railway — pending migration to Hetzner
