# getDiagnostics

Recupera diagnostiche del language server (errori, avvisi, suggerimenti) dall'IDE connesso per un file specifico o per ogni file che l'IDE ha attualmente aperto. Usato per verificare che le modifiche al codice compilino pulitamente prima di dichiarare un compito completato.

## Quando usare

- Dopo un `Edit` o `Write` per confermare che la modifica non abbia introdotto un errore di tipo, errore di sintassi o avviso di lint.
- Prima di terminare un compito per esaminare ogni file aperto per problemi irrisolti.
- Quando si diagnostica un errore che l'utente riporta — estrarre il messaggio esatto del compilatore o type-checker dall'IDE evita di indovinare.
- Come alternativa leggera all'esecuzione di una build o test suite completa quando hai solo bisogno di controllare la correttezza statica.

NON fare affidamento su `getDiagnostics` come sostituto della suite di test. Riporta ciò che il language server vede, non ciò che viene eseguito in test o produzione.

## Parametri

- `uri` (string, opzionale): L'URI del file (tipicamente `file:///absolute/path`) per cui recuperare le diagnostiche. Quando omesso, il tool restituisce diagnostiche per ogni file che l'IDE ha attualmente aperto.

## Esempi

### Esempio 1: Controllare un singolo file dopo l'editing

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Restituisce qualsiasi errore TypeScript, avviso ESLint o altro messaggio del language server per `src/auth.ts`.

### Esempio 2: Esaminare tutti i file aperti

```
getDiagnostics()
```

Restituisce diagnostiche attraverso ogni editor attualmente aperto. Utile alla fine di un refactor multi-file per assicurarsi che nulla abbia fatto regressione altrove.

## Note

- `getDiagnostics` è un tool bridge IDE. È disponibile solo quando Claude Code è connesso a un'integrazione IDE supportata (ad esempio l'estensione VS Code). In una sessione terminal semplice il tool non apparirà.
- I risultati riflettono qualunque language server l'IDE abbia caricato — TypeScript, Pyright, ESLint, rust-analyzer, ecc. Qualità e copertura dipendono dalla configurazione IDE dell'utente, non da Claude Code.
- Le diagnostiche sono live. Dopo una modifica, dai al language server un momento per rianalizzare prima di interpretare un risultato vuoto come successo — ri-esegui se il file è appena stato salvato.
- I livelli di severità includono tipicamente `error`, `warning`, `information` e `hint`. Concentrati prima su `error`; gli avvisi possono essere stile di progetto intenzionale.
- Per file non attualmente aperti nell'IDE, il language server potrebbe non avere diagnostiche da riportare anche se il file contiene problemi reali. Apri il file o esegui la build per copertura autoritativa.
