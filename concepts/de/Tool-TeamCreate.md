# TeamCreate

Etabliert ein neues Kollaborationsteam mit einer gemeinsamen Aufgabenliste und einem Messaging-Kanal zwischen Agenten. Ein Team ist das Koordinationsprimitive für Multi-Agenten-Arbeit – die Hauptsitzung fungiert als Leiter und startet namentlich benannte Teammitglieder über das `Agent`-Tool.

## Wann verwenden

- Der Benutzer fordert ausdrücklich ein Team, einen Schwarm, eine Crew oder eine Multi-Agenten-Zusammenarbeit an.
- Ein Projekt hat mehrere klar unabhängige Arbeitsstränge, die von dedizierten Spezialisten profitieren (z. B. Frontend, Backend, Tests, Docs).
- Sie benötigen eine persistente gemeinsame Aufgabenliste, die mehrere Agenten im Laufe der Arbeit aktualisieren.
- Sie möchten benannte, adressierbare Teammitglieder, die Nachrichten über `SendMessage` austauschen können, statt einmaliger Subagenten-Aufrufe.

NICHT verwenden für eine einzelne delegierte Suche oder ein einmaliges paralleles Fan-out – einfache `Agent`-Aufrufe sind leichter und ausreichend.

## Parameter

- `team_name` (string, erforderlich): Eindeutige Kennung für das Team. Verwendet als Verzeichnisname unter `~/.claude/teams/` und als `team_name`-Argument beim Starten von Teammitgliedern.
- `description` (string, erforderlich): Kurze Beschreibung des Teamziels. Wird jedem Teammitglied beim Start gezeigt und in die Team-Konfiguration geschrieben.
- `agent_type` (string, optional): Standard-Subagenten-Persona, angewendet auf Teammitglieder, die sie nicht überschreiben. Typische Werte sind `general-purpose`, `Explore` oder `Plan`.

## Beispiele

### Beispiel 1: Ein Refactor-Team erstellen

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Nach der Erstellung Teammitglieder mit `Agent` unter Verwendung von `team_name: "refactor-crew"` und verschiedenen `name`-Werten wie `db-lead`, `migrations` und `tests` starten.

### Beispiel 2: Ein Ermittlungsteam erstellen

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Jedes gestartete Teammitglied erbt `Explore` als Standard-Persona, was zum schreibgeschützten ermittelnden Charakter der Arbeit passt.

## Hinweise

- Aus einer gegebenen Sitzung kann jeweils nur ein Team geführt werden. Beenden oder löschen Sie das aktuelle Team, bevor Sie ein weiteres erstellen.
- Ein Team ist 1:1 mit einer gemeinsamen Aufgabenliste. Der Leiter besitzt das Erstellen, Zuweisen und Abschließen von Aufgaben; Teammitglieder aktualisieren den Status der Aufgaben, an denen sie arbeiten.
- Team-Konfiguration wird unter `~/.claude/teams/{team_name}/config.json` persistiert, und das Aufgabenverzeichnis liegt daneben. Diese Dateien überleben Sitzungen, bis sie ausdrücklich mit `TeamDelete` entfernt werden.
- Teammitglieder werden mit dem `Agent`-Tool unter passendem `team_name` plus distinktem `name` gestartet. Der `name` wird zur Adresse, die von `SendMessage` verwendet wird.
- Wählen Sie einen `team_name`, der dateisystemsicher ist (Buchstaben, Ziffern, Bindestriche, Unterstriche). Vermeiden Sie Leerzeichen oder Schrägstriche.
- Schreiben Sie die `description` so, dass ein brandneues Teammitglied, das sie kalt liest, das Ziel des Teams ohne weiteren Kontext verstehen würde. Sie wird Teil des Startup-Prompts jedes Teammitglieds.
