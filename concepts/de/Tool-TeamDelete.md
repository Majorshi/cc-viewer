# TeamDelete

Baut das derzeit aktive Team ab und entfernt sein Konfigurationsverzeichnis und gemeinsames Aufgabenverzeichnis. Dies ist das Aufräum-Gegenstück zu `TeamCreate` und wird typischerweise aufgerufen, nachdem das Ziel des Teams erreicht wurde und alle Teammitglieder heruntergefahren sind.

## Wann verwenden

- Das Team hat seine Arbeit abgeschlossen und der Schlussbericht wurde an den Benutzer geliefert.
- Das Team wurde fälschlicherweise erstellt oder sein Umfang hat sich so drastisch geändert, dass ein Neustart sauberer ist als fortzufahren.
- Sie müssen ein neues Team erstellen, aber eines ist bereits aktiv – löschen Sie zuerst das alte, da immer nur ein Team geführt werden kann.
- Ein Team ist über Sitzungen hinweg veraltet und sein persistierter Zustand unter `~/.claude/teams/` wird nicht mehr benötigt.

NICHT aufrufen, solange Teammitglieder noch laufen – fahren Sie diese zuerst über `SendMessage` mit einem `shutdown_request` herunter, warten Sie auf jedes `shutdown_response` und löschen Sie dann.

## Parameter

`TeamDelete` nimmt in seiner typischen Invocation keine Parameter entgegen. Es operiert auf dem derzeit aktiven Team, das von der aufrufenden Sitzung besessen wird.

## Beispiele

### Beispiel 1: Routine-Shutdown nach Erfolg

1. Eine Shutdown-Anfrage an das Team rundsenden:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Warten, bis jedes Teammitglied mit einem `shutdown_response` antwortet.
3. `TeamDelete()` aufrufen, um das Team-Verzeichnis und das Aufgabenverzeichnis zu entfernen.

### Beispiel 2: Ein fehlkonfiguriertes Team ersetzen

Wenn `TeamCreate` mit falschem `agent_type` oder `description` aufgerufen wurde, zuerst sicherstellen, dass noch keine Teammitglieder gestartet wurden (oder diese herunterfahren), dann:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Hinweise

- `TeamDelete` schlägt fehl, wenn noch Teammitglieder aktiv sind. Die Fehlerantwort listet die lebenden Teammitglieder auf – senden Sie jedem einen `shutdown_request` über `SendMessage`, warten Sie auf deren `shutdown_response` und versuchen Sie es erneut.
- Das Löschen ist aus Sicht des Tools unumkehrbar. Die Team-Konfiguration unter `~/.claude/teams/{team_name}/config.json` und deren Aufgabenverzeichnis werden von der Festplatte entfernt. Wenn Sie die Aufgabenliste bewahren möchten, exportieren oder kopieren Sie das Verzeichnis vor dem Löschen.
- Nur die Leiter-Sitzung, die das Team erstellt hat, kann es löschen. Ein gestartetes Teammitglied kann `TeamDelete` nicht auf sein eigenes Team anwenden.
- Das Löschen des Teams macht keine Dateisystemänderungen rückgängig, die Teammitglieder im Repository vorgenommen haben. Dies sind gewöhnliche git-verfolgte Edits und müssen separat zurückgesetzt werden, falls unerwünscht.
- Nach erfolgreichem Rückkehren von `TeamDelete` steht der Sitzung frei, `TeamCreate` erneut für ein neues Team aufzurufen.
