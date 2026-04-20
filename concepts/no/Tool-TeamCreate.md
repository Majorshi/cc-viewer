# TeamCreate

Etablerer et nytt samarbeidsteam med en delt oppgaveliste og inter-agent meldingskanal. Et team er koordinasjonsprimitiv for flere-agent-arbeid — hovedsesjonen fungerer som leder og spawner navngitte lagkamerater via `Agent`-verktøyet.

## Når skal den brukes

- Brukeren ber eksplisitt om et team, swarm, crew eller flere-agent-samarbeid.
- Et prosjekt har flere klart uavhengige arbeidsstrømmer som tjener på dedikerte spesialister (f.eks. frontend, backend, tester, dokumenter).
- Du trenger en persistent delt oppgaveliste som flere agenter oppdaterer etter hvert som de gjør fremgang.
- Du vil ha navngitte, adresserbare lagkamerater som kan utveksle meldinger via `SendMessage` i stedet for engangs-underagentkall.

IKKE bruk for et enkelt delegert søk eller en engangs-parallell utvidelse — vanlige `Agent`-kall er lettere og tilstrekkelige.

## Parametere

- `team_name` (string, påkrevd): Unik identifikator for teamet. Brukes som katalognavn under `~/.claude/teams/` og som `team_name`-argument når lagkamerater spawnes.
- `description` (string, påkrevd): Kort uttalelse om teamets mål. Vises til hver lagkamerat ved spawn og skrives inn i team-konfigurasjonen.
- `agent_type` (string, valgfri): Standard underagent-persona anvendt på lagkamerater som ikke overstyrer den. Typiske verdier er `general-purpose`, `Explore` eller `Plan`.

## Eksempler

### Eksempel 1: Opprett et refaktorerings-team

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Etter opprettelse, spawn lagkamerater med `Agent` ved å bruke `team_name: "refactor-crew"` og distinkte `name`-verdier som `db-lead`, `migrations` og `tests`.

### Eksempel 2: Opprett et undersøkelsesteam

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Hver spawnet lagkamerat arver `Explore` som standard persona, som matcher den skrivebeskyttede undersøkelsesnaturen til arbeidet.

## Notater

- Kun ett team kan ledes om gangen fra en gitt sesjon. Fullfør eller slett gjeldende team før du oppretter et annet.
- Et team er 1:1 med en delt oppgaveliste. Lederen eier oppgaveopprettelse, tildeling og avslutning; lagkamerater oppdaterer statusen på oppgaver de jobber med.
- Teamkonfigurasjon persisteres på `~/.claude/teams/{team_name}/config.json`, og oppgavekatalogen lever ved siden av den. Disse filene overlever på tvers av sesjoner til de eksplisitt fjernes med `TeamDelete`.
- Lagkamerater spawnes med `Agent`-verktøyet med matchende `team_name` pluss et distinkt `name`. `name` blir adressen brukt av `SendMessage`.
- Velg et `team_name` som er filsystem-trygt (bokstaver, tall, bindestreker, understreker). Unngå mellomrom eller skråstreker.
- Skriv `description` slik at en helt ny lagkamerat, som leser den uten forkunnskap, vil forstå teamets mål uten ytterligere kontekst. Den blir del av hver lagkamerats startprompt.
