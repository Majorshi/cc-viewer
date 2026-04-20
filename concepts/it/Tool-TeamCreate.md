# TeamCreate

Stabilisce un nuovo team di collaborazione con una lista di task condivisa e un canale di messaggistica inter-agente. Un team è la primitiva di coordinamento per il lavoro multi-agente — la sessione principale agisce come leader e istanzia teammate nominati via il tool `Agent`.

## Quando usare

- L'utente richiede esplicitamente un team, uno swarm, una crew o una collaborazione multi-agente.
- Un progetto ha diversi workstream chiaramente indipendenti che beneficiano di specialisti dedicati (ad esempio frontend, backend, test, docs).
- Hai bisogno di una lista di task condivisa persistente che più agenti aggiornano man mano che fanno progressi.
- Vuoi teammate nominati e indirizzabili che possano scambiare messaggi via `SendMessage` piuttosto che chiamate subagente one-shot.

NON usare per una singola ricerca delegata o un singolo fan-out parallelo — semplici chiamate `Agent` sono più leggere e sufficienti.

## Parametri

- `team_name` (string, obbligatorio): Identificatore univoco per il team. Usato come nome di directory sotto `~/.claude/teams/` e come argomento `team_name` quando si istanziano i teammate.
- `description` (string, obbligatorio): Breve dichiarazione dell'obiettivo del team. Mostrata a ogni teammate al momento dello spawn e scritta nella configurazione del team.
- `agent_type` (string, opzionale): Persona subagente predefinita applicata ai teammate che non la sovrascrivono. Valori tipici sono `general-purpose`, `Explore` o `Plan`.

## Esempi

### Esempio 1: Creare un team di refactor

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Dopo la creazione, istanzia teammate con `Agent` usando `team_name: "refactor-crew"` e valori `name` distinti come `db-lead`, `migrations` e `tests`.

### Esempio 2: Creare un team di indagine

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Ogni teammate istanziato eredita `Explore` come persona predefinita, coerentemente con la natura investigativa in sola lettura del lavoro.

## Note

- Solo un team può essere guidato alla volta da una data sessione. Finisci o elimina il team corrente prima di crearne un altro.
- Un team è 1:1 con una lista di task condivisa. Il leader possiede la creazione, assegnazione e chiusura dei task; i teammate aggiornano lo stato dei task su cui stanno lavorando.
- La configurazione del team è persistita in `~/.claude/teams/{team_name}/config.json`, e la directory dei task vive accanto ad essa. Questi file sopravvivono tra sessioni finché non rimossi esplicitamente con `TeamDelete`.
- I teammate sono istanziati usando il tool `Agent` con `team_name` corrispondente più un `name` distinto. Il `name` diventa l'indirizzo usato da `SendMessage`.
- Scegli un `team_name` che sia filesystem-safe (lettere, cifre, trattini, underscore). Evita spazi o slash.
- Scrivi la `description` così che un teammate nuovo, leggendola a freddo, capisca l'obiettivo del team senza ulteriore contesto. Diventa parte del prompt di avvio di ogni teammate.
