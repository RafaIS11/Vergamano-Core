---
name: obsidian-bases
description: Create and edit Obsidian Bases (.base files) for database views of vault notes. Use for: task trackers, XP logs, pilar dashboards, daily note indexes, project databases.
---

# OBSIDIAN BASES — VergaMano

Crea vistas tipo base de datos de las notas del vault. Ideal para dashboards de XP, trackers de tareas por pilar, y logs diarios.

## Casos de uso en VergaMano

- Dashboard de XP por pilar (tabla de todos los daily-logs)
- Tracker de tareas pendientes por pillar
- Índice de daily-logs con filtros por fecha
- Vista de agentes con su estado

## Estructura de un .base file

```yaml
filters:
  where: <filter expression>

properties:
  - name: <property name>
    type: <note | file | formula>
    formula: <expression>  # solo si type=formula

summaries:
  - property: <property>
    formula: <summary formula>

views:
  - type: table | cards | list | map
    name: <view name>
    order:
      - property: <property>
        direction: asc | desc
    groupBy: <property>
    filters:
      where: <filter expression>
```

## Filtros útiles para VergaMano

```
# Solo daily logs
where: path contains "daily-logs"

# Solo archivos de pilares
where: path contains "pilares"

# Notas con tag específico
where: tags contains "spartan"

# Notas modificadas hoy
where: mtime > date("today")

# Combinaciones
where: (tags contains "pilar") && (mtime > date("2026-01-01"))
```

## Propiedades de archivo disponibles

```
name        — nombre del archivo sin extensión
path        — ruta relativa en el vault
mtime       — fecha de última modificación
ctime       — fecha de creación
size        — tamaño en bytes
tags        — array de tags del frontmatter
```

## Fórmulas para XP tracking

```
# Días desde creación
formula: round((date("today") - ctime).days)

# Nombre del pilar desde el path
formula: if(path contains "architect", "Architect", 
         if(path contains "spartan", "Spartan", "Otro"))
```

## Ejemplo: Dashboard Daily Logs

```yaml
filters:
  where: path contains "daily-logs"

properties:
  - name: days_ago
    type: formula
    formula: round((date("today") - ctime).days)

views:
  - type: table
    name: Logs recientes
    order:
      - property: ctime
        direction: desc
```

## Reglas

1. Siempre guardar como `nombre.base` en el vault
2. Validar IDs únicos en edges si usas canvas junto a bases
3. Formulas de fecha: siempre `.days` al restar dates
4. Para VergaMano: bases en `vault/outputs/` o `vault/memoria/`
