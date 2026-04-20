# getDiagnostics

Henter språktjener-diagnostikk (feil, advarsler, hint) fra den tilkoblede IDE-en for en spesifikk fil eller for hver fil IDE-en for øyeblikket har åpen. Brukes for å verifisere at kodeendringer kompilerer rent før en oppgave erklæres fullført.

## Når skal den brukes

- Etter en `Edit` eller `Write` for å bekrefte at endringen ikke introduserte en typefeil, syntaksfeil eller lint-advarsel.
- Før avslutning av en oppgave for å sveipe hver åpen fil for uløste problemer.
- Når du diagnostiserer en feil brukeren rapporterer — å hente den eksakte kompilator- eller typekontrollmeldingen fra IDE-en unngår gjetning.
- Som et lettvektsalternativ til å kjøre et fullt bygg eller test-kommando når du kun trenger å sjekke statisk korrekthet.

IKKE stol på `getDiagnostics` som erstatning for testsuiten. Det rapporterer hva språktjeneren ser, ikke hva som kjører ved test eller produksjonstid.

## Parametere

- `uri` (string, valgfri): Fil-URI-en (typisk `file:///absolute/path`) å hente diagnostikk for. Når utelatt returnerer verktøyet diagnostikk for hver fil IDE-en for øyeblikket har åpen.

## Eksempler

### Eksempel 1: Sjekk én fil etter redigering

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Returnerer eventuelle TypeScript-feil, ESLint-advarsler eller andre språktjenermeldinger for `src/auth.ts`.

### Eksempel 2: Sveip alle åpne filer

```
getDiagnostics()
```

Returnerer diagnostikk på tvers av hver aktuelle åpne editor. Nyttig på slutten av en flerfilsrefaktorering for å sikre at ingenting regredierte andre steder.

## Notater

- `getDiagnostics` er et IDE-bro-verktøy. Det er kun tilgjengelig når Claude Code er koblet til en støttende IDE-integrasjon (for eksempel VS Code-utvidelsen). I en vanlig terminalsesjon vil ikke verktøyet vises.
- Resultatene reflekterer hvilke språktjenere IDE-en har lastet — TypeScript, Pyright, ESLint, rust-analyzer, osv. Kvalitet og dekning avhenger av brukerens IDE-oppsett, ikke av Claude Code.
- Diagnostikk er live. Etter en redigering, gi språktjeneren et øyeblikk til å reanalysere før du tolker et tomt resultat som suksess — kjør på nytt hvis filen nettopp ble lagret.
- Alvorlighetsnivåer inkluderer typisk `error`, `warning`, `information` og `hint`. Fokuser på `error` først; advarsler kan være bevisst prosjektstil.
- For filer som ikke for øyeblikket er åpne i IDE-en, kan språktjeneren ha ingen diagnostikk å rapportere selv om filen inneholder ekte problemer. Åpne filen eller kjør byggetilstand for autoritativ dekning.
