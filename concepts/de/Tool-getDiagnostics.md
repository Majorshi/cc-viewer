# getDiagnostics

Ruft Language-Server-Diagnosen (Fehler, Warnungen, Hinweise) aus der verbundenen IDE für eine bestimmte Datei oder für jede Datei ab, die die IDE derzeit geöffnet hat. Wird verwendet, um zu verifizieren, dass Code-Änderungen sauber kompilieren, bevor eine Aufgabe für erledigt erklärt wird.

## Wann verwenden

- Nach einem `Edit` oder `Write`, um zu bestätigen, dass die Änderung keinen Typfehler, Syntaxfehler oder keine Lint-Warnung eingeführt hat.
- Vor dem Beenden einer Aufgabe, um jede offene Datei nach ungelösten Problemen zu durchsuchen.
- Beim Diagnostizieren eines vom Benutzer gemeldeten Fehlers – das Ziehen der exakten Compiler- oder Type-Checker-Meldung aus der IDE vermeidet Rätselraten.
- Als leichtgewichtige Alternative zur Ausführung eines vollständigen Builds oder Testbefehls, wenn Sie nur die statische Korrektheit prüfen müssen.

Verlassen Sie sich NICHT auf `getDiagnostics` als Ersatz für die Test-Suite. Es meldet, was der Language-Server sieht, nicht was zur Test- oder Produktionszeit läuft.

## Parameter

- `uri` (string, optional): Die Datei-URI (typischerweise `file:///absolute/path`), für die Diagnosen abgerufen werden sollen. Wenn weggelassen, gibt das Tool Diagnosen für jede derzeit in der IDE geöffnete Datei zurück.

## Beispiele

### Beispiel 1: Eine einzelne Datei nach dem Bearbeiten prüfen

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Gibt alle TypeScript-Fehler, ESLint-Warnungen oder andere Language-Server-Meldungen für `src/auth.ts` zurück.

### Beispiel 2: Alle geöffneten Dateien durchkämmen

```
getDiagnostics()
```

Gibt Diagnosen über jeden derzeit geöffneten Editor zurück. Nützlich am Ende eines dateiübergreifenden Refactorings, um sicherzustellen, dass anderswo nichts regrediert ist.

## Hinweise

- `getDiagnostics` ist ein IDE-Brücken-Tool. Es ist nur verfügbar, wenn Claude Code mit einer unterstützenden IDE-Integration verbunden ist (zum Beispiel der VS-Code-Erweiterung). In einer reinen Terminal-Sitzung erscheint das Tool nicht.
- Die Ergebnisse spiegeln wider, welche Language-Server die IDE geladen hat – TypeScript, Pyright, ESLint, rust-analyzer usw. Qualität und Abdeckung hängen vom IDE-Setup des Benutzers ab, nicht von Claude Code.
- Diagnosen sind live. Geben Sie dem Language-Server nach einem Edit einen Moment zur Neu-Analyse, bevor Sie ein leeres Ergebnis als Erfolg interpretieren – wiederholen Sie, falls die Datei gerade gespeichert wurde.
- Schweregrade umfassen typischerweise `error`, `warning`, `information` und `hint`. Fokussieren Sie sich zuerst auf `error`; Warnungen können absichtlicher Projektstil sein.
- Für Dateien, die derzeit nicht in der IDE geöffnet sind, hat der Language-Server möglicherweise keine Diagnosen zu melden, selbst wenn die Datei echte Probleme enthält. Öffnen Sie die Datei oder führen Sie den Build aus, um autoritative Abdeckung zu erhalten.
