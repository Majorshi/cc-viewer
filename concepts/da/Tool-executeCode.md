# executeCode

Udfører et kodeuddrag inde i en live kernel eller sandbox leveret af en IDE-integration (for eksempel Jupyter-kernen bundet til den aktuelt åbne notebook). Værktøjet er kun til stede, når Claude Code kører sammen med en kompatibel IDE-bro som VS Code-udvidelsen med en Jupyter-kerne valgt.

## Hvornår skal den bruges

- Kør en hurtig beregning, dataundersøgelse eller et plot mod den tilstand, der allerede er indlæst i en aktiv Jupyter-kerne.
- Validér et kodeuddrag, før det indsættes i en notebook-celle.
- Udforsk en in-memory dataframe, variabel eller model, der eksisterer i kernen, men som ikke er serialiseret til disk.
- Producér et diagram eller numerisk resultat, som brugeren ønsker gengivet inline i IDE'et.

Brug det IKKE til selvstændige scripts, der ville være bedre tjent med `Bash`, der kører `python script.py`, eller til kode, der skal persistere på tværs af en frisk kerne.

## Parametre

- `code` (string, påkrævet): Koden, der skal udføres i den aktuelle kerne. Kører, som om den blev indsat i en notebook-celle — definerede variabler persisterer i kernen, indtil den genstartes.
- `language` (string, valgfri): Uddragets sprog, når IDE-broen understøtter flere kerner. Oftest udeladt; standard er sproget for den aktive kerne (typisk Python).

## Eksempler

### Eksempel 1: Inspicér en in-memory dataframe

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Returnerer de første rækker, formen og kolonne-dtypes for en dataframe, der allerede er indlæst i kernen.

### Eksempel 2: Hurtigt numerisk tjek

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Kører en engangs-beregning uden at oprette en notebook-celle.

## Noter

- `executeCode` er et IDE-bro-værktøj. Det er utilgængeligt i almindelige terminalsessioner af Claude Code; det vises kun, når sessionen er forbundet til et IDE, der eksponerer en kerne (for eksempel VS Code Jupyter-udvidelsen).
- Tilstand persisterer i kernen. Variabler defineret af et `executeCode`-kald forbliver synlige for senere kald, for notebook-celler og for brugeren — vær opmærksom på sideeffekter.
- Langvarig eller blokerende kode vil blokere kernen. Hold uddrag korte; til flerminut-arbejde, skriv et faktisk script og kør det via `Bash`.
- Output (stdout, returværdier, billeder) returneres til sessionen. Meget store output kan afkortes af IDE-broen.
- Til filredigeringer foretræk `Edit`, `Write` eller `NotebookEdit` — `executeCode` er ikke en erstatning for at skrive kildefiler.
