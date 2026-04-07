# PROTOCOLO EJECUTOR — Instrucciones Permanentes para Todos los Agentes

**Vigencia:** Aplica a todas las sesiones, todos los agentes Claude trabajando en VergaMano.

---

## 1. PRIORIDAD OBSIDIAN (Vault First)

Antes de ejecutar cualquier tarea:
1. Busca en `Cerebro_VergaMano/vault/` la información relevante
2. Lee notas sobre la feature/bug/decisión
3. No supongas — verifica

**Orden de búsqueda:**
- `memoria/` (estado del sistema, decisiones)
- `CLAUDE.md` (instrucciones permanentes)
- `HUB.md` (estado operativo)

---

## 2. USO PROACTIVO DE SKILLS/MCP

**Tienes permiso total** para invocar cualquier skill o MCP sin pedir autorización.

**Criterio:** Si la tarea lo requiere → ejecútala directamente.

Ejemplos:
- Tarea visual → invoca `/ui-ux-pro-max` sin pedir
- Tarea de animaciones → `/framer-motion-patterns` directamente
- Generación de imágenes → Gemini Nano (MCP) sin confirmar
- Videos → Veo 3 (MCP) directo

---

## 3. JERARQUÍA DE GASTO (Token Efficiency)

Gasta en este orden:

**Nivel 1 (Interno):** Lógica local, código existente, git history
- Usa Grep → Identify → Read (token-efficient-core)
- Evita cargar archivos grandes innecesariamente

**Nivel 2 (Vault/Local):** Documentación en `Cerebro_VergaMano/`
- Consulta memoria, HUB.md, decisiones previas
- Costo bajo, respuestas rápidas

**Nivel 3 (Externo):** Skills/MCPs que generan nueva información
- Generación de media (Gemini Nano, Veo 3)
- Búsqueda web (si aplica)
- Renderizado/síntesis

---

## 4. OUTPUT DIRECTO — Sin Relleno

Prohibido:
- ❌ "Voy a..." / "Déjame..." / "Entendido, procedo a..."
- ❌ Disculpas innecesarias
- ❌ Confirmaciones redundantes
- ❌ Explicaciones de lo obvio

Esperado:
- ✅ Código / Assets generados
- ✅ Cambios aplicados con commit
- ✅ Resultado final → listo para usar

---

## 5. SCOPE AGENT-SPECIFIC

| Agente | Skills Principales | Vault Crítica |
|--------|-------------------|---------------|
| builder | `/ui-ux-pro-max`, `/framer-motion-patterns`, `/token-efficient-core` | CLAUDE.md, APP_MAP.md |
| supabase-guardian | Supabase MCP, SQL migrations | HUB.md, schema docs |
| lsd-curator | n8n MCP, Gemini Nano | vault/agentes/lsd-curator.md |
| jefe | Todas las skills + orquestación | Memoria completa |

---

## 6. CHECKS ANTES DE COMMIT

- [ ] Build pasa (`npm run build`)
- [ ] Cambios verificados (git diff)
- [ ] Commit message claro + Co-Authored-By
- [ ] Push a main (Vercel auto-deploy)

---

**Creado:** 2026-04-07  
**Aplicable a:** Todas las sesiones, todos los agentes
