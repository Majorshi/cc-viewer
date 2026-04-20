# executeCode

Führt ein Code-Snippet innerhalb eines Live-Kernels oder einer Sandbox aus, die von einer IDE-Integration bereitgestellt wird (zum Beispiel der Jupyter-Kernel, der an das aktuell geöffnete Notebook gebunden ist). Das Tool ist nur verfügbar, wenn Claude Code neben einer kompatiblen IDE-Brücke wie der VS-Code-Erweiterung mit ausgewähltem Jupyter-Kernel läuft.

## Wann verwenden

- Ausführen einer schnellen Berechnung, Datenprüfung oder eines Plots gegen den Zustand, der bereits in einem aktiven Jupyter-Kernel geladen ist.
- Validieren eines Code-Snippets, bevor es in eine Notebook-Zelle eingefügt wird.
- Erkunden eines im Speicher gehaltenen Dataframes, einer Variablen oder eines Modells, das im Kernel existiert, aber nicht auf Platte serialisiert ist.
- Erzeugen eines Charts oder numerischen Ergebnisses, das der Benutzer inline in der IDE gerendert sehen möchte.

NICHT verwenden für eigenständige Skripte, die besser mit `Bash` und `python script.py` ausgeführt werden, oder für Code, der über einen frischen Kernel hinaus bestehen muss.

## Parameter

- `code` (string, erforderlich): Der im aktuellen Kernel auszuführende Code. Läuft, als wäre er in eine Notebook-Zelle eingefügt – definierte Variablen bleiben im Kernel erhalten, bis er neu gestartet wird.
- `language` (string, optional): Die Sprache des Snippets, wenn die IDE-Brücke mehrere Kernel unterstützt. Am häufigsten weggelassen; Standard ist die Sprache des aktiven Kernels (typischerweise Python).

## Beispiele

### Beispiel 1: Einen Dataframe im Speicher inspizieren

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Gibt die ersten Zeilen, die Form und die Spalten-dtypes eines bereits im Kernel geladenen Dataframes zurück.

### Beispiel 2: Schnelle numerische Prüfung

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Führt eine einmalige Berechnung aus, ohne eine Notebook-Zelle zu erstellen.

## Hinweise

- `executeCode` ist ein IDE-Brücken-Tool. Es ist in einfachen Terminal-Sitzungen von Claude Code nicht verfügbar; es erscheint nur, wenn die Sitzung mit einer IDE verbunden ist, die einen Kernel freigibt (zum Beispiel die VS-Code-Jupyter-Erweiterung).
- Zustand bleibt im Kernel erhalten. Von einem `executeCode`-Aufruf definierte Variablen bleiben späteren Aufrufen, Notebook-Zellen und dem Benutzer sichtbar – achten Sie auf Seiteneffekte.
- Langlaufender oder blockierender Code blockiert den Kernel. Halten Sie Snippets kurz; für Arbeit über mehrere Minuten schreiben Sie ein echtes Skript und führen es über `Bash` aus.
- Ausgabe (stdout, Rückgabewerte, Bilder) wird an die Sitzung zurückgegeben. Sehr große Ausgaben können von der IDE-Brücke gekürzt werden.
- Für Datei-Edits bevorzugen Sie `Edit`, `Write` oder `NotebookEdit` – `executeCode` ist kein Ersatz zum Verfassen von Quelldateien.
