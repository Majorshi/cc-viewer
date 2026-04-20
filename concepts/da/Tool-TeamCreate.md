# TeamCreate

Etablerer et nyt samarbejdsteam med en delt opgaveliste og en kanal for inter-agent-beskeder. Et team er koordinationsprimitivet for multi-agent-arbejde — hovedsessionen fungerer som leder og starter navngivne holdkammerater via `Agent`-værktøjet.

## Hvornår skal den bruges

- Brugeren anmoder udtrykkeligt om et team, en swarm, et crew eller multi-agent-samarbejde.
- Et projekt har flere klart uafhængige arbejdsstrømme, der drager fordel af dedikerede specialister (f.eks. frontend, backend, tests, docs).
- Du har brug for en vedvarende delt opgaveliste, som flere agenter opdaterer, mens de gør fremskridt.
- Du ønsker navngivne, adresserbare holdkammerater, der kan udveksle beskeder via `SendMessage` frem for one-shot underagentkald.

Brug det IKKE til en enkelt delegeret søgning eller en engangs parallel fan-out — almindelige `Agent`-kald er lettere og tilstrækkelige.

## Parametre

- `team_name` (string, påkrævet): Unik identifikator for teamet. Bruges som mappenavn under `~/.claude/teams/` og som `team_name`-argument ved start af holdkammerater.
- `description` (string, påkrævet): Kort erklæring om teamets mål. Vises for hver holdkammerat ved start og skrives i teamkonfigurationen.
- `agent_type` (string, valgfri): Standard-underagent-persona anvendt på holdkammerater, der ikke tilsidesætter den. Typiske værdier er `general-purpose`, `Explore` eller `Plan`.

## Eksempler

### Eksempel 1: Opret et refaktoreringsteam

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Efter oprettelse start holdkammerater med `Agent` ved hjælp af `team_name: "refactor-crew"` og distinkte `name`-værdier som `db-lead`, `migrations` og `tests`.

### Eksempel 2: Opret et undersøgelsesteam

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Hver startet holdkammerat arver `Explore` som sin standardpersona, hvilket matcher arbejdets skrivebeskyttede undersøgende natur.

## Noter

- Kun ét team kan ledes ad gangen fra en given session. Afslut eller slet det aktuelle team, før du opretter et andet.
- Et team er 1:1 med en delt opgaveliste. Lederen ejer opgaveoprettelse, tildeling og lukning; holdkammerater opdaterer status på opgaver, de arbejder på.
- Teamkonfiguration persisteres på `~/.claude/teams/{team_name}/config.json`, og opgavebiblioteket ligger ved siden af den. Disse filer overlever på tværs af sessioner, indtil de eksplicit fjernes med `TeamDelete`.
- Holdkammerater startes ved hjælp af `Agent`-værktøjet med matchende `team_name` plus et distinkt `name`. `name` bliver den adresse, der bruges af `SendMessage`.
- Vælg et `team_name`, der er filsystemsikkert (bogstaver, cifre, bindestreger, understregninger). Undgå mellemrum eller skråstreger.
- Skriv `description`, så en helt ny holdkammerat, der læser den koldt, ville forstå teamets mål uden yderligere kontekst. Den bliver en del af hver holdkammerats startprompt.
