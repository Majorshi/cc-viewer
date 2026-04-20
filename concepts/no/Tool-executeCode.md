# executeCode

Utfører en kodesnutt inne i en levende kernel eller sandbox levert av en IDE-integrasjon (for eksempel Jupyter-kernelen bundet til den gjeldende åpne notebooken). Verktøyet er kun tilstede når Claude Code kjører sammen med en kompatibel IDE-bro som VS Code-utvidelsen med en valgt Jupyter-kernel.

## Når skal den brukes

- Kjøre en rask beregning, datainspeksjon eller plot mot tilstanden som allerede er lastet i en aktiv Jupyter-kernel.
- Validere en kodesnutt før du limer den inn i en notebook-celle.
- Utforske en datasett i minne, variabel eller modell som eksisterer i kernelen, men ikke er serialisert til disk.
- Produsere et diagram eller numerisk resultat som brukeren vil ha rendret inline i IDE-et.

IKKE bruk for frittstående skript som er bedre tjent med `Bash` som kjører `python script.py`, eller for kode som må persistere på tvers av en ny kernel.

## Parametere

- `code` (string, påkrevd): Koden som skal kjøres i gjeldende kernel. Kjører som om limt inn i en notebook-celle — variabler som defineres persisterer i kernelen til den startes på nytt.
- `language` (string, valgfri): Språket til snutten når IDE-broen støtter flere kerneler. Vanligvis utelatt; standard er språket til den aktive kernelen (typisk Python).

## Eksempler

### Eksempel 1: Inspiser en dataframe i minnet

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Returnerer de første radene, formen og kolonne-dtypene til en dataframe som allerede er lastet i kernelen.

### Eksempel 2: Rask numerisk sjekk

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Kjører en engangsberegning uten å opprette en notebook-celle.

## Notater

- `executeCode` er et IDE-bro-verktøy. Det er utilgjengelig i vanlige terminalsesjoner av Claude Code; det vises kun når sesjonen er koblet til en IDE som eksponerer en kernel (for eksempel VS Code Jupyter-utvidelsen).
- Tilstand persisterer i kernelen. Variabler definert av ett `executeCode`-kall forblir synlige for senere kall, for notebook-celler og for brukeren — vær oppmerksom på sideeffekter.
- Langvarig eller blokkerende kode vil blokkere kernelen. Hold snutter korte; for flere-minutters arbeid, skriv et faktisk skript og kjør det via `Bash`.
- Utdata (stdout, returverdier, bilder) returneres til sesjonen. Svært store utdata kan trunkeres av IDE-broen.
- For filredigeringer, foretrekk `Edit`, `Write` eller `NotebookEdit` — `executeCode` er ikke en erstatning for å skrive kildefiler.
