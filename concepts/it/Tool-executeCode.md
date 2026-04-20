# executeCode

Esegue uno snippet di codice all'interno di un kernel live o sandbox fornito da un'integrazione IDE (ad esempio il kernel Jupyter legato al notebook attualmente aperto). Il tool è presente solo quando Claude Code è in esecuzione accanto a un bridge IDE compatibile come l'estensione VS Code con un kernel Jupyter selezionato.

## Quando usare

- Eseguire un calcolo rapido, ispezione di dati o plot contro lo stato già caricato in un kernel Jupyter attivo.
- Validare uno snippet di codice prima di incollarlo in una cella di notebook.
- Esplorare un dataframe in memoria, una variabile o un modello che esiste nel kernel ma non è serializzato su disco.
- Produrre un grafico o un risultato numerico che l'utente vuole reso inline nell'IDE.

NON usare per script standalone che sarebbero meglio serviti da `Bash` che esegue `python script.py`, o per codice che deve persistere attraverso un kernel nuovo.

## Parametri

- `code` (string, obbligatorio): Il codice da eseguire nel kernel corrente. Viene eseguito come se fosse incollato in una cella di notebook — le variabili definite persistono nel kernel fino al riavvio.
- `language` (string, opzionale): Il linguaggio dello snippet quando il bridge IDE supporta più kernel. Più comunemente omesso; default: il linguaggio del kernel attivo (tipicamente Python).

## Esempi

### Esempio 1: Ispezionare un dataframe in memoria

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Restituisce le prime righe, la forma e i dtype delle colonne di un dataframe già caricato nel kernel.

### Esempio 2: Controllo numerico rapido

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Esegue un calcolo una tantum senza creare una cella di notebook.

## Note

- `executeCode` è un tool bridge IDE. Non è disponibile in sessioni terminal semplici di Claude Code; appare solo quando la sessione è connessa a un IDE che espone un kernel (ad esempio l'estensione VS Code Jupyter).
- Lo stato persiste nel kernel. Le variabili definite da una chiamata `executeCode` restano visibili alle chiamate successive, alle celle di notebook e all'utente — fai attenzione agli effetti collaterali.
- Codice a lunga esecuzione o bloccante bloccherà il kernel. Mantieni gli snippet brevi; per lavoro di diversi minuti, scrivi uno script vero e proprio ed eseguilo via `Bash`.
- L'output (stdout, valori di ritorno, immagini) viene restituito alla sessione. Output molto grandi possono essere troncati dal bridge IDE.
- Per modifiche ai file, preferisci `Edit`, `Write` o `NotebookEdit` — `executeCode` non è un sostituto per l'authoring dei file sorgente.
