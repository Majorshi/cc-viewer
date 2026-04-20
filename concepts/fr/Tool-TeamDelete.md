# TeamDelete

Démantèle l'équipe actuellement active, en supprimant son répertoire de configuration et son répertoire de tâches partagé. C'est le pendant de nettoyage de `TeamCreate` et il est typiquement appelé après que l'objectif de l'équipe a été atteint et que tous les coéquipiers ont été arrêtés.

## Quand l'utiliser

- L'équipe a terminé son travail et le rapport final a été remis à l'utilisateur.
- L'équipe a été créée par erreur ou son périmètre a tellement changé qu'il est plus propre de repartir de zéro que de continuer.
- Vous devez créer une nouvelle équipe mais une est déjà active — supprimez d'abord l'ancienne, puisqu'une seule équipe peut être dirigée à la fois.
- Une équipe est devenue obsolète au fil des sessions et son état persisté sous `~/.claude/teams/` n'est plus nécessaire.

N'appelez PAS pendant que des coéquipiers sont encore en cours d'exécution — arrêtez-les d'abord via `SendMessage` avec un `shutdown_request`, attendez chaque `shutdown_response`, puis supprimez.

## Paramètres

`TeamDelete` ne prend aucun paramètre dans son invocation typique. Il opère sur l'équipe actuellement active détenue par la session appelante.

## Exemples

### Exemple 1 : arrêt de routine après succès

1. Diffuser une demande d'arrêt à l'équipe :
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Attendre que chaque coéquipier réponde avec un `shutdown_response`.
3. Appeler `TeamDelete()` pour supprimer le répertoire d'équipe et le répertoire de tâches.

### Exemple 2 : remplacer une équipe mal configurée

Si `TeamCreate` a été appelé avec le mauvais `agent_type` ou `description`, assurez-vous d'abord qu'aucun coéquipier n'a été lancé (ou arrêtez-les), puis :

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Notes

- `TeamDelete` échoue si un coéquipier est encore actif. La réponse d'erreur liste les coéquipiers en vie — envoyez à chacun un `shutdown_request` via `SendMessage`, attendez leur `shutdown_response` et réessayez.
- La suppression est irréversible du point de vue de l'outil. La configuration de l'équipe à `~/.claude/teams/{team_name}/config.json` et son répertoire de tâches sont supprimés du disque. Si vous avez besoin de préserver la liste de tâches, exportez ou copiez le répertoire avant de supprimer.
- Seule la session chef qui a créé l'équipe peut la supprimer. Un coéquipier généré ne peut pas appeler `TeamDelete` sur sa propre équipe.
- Supprimer l'équipe ne rétablit pas les modifications du système de fichiers que les coéquipiers ont apportées dans le dépôt. Ce sont des modifications suivies par git ordinaires et doivent être annulées séparément si indésirables.
- Après le retour réussi de `TeamDelete`, la session est libre d'appeler `TeamCreate` à nouveau pour une nouvelle équipe.
