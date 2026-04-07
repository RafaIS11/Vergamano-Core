---
name: token-efficient-core
description: Token optimization protocols for Claude Code. Use ALWAYS at session start and before major operations. Implements grep→identify→read pattern, context budgets, and memory compaction. Inspired by drona23/claude-token-efficient.
---

# TOKEN-EFFICIENT-CORE — Ahorro de Tokens Sistemático

**Inspiración**: `github.com/drona23/claude-token-efficient`  
**Objetivo**: Reducir consumo 50-75% sin perder calidad.

---

## REGLA FUNDAMENTAL

```
NUNCA: Read(file) sin antes Grep(pattern)
PATRÓN: Grep → Identify → Read (1 archivo exacto)

Esto solo ahorra:
- 70% contexto innecesario
- 10x tiempo de búsqueda
- Presupuesto para más análisis
```

---

## PROTOCOLO DE INICIO DE SESIÓN

Ejecutar en este orden exacto:

```bash
# 1. Estado git (qué cambió)
git status --short

# 2. Archivo crítico: qué necesito saber hoy
cat docs/APP_MAP.md | head -50

# 3. Memoria: qué decidimos antes
ls Cerebro_VergaMano/vault/memoria/

# 4. Skills activas hoy (solo nombres, no contenido)
ls .claude/skills/

# 5. Agentes disponibles
ls .claude/agents/
```

**Costo total**: ~1000 tokens (vs 3000+ si lees archivos completos).

---

## CONTEXTO POR TIPO DE TAREA

### Tarea de código React

```
A. CLAUDE.md — carga mínima (~200 tokens)
B. APP_MAP.md head -30 (~150 tokens)
C. File específico que editar — full read (~600 tokens)

Total: ~950 tokens. NO leer:
  ❌ node_modules
  ❌ dist/
  ❌ archivos no relacionados
```

### Tarea de arquitectura/decisión

```
A. CLAUDE.md — completo (~300 tokens)
B. HUB.md — completo (~400 tokens)
C. MEMORY.md — solo tabla de decisiones (~200 tokens)

Total: ~900 tokens. Skip: detalles de código.
```

### Tarea de vault/memoria

```
A. CLAUDE.md (~300 tokens)
B. HUB.md — si es actualización (~400 tokens)
C. Archivo específico en memoria/ (~300 tokens)
D. qlq-search.md — protocolo (~200 tokens)

Total: ~1200 tokens (máximo permitido para vault).
```

### Tarea de debugging (bug investigation)

```
A. Archivo con error (~400 tokens)
B. Archivo relacionado si hay import rotos (~400 tokens)
C. Error exacto de terminal (~100 tokens)

Total: ~900 tokens. NO cargar:
  ❌ Otros componentes
  ❌ Archivos no mencionados en stacktrace
```

---

## GREP PATTERNS QUICK REFERENCE

### Buscar antes de leer

```bash
# Función específica
grep -n "function useProfile" src/hooks/useProfile.ts

# Componente React
grep -n "export default" src/components/vergamano/Profile.tsx

# Import específico
grep -n "import.*Supabase" src/ -r

# Variable/constante
grep -n "USER_ID" src/ -r

# Error en logs
grep -n "ERROR" /tmp/build.log
```

**Regla**: Si grep no encuentra nada, el archivo probablemente no existe o no contiene lo que buscas.

---

## LECTURA QUIRÚRGICA (partial reads)

Cuando sabes EXACTAMENTE qué líneas necesitas:

```bash
# Read solo líneas 10-30 de archivo
# (usa offset + limit en Read tool)
Read /path/to/file.ts --offset 10 --limit 20
```

**Vs**:
```bash
# ❌ Leer archivo completo (siempre malo)
Read /path/to/file.ts
```

Ahorro: 80% de contexto si el archivo es > 100 líneas.

---

## CARGA MÍNIMA EN MULTI-FILE EDITS

Flujo para editar 3 archivos:

```
1. Grep cada archivo por lo que necesitas cambiar
2. Identify líneas exactas de cada uno
3. Read SOLO esas secciones (offset + limit)
4. Edit quirúrgico (no reescribir funciones completas)
5. Verify: npm run build
```

**Nunca**: leer 3 archivos completos.

---

## MEMORY COMPACTION (sessions largas)

Si la sesión se hace larga (>50k tokens):

```bash
# 1. Leer último MEMORY.md
grep -n "## Estado del Sistema" Cerebro_VergaMano/vault/memoria/MEMORY.md

# 2. Compactar lo hecho hoy en 10 líneas
# (resumen, decisiones clave, estado)

# 3. Guardar en memoria para next session
# Appel a vault-keeper para update
```

**Regla**: No duplicar información que ya está en git history o código.

---

## ANTI-PATRONES (prohibidos)

```
❌ Read(file) + Read(another_file) + Read(third_file)
   → Usa Grep primero en los 3

❌ Glob("**/*.md") luego Read todo
   → Usa Glob, identifica, Read 1 archivo

❌ WebFetch(url) sin defuddle skill
   → Usa /defuddle para markdown limpio

❌ Asumir que una función existe
   → Grep primero: grep -n "function X" src/ -r

❌ Editar sin leer primero
   → Siempre Read antes de Edit
```

---

## BUDGETS POR OPERACIÓN

```
Inicializar sesión:  1000 tokens (máx)
Single file edit:     900 tokens
Multi-file edit:     1500 tokens (2-3 archivos)
Architecture review: 1200 tokens
Debugging:           1000 tokens
Vault update:        1200 tokens
```

Si superas presupuesto → compacta contexto o splitea tarea.

---

## TEMPLATES REUTILIZABLES

### Para la sesión

```markdown
## PLAN TOKEN-EFFICIENT

**Presupuesto**: [tipo_tarea] = N tokens
**Ya usado**: N tokens
**Disponible**: N tokens

### Grep checklist
- [ ] Grep para archivo A
- [ ] Grep para archivo B
- [ ] Grep para patrón X

### Read checklist
- [ ] Read archivo A:líneas X-Y
- [ ] Read archivo B:líneas X-Y

### Edit checklist
- [ ] Edit A con cambio específico
- [ ] Edit B con cambio específico
- [ ] Build check
```

---

## CHEATSHEET FINAL

| Necesito | Comando | Tokens |
|----------|---------|--------|
| Estado app | `git status` | 50 |
| Qué cambió hoy | `git diff --stat` | 50 |
| Función existe | `grep -n "func X" src/` | 20 |
| Importes rotos | `grep "import.*Error" src/` | 30 |
| Error específico | `grep "ERROR" logs/` | 30 |
| Leer archivo < 50 líneas | `Read file.ts` | 150 |
| Leer sección archivo | `Read file.ts --offset 10 --limit 20` | 80 |
| Buscar en vault | `grep "término" vault/ --include="*.md"` | 30 |
| Contexto completo | CLAUDE.md + APP_MAP.md + HUB.md | 650 |
