# TeamCreate

Establece un nuevo equipo de colaboración con una lista de tareas compartida y un canal de mensajería entre agentes. Un equipo es la primitiva de coordinación para trabajo multiagente — la sesión principal actúa como líder y genera compañeros con nombre mediante la herramienta `Agent`.

## Cuándo usar

- El usuario solicita explícitamente un equipo, enjambre, tripulación o colaboración multiagente.
- Un proyecto tiene varios flujos de trabajo claramente independientes que se benefician de especialistas dedicados (p. ej. frontend, backend, pruebas, documentación).
- Necesitas una lista de tareas compartida persistente que varios agentes actualicen a medida que avanzan.
- Quieres compañeros con nombre y direccionables que puedan intercambiar mensajes vía `SendMessage` en lugar de llamadas de subagente de una sola vez.

NO uses esto para una sola búsqueda delegada o una dispersión paralela puntual — las llamadas simples `Agent` son más ligeras y suficientes.

## Parámetros

- `team_name` (string, obligatorio): Identificador único para el equipo. Se usa como nombre de directorio bajo `~/.claude/teams/` y como el argumento `team_name` al generar compañeros.
- `description` (string, obligatorio): Declaración corta del objetivo del equipo. Se muestra a cada compañero al generarse y se escribe en la configuración del equipo.
- `agent_type` (string, opcional): Persona de subagente por defecto aplicada a compañeros que no la sobrescriban. Valores típicos son `general-purpose`, `Explore` o `Plan`.

## Ejemplos

### Ejemplo 1: Crear un equipo de refactor

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Tras la creación, genera compañeros con `Agent` usando `team_name: "refactor-crew"` y valores `name` distintos como `db-lead`, `migrations` y `tests`.

### Ejemplo 2: Crear un equipo de investigación

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Cada compañero generado hereda `Explore` como su persona por defecto, lo que coincide con la naturaleza investigativa de solo lectura del trabajo.

## Notas

- Solo se puede liderar un equipo a la vez desde una sesión dada. Termina o elimina el equipo actual antes de crear otro.
- Un equipo es 1:1 con una lista de tareas compartida. El líder posee la creación, asignación y cierre de tareas; los compañeros actualizan el estado de las tareas en las que están trabajando.
- La configuración del equipo se persiste en `~/.claude/teams/{team_name}/config.json`, y el directorio de tareas vive junto a ella. Estos archivos sobreviven entre sesiones hasta que se eliminen explícitamente con `TeamDelete`.
- Los compañeros se generan usando la herramienta `Agent` con un `team_name` coincidente más un `name` distinto. El `name` se convierte en la dirección usada por `SendMessage`.
- Elige un `team_name` que sea seguro para el sistema de archivos (letras, dígitos, guiones, guiones bajos). Evita espacios o barras.
- Escribe la `description` de modo que un compañero nuevo, leyéndola en frío, pueda entender el objetivo del equipo sin más contexto. Se convierte en parte del prompt de arranque de cada compañero.
