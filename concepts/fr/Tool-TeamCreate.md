# TeamCreate

Établit une nouvelle équipe de collaboration avec une liste de tâches partagée et un canal de messagerie inter-agents. Une équipe est la primitive de coordination pour le travail multi-agents — la session principale fait office de chef et fait apparaître des coéquipiers nommés via l'outil `Agent`.

## Quand l'utiliser

- L'utilisateur demande explicitement une équipe, un essaim, un équipage ou une collaboration multi-agents.
- Un projet comporte plusieurs flux de travail clairement indépendants qui bénéficient de spécialistes dédiés (par exemple frontend, backend, tests, docs).
- Vous avez besoin d'une liste de tâches partagée persistante que plusieurs agents mettent à jour à mesure qu'ils progressent.
- Vous voulez des coéquipiers nommés et adressables capables d'échanger des messages via `SendMessage` plutôt que des appels de sous-agent à usage unique.

N'utilisez PAS pour une unique recherche déléguée ou un fan-out parallèle ponctuel — de simples appels `Agent` sont plus légers et suffisants.

## Paramètres

- `team_name` (string, requis) : identifiant unique pour l'équipe. Utilisé comme nom de répertoire sous `~/.claude/teams/` et comme argument `team_name` lors du lancement de coéquipiers.
- `description` (string, requis) : courte déclaration de l'objectif de l'équipe. Affichée à chaque coéquipier au lancement et écrite dans la configuration de l'équipe.
- `agent_type` (string, optionnel) : persona de sous-agent par défaut appliquée aux coéquipiers qui ne la remplacent pas. Les valeurs typiques sont `general-purpose`, `Explore` ou `Plan`.

## Exemples

### Exemple 1 : créer une équipe de refactoring

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Après la création, faites apparaître des coéquipiers avec `Agent` en utilisant `team_name: "refactor-crew"` et des valeurs `name` distinctes telles que `db-lead`, `migrations` et `tests`.

### Exemple 2 : créer une équipe d'investigation

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Chaque coéquipier généré hérite de `Explore` comme persona par défaut, ce qui correspond à la nature en lecture seule et investigative du travail.

## Notes

- Une seule équipe peut être dirigée à la fois depuis une session donnée. Terminez ou supprimez l'équipe courante avant d'en créer une autre.
- Une équipe est en relation 1:1 avec une liste de tâches partagée. Le chef possède la création, l'affectation et la clôture des tâches ; les coéquipiers mettent à jour le statut des tâches sur lesquelles ils travaillent.
- La configuration de l'équipe est persistée à `~/.claude/teams/{team_name}/config.json`, et le répertoire de tâches se trouve à côté. Ces fichiers survivent aux sessions jusqu'à leur suppression explicite avec `TeamDelete`.
- Les coéquipiers sont générés via l'outil `Agent` avec le `team_name` correspondant et un `name` distinct. Le `name` devient l'adresse utilisée par `SendMessage`.
- Choisissez un `team_name` compatible avec le système de fichiers (lettres, chiffres, tirets, underscores). Évitez les espaces ou les slashes.
- Rédigez la `description` de manière qu'un tout nouveau coéquipier, la lisant à froid, comprenne l'objectif de l'équipe sans contexte supplémentaire. Elle fait partie de l'invite de démarrage de chaque coéquipier.
