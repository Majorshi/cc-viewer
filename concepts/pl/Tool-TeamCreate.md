# TeamCreate

Ustanawia nowy zespół współpracy ze współdzieloną listą zadań i kanałem komunikacji między agentami. Zespół to prymityw koordynacyjny dla pracy wieloagentowej — główna sesja działa jako lider i tworzy nazwanych współpracowników za pomocą narzędzia `Agent`.

## Kiedy używać

- Użytkownik wyraźnie prosi o zespół, rój, załogę lub współpracę wieloagentową.
- Projekt ma kilka wyraźnie niezależnych strumieni pracy, które korzystają z dedykowanych specjalistów (np. frontend, backend, testy, dokumentacja).
- Potrzebujesz trwałej wspólnej listy zadań, którą wielu agentów aktualizuje w miarę postępów.
- Chcesz nazwanych, adresowalnych współpracowników, którzy mogą wymieniać wiadomości przez `SendMessage`, a nie jednorazowych wywołań podagentów.

NIE używaj dla pojedynczego delegowanego wyszukiwania ani jednorazowego równoległego rozrzutu — zwykłe wywołania `Agent` są lżejsze i wystarczające.

## Parametry

- `team_name` (string, wymagany): Unikalny identyfikator zespołu. Używany jako nazwa katalogu pod `~/.claude/teams/` oraz jako argument `team_name` przy tworzeniu współpracowników.
- `description` (string, wymagany): Krótkie zdanie o celu zespołu. Wyświetlane każdemu współpracownikowi przy tworzeniu i zapisywane w konfiguracji zespołu.
- `agent_type` (string, opcjonalny): Domyślna persona podagenta stosowana do współpracowników, którzy jej nie nadpisują. Typowe wartości to `general-purpose`, `Explore` lub `Plan`.

## Przykłady

### Przykład 1: Utwórz zespół refaktoringu

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Po utworzeniu twórz współpracowników za pomocą `Agent` z `team_name: "refactor-crew"` oraz odrębnymi wartościami `name`, takimi jak `db-lead`, `migrations` i `tests`.

### Przykład 2: Utwórz zespół dochodzeniowy

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Każdy utworzony współpracownik dziedziczy `Explore` jako swoją domyślną personę, co odpowiada naturze pracy dochodzeniowej tylko do odczytu.

## Uwagi

- Tylko jeden zespół może być prowadzony naraz z danej sesji. Zakończ lub usuń bieżący zespół przed utworzeniem innego.
- Zespół odpowiada 1:1 współdzielonej liście zadań. Lider jest właścicielem tworzenia, przypisywania i zamykania zadań; współpracownicy aktualizują status zadań, nad którymi pracują.
- Konfiguracja zespołu jest zapisywana w `~/.claude/teams/{team_name}/config.json`, a katalog zadań znajduje się obok niej. Te pliki przetrwają między sesjami, aż zostaną jawnie usunięte za pomocą `TeamDelete`.
- Współpracownicy są tworzeni za pomocą narzędzia `Agent` z pasującym `team_name` oraz odrębnym `name`. `name` staje się adresem używanym przez `SendMessage`.
- Wybierz `team_name` bezpieczny dla systemu plików (litery, cyfry, myślniki, podkreślenia). Unikaj spacji lub ukośników.
- Napisz `description` tak, aby całkiem nowy współpracownik, czytając na zimno, zrozumiał cel zespołu bez dalszego kontekstu. Staje się ono częścią promptu startowego każdego współpracownika.
