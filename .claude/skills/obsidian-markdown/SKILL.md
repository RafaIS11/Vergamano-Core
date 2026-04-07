---
name: obsidian-vault
description: Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, and properties. Use when working with .md files in the VergaMano vault, creating notes, linking content, or managing the knowledge graph.
---

# Obsidian Vault Management

## When to use

- Creating or editing any .md file in the vault
- Linking notes with `[[wikilinks]]`
- Adding frontmatter properties
- Creating callouts for important info
- Managing the knowledge graph connections

## Note Template

```markdown
---
title: Note Title
tags: [pilar, tipo]
---

# Note Title
→ [[related-note-1]] · [[related-note-2]]

Content here. Keep under 500 words.

## Section

- Use wikilinks for internal vault connections: [[note-name]]
- Use markdown links for external URLs: [text](url)
```

## Rules for VergaMano Vault

1. **Every note MUST have at least 1 wikilink** → ensures graph connectivity
2. **Frontmatter required** on every note (title + tags minimum)
3. **Max 500 words per note** → forces conciseness
4. **Use callouts** for critical info:
   ```
   > [!important] Key Rule
   > Content here
   ```
5. **Tags follow pillar structure**: architect, spartan, mercenary, nomad, ghost, sistema
6. **No empty files** → if a note has < 3 lines of content, merge or delete it

## Wikilink Syntax

```markdown
[[Note Name]]                   → Link to note
[[Note Name|Display Text]]      → Custom display
[[Note Name#Heading]]           → Link to heading
[[#Heading in same note]]       → Same-note link
```

## Embed Syntax

```markdown
![[Note Name]]                  → Embed full note
![[Note Name#Heading]]          → Embed section
![[image.png|300]]              → Image with width
```

## Callout Types for VergaMano

```markdown
> [!danger] THE VOID
> HP below 30%. Immediate action required.

> [!tip] Progresión
> Completed X, next step: Y

> [!info] Intel
> New opportunity found via QLQ protocol.

> [!warning] Bug
> Known issue in component X.
```
