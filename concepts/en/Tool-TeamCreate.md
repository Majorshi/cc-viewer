# TeamCreate

Establishes a new collaboration team with a shared task list and inter-agent messaging channel. A team is the coordination primitive for multi-agent work — the main session acts as leader and spawns named teammates via the `Agent` tool.

## When to Use

- The user explicitly requests a team, swarm, crew, or multi-agent collaboration.
- A project has several clearly independent workstreams that benefit from dedicated specialists (e.g. frontend, backend, tests, docs).
- You need a persistent shared task list that multiple agents update as they make progress.
- You want named, addressable teammates that can exchange messages via `SendMessage` rather than one-shot subagent calls.

Do NOT use for a single delegated search or a one-off parallel fan-out — plain `Agent` calls are lighter and sufficient.

## Parameters

- `team_name` (string, required): Unique identifier for the team. Used as the directory name under `~/.claude/teams/` and as the `team_name` argument when spawning teammates.
- `description` (string, required): Short statement of the team's objective. Shown to every teammate on spawn and written into the team config.
- `agent_type` (string, optional): Default subagent persona applied to teammates that do not override it. Typical values are `general-purpose`, `Explore`, or `Plan`.

## Examples

### Example 1: Create a refactor team

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

After creation, spawn teammates with `Agent` using `team_name: "refactor-crew"` and distinct `name` values such as `db-lead`, `migrations`, and `tests`.

### Example 2: Create an investigation team

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Each spawned teammate inherits `Explore` as its default persona, matching the read-only investigative nature of the work.

## Notes

- Only one team can be led at a time from a given session. Finish or delete the current team before creating another.
- A team is 1:1 with a shared task list. The leader owns task creation, assignment, and closure; teammates update the status of tasks they are working on.
- Team configuration is persisted at `~/.claude/teams/{team_name}/config.json`, and the task directory lives alongside it. These files survive across sessions until explicitly removed with `TeamDelete`.
- Teammates are spawned using the `Agent` tool with matching `team_name` plus a distinct `name`. The `name` becomes the address used by `SendMessage`.
- Pick a `team_name` that is filesystem-safe (letters, digits, dashes, underscores). Avoid spaces or slashes.
- Write the `description` so that a brand-new teammate, reading it cold, would understand the team's goal without further context. It becomes part of every teammate's startup prompt.
