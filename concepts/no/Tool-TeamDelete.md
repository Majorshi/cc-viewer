# TeamDelete

River ned det gjeldende aktive teamet, og fjerner dets konfigurasjonskatalog og delte oppgavekatalog. Dette er opprydningsmotparten til `TeamCreate` og kalles typisk etter at teamets mål er oppnådd og alle lagkamerater er stengt ned.

## Når skal den brukes

- Teamet har fullført arbeidet sitt og sluttrapporten er levert til brukeren.
- Teamet ble opprettet ved en feil eller dets omfang har endret seg så drastisk at det er renere å starte på nytt enn å fortsette.
- Du må opprette et nytt team, men et er allerede aktivt — slett det gamle først, siden kun ett team kan ledes om gangen.
- Et team har blitt foreldet på tvers av sesjoner og dets persisterte tilstand under `~/.claude/teams/` er ikke lenger nødvendig.

IKKE kall mens lagkamerater fortsatt kjører — sten dem ned først via `SendMessage` med en `shutdown_request`, vent på hver `shutdown_response`, og slett deretter.

## Parametere

`TeamDelete` tar ingen parametere i sin typiske invokasjon. Den opererer på det gjeldende aktive teamet eid av den kallende sesjonen.

## Eksempler

### Eksempel 1: Rutinenedstengning etter suksess

1. Kringkast en shutdown-forespørsel til teamet:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Vent på at hver lagkamerat svarer med en `shutdown_response`.
3. Kall `TeamDelete()` for å fjerne teamkatalogen og oppgavekatalogen.

### Eksempel 2: Erstatte et feilkonfigurert team

Hvis `TeamCreate` ble kalt med feil `agent_type` eller `description`, sørg først for at ingen lagkamerater har blitt spawnet ennå (eller sten dem ned), og deretter:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Notater

- `TeamDelete` feiler hvis noen lagkamerat fortsatt er aktiv. Feilsvaret lister de levende lagkameratene — send hver en `shutdown_request` via `SendMessage`, vent på deres `shutdown_response`, og prøv på nytt.
- Sletting er irreversibel fra verktøyets perspektiv. Teamets konfigurasjon på `~/.claude/teams/{team_name}/config.json` og oppgavekatalogen fjernes fra disken. Hvis du trenger oppgavelisten bevart, eksporter eller kopier katalogen før sletting.
- Kun ledersesjonen som opprettet teamet kan slette det. En spawnet lagkamerat kan ikke kalle `TeamDelete` på sitt eget team.
- Å slette teamet ruller ikke tilbake filsystemsendringer som lagkamerater gjorde i repositoriet. Disse er vanlige git-sporede redigeringer og må reverseres separat hvis uønsket.
- Etter at `TeamDelete` returnerer vellykket, er sesjonen fri til å kalle `TeamCreate` igjen for et nytt team.
