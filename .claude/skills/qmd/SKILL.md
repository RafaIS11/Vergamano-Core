---
name: qmd
description: Compact and search vault notes efficiently. Use when searching notes, compacting conversation context, finding related content, or managing memory files in the Obsidian vault.
---

# QMD — Quick Markdown Search & Context Compaction

## When to use

- "search my notes" / "find in vault" / "busca en obsidian"
- "compact this context" / "compacta" / "resume el chat"
- "what do we know about X?" / "qué sabemos de X?"
- "update memory" / "actualiza la memoria"
- Before starting any task: search vault for existing context

## Search Commands

```bash
# Fast keyword search (default, instant)
qmd search "query"

# Search specific collection
qmd search "query" -c vault

# More results
qmd search "query" -n 10

# JSON output (for processing)
qmd search "query" --json

# Get full document by path
qmd get "path/to/file.md"

# Get multiple docs
qmd multi-get "agentes/*.md" --json
```

## Setup (first time only)

```bash
qmd collection add /path/to/vault --name vault --mask "**/*.md"
qmd update
```

## Context Compaction Rules

When conversation gets long or context window fills up:

1. **Identify essential context**: What does the current task need?
2. **Summarize, don't copy**: Reduce 500 words to 50
3. **Save to memory**: Write compacted context to `memoria/MEMORY.md`
4. **Link, don't embed**: Use `[[wikilinks]]` instead of copying content
5. **Max 200 lines in MEMORY.md**: If over, compress oldest entries

## Memory Management Protocol

```
Before saving to memory:
1. Does this info already exist? → UPDATE, don't duplicate
2. Is this useful in future conversations? → SAVE
3. Is this ephemeral (current task only)? → DON'T SAVE
4. Is this derivable from code/git? → DON'T SAVE

After saving:
1. Run: qmd update (refresh index)
2. Verify: qmd search "what I just saved"
```

## Token Efficiency Rules

- NEVER load entire files when a search result suffices
- Use `qmd search` before `Read` tool (search is cheaper)
- Prefer `--json` output for structured processing
- Keep vault notes < 500 words each
- Compaction target: 10:1 ratio (10 lines input → 1 line saved)
