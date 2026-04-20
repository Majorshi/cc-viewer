# TeamDelete

Nedbryder det aktuelt aktive team, fjerner dets konfigurationsmappe og delte opgavebibliotek. Dette er oprydningsmodstykket til `TeamCreate` og kaldes typisk, efter teamets mål er nået, og alle holdkammerater er lukket ned.

## Hvornår skal den bruges

- Teamet har fuldført sit arbejde, og den endelige rapport er leveret til brugeren.
- Teamet blev oprettet ved en fejl, eller dets omfang har ændret sig så drastisk, at det er renere at starte forfra end at fortsætte.
- Du skal oprette et nyt team, men et er allerede aktivt — slet det gamle først, da kun ét team kan ledes ad gangen.
- Et team er blevet forældet på tværs af sessioner, og dets persisterede tilstand under `~/.claude/teams/` er ikke længere nødvendig.

Kald det IKKE, mens holdkammerater stadig kører — luk dem først ned via `SendMessage` med en `shutdown_request`, vent på hver `shutdown_response`, og slet så.

## Parametre

`TeamDelete` tager ingen parametre i sin typiske invokering. Den opererer på det aktuelt aktive team ejet af den kaldende session.

## Eksempler

### Eksempel 1: Rutinemæssig nedlukning efter succes

1. Broadcast en nedlukningsanmodning til teamet:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Vent på, at hver holdkammerat svarer med et `shutdown_response`.
3. Kald `TeamDelete()` for at fjerne teammappen og opgavebiblioteket.

### Eksempel 2: Udskiftning af et fejlkonfigureret team

Hvis `TeamCreate` blev kaldt med den forkerte `agent_type` eller `description`, sørg først for, at ingen holdkammerater er blevet startet endnu (eller luk dem ned), og derefter:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Noter

- `TeamDelete` fejler, hvis nogen holdkammerat stadig er aktiv. Fejlsvaret lister de aktive holdkammerater — send hver af dem en `shutdown_request` via `SendMessage`, vent på deres `shutdown_response`, og prøv igen.
- Sletning er irreversibel fra værktøjets perspektiv. Teamets konfiguration på `~/.claude/teams/{team_name}/config.json` og dets opgavebibliotek fjernes fra disken. Hvis du har brug for, at opgavelisten bevares, eksportér eller kopiér biblioteket, før du sletter.
- Kun lederens session, der oprettede teamet, kan slette det. En startet holdkammerat kan ikke kalde `TeamDelete` på sit eget team.
- Sletning af teamet ruller ikke filsystemændringer tilbage, som holdkammerater foretog i repoet. Disse er almindelige git-sporede redigeringer og skal vendes separat, hvis uønskede.
- Efter at `TeamDelete` er returneret med succes, er sessionen fri til at kalde `TeamCreate` igen for et nyt team.
