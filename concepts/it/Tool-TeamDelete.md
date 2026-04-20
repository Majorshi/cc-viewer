# TeamDelete

Smantella il team attualmente attivo, rimuovendo la sua directory di configurazione e la directory dei task condivisi. È la controparte di pulizia di `TeamCreate` ed è tipicamente chiamato dopo che l'obiettivo del team è stato raggiunto e tutti i teammate si sono spenti.

## Quando usare

- Il team ha completato il suo lavoro e il rapporto finale è stato consegnato all'utente.
- Il team è stato creato per errore o il suo scope è cambiato così drasticamente che ricominciare da capo è più pulito che continuare.
- Hai bisogno di creare un nuovo team ma ce n'è già uno attivo — elimina prima quello vecchio, poiché solo un team può essere guidato alla volta.
- Un team è diventato stantio tra sessioni e il suo stato persistito sotto `~/.claude/teams/` non è più necessario.

NON chiamare mentre i teammate sono ancora in esecuzione — spegnili prima via `SendMessage` con un `shutdown_request`, attendi ogni `shutdown_response`, poi elimina.

## Parametri

`TeamDelete` non accetta parametri nella sua invocazione tipica. Opera sul team attualmente attivo posseduto dalla sessione chiamante.

## Esempi

### Esempio 1: Spegnimento di routine dopo il successo

1. Trasmetti una richiesta di shutdown al team:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Attendi che ogni teammate risponda con un `shutdown_response`.
3. Chiama `TeamDelete()` per rimuovere la directory del team e la directory dei task.

### Esempio 2: Sostituire un team mal configurato

Se `TeamCreate` è stato chiamato con `agent_type` o `description` sbagliati, assicurati prima che nessun teammate sia stato istanziato (o spegnili), poi:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Note

- `TeamDelete` fallisce se qualsiasi teammate è ancora attivo. La risposta di errore elenca i teammate vivi — invia a ciascuno un `shutdown_request` via `SendMessage`, attendi il loro `shutdown_response` e riprova.
- L'eliminazione è irreversibile dalla prospettiva del tool. La configurazione del team in `~/.claude/teams/{team_name}/config.json` e la sua directory dei task vengono rimosse dal disco. Se hai bisogno che la lista dei task sia preservata, esporta o copia la directory prima di eliminare.
- Solo la sessione leader che ha creato il team può eliminarlo. Un teammate istanziato non può chiamare `TeamDelete` sul proprio team.
- Eliminare il team non annulla alcuna modifica al filesystem che i teammate hanno fatto nel repository. Queste sono normali modifiche tracciate da git e devono essere annullate separatamente se indesiderate.
- Dopo che `TeamDelete` restituisce con successo, la sessione è libera di chiamare `TeamCreate` di nuovo per un nuovo team.
