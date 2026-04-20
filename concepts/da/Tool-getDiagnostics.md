# getDiagnostics

Henter language-server-diagnostik (fejl, advarsler, hints) fra det tilsluttede IDE for en specifik fil eller for hver fil, IDE'et aktuelt har åben. Bruges til at verificere, at kodeændringer kompilerer rent, før en opgave erklæres færdig.

## Hvornår skal den bruges

- Efter en `Edit` eller `Write` for at bekræfte, at ændringen ikke introducerede en typefejl, syntaksfejl eller lint-advarsel.
- Før en opgave afsluttes for at feje hver åben fil for uløste problemer.
- Ved diagnosticering af en fejl, brugeren rapporterer — at hente den nøjagtige compiler- eller type-checker-besked fra IDE'et undgår gætværk.
- Som et letvægtsalternativ til at køre en fuld build eller testkommando, når du kun har brug for at tjekke statisk korrekthed.

Stol IKKE på `getDiagnostics` som erstatning for testsuiten. Den rapporterer, hvad language-serveren ser, ikke hvad der kører på test- eller produktionstidspunktet.

## Parametre

- `uri` (string, valgfri): Filen-URI (typisk `file:///absolute/path`) at hente diagnostik for. Når den udelades, returnerer værktøjet diagnostik for hver fil, IDE'et aktuelt har åben.

## Eksempler

### Eksempel 1: Tjek en enkelt fil efter redigering

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Returnerer eventuelle TypeScript-fejl, ESLint-advarsler eller andre language-server-beskeder for `src/auth.ts`.

### Eksempel 2: Fej alle åbne filer

```
getDiagnostics()
```

Returnerer diagnostik på tværs af hver aktuelt åben editor. Nyttigt i slutningen af en multi-fil-refaktorering for at sikre, at intet regresserede andetsteds.

## Noter

- `getDiagnostics` er et IDE-bro-værktøj. Det er kun tilgængeligt, når Claude Code er forbundet til en understøttende IDE-integration (for eksempel VS Code-udvidelsen). I en almindelig terminalsession vil værktøjet ikke vises.
- Resultaterne afspejler de language-servere, IDE'et har indlæst — TypeScript, Pyright, ESLint, rust-analyzer osv. Kvalitet og dækning afhænger af brugerens IDE-opsætning, ikke af Claude Code.
- Diagnostik er live. Efter en redigering, giv language-serveren et øjeblik til at genanalysere, før et tomt resultat fortolkes som succes — kør igen, hvis filen lige blev gemt.
- Alvorlighedsniveauer inkluderer typisk `error`, `warning`, `information` og `hint`. Fokusér på `error` først; advarsler kan være bevidst projektstil.
- For filer, der ikke aktuelt er åbne i IDE'et, kan language-serveren intet have at rapportere, selv hvis filen indeholder reelle problemer. Åbn filen eller kør buildet for autoritativ dækning.
