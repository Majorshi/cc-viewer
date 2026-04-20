# getDiagnostics

Récupère les diagnostics (erreurs, avertissements, indices) du serveur de langage depuis l'IDE connecté pour un fichier spécifique ou pour tous les fichiers que l'IDE a actuellement ouverts. Utilisé pour vérifier que les modifications de code compilent proprement avant de déclarer une tâche terminée.

## Quand l'utiliser

- Après un `Edit` ou un `Write` pour confirmer que le changement n'a pas introduit d'erreur de type, d'erreur de syntaxe ou d'avertissement de lint.
- Avant de terminer une tâche pour balayer chaque fichier ouvert à la recherche de problèmes non résolus.
- Lors du diagnostic d'une erreur signalée par l'utilisateur — récupérer le message exact du compilateur ou du vérificateur de types de l'IDE évite de deviner.
- Comme alternative légère à l'exécution d'un build complet ou d'une commande de test lorsque vous n'avez besoin que de vérifier la correction statique.

Ne comptez PAS sur `getDiagnostics` comme remplacement de la suite de tests. Il rapporte ce que le serveur de langage voit, pas ce qui s'exécute en test ou en production.

## Paramètres

- `uri` (string, optionnel) : l'URI du fichier (typiquement `file:///absolute/path`) dont récupérer les diagnostics. Lorsqu'omis, l'outil renvoie les diagnostics pour chaque fichier que l'IDE a actuellement ouvert.

## Exemples

### Exemple 1 : vérifier un seul fichier après édition

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Renvoie toute erreur TypeScript, avertissement ESLint ou autre message de serveur de langage pour `src/auth.ts`.

### Exemple 2 : balayer tous les fichiers ouverts

```
getDiagnostics()
```

Renvoie les diagnostics sur chaque éditeur actuellement ouvert. Utile à la fin d'un refactoring multi-fichiers pour s'assurer que rien n'a régressé ailleurs.

## Notes

- `getDiagnostics` est un outil de pont IDE. Il n'est disponible que lorsque Claude Code est connecté à une intégration IDE compatible (par exemple l'extension VS Code). Dans une session de terminal classique, l'outil n'apparaîtra pas.
- Les résultats reflètent les serveurs de langage que l'IDE a chargés — TypeScript, Pyright, ESLint, rust-analyzer, etc. La qualité et la couverture dépendent de la configuration de l'IDE de l'utilisateur, pas de Claude Code.
- Les diagnostics sont en direct. Après une modification, laissez au serveur de langage un moment pour réanalyser avant d'interpréter un résultat vide comme un succès — relancez si le fichier vient d'être enregistré.
- Les niveaux de sévérité incluent typiquement `error`, `warning`, `information` et `hint`. Concentrez-vous d'abord sur `error` ; les avertissements peuvent être du style de projet intentionnel.
- Pour les fichiers non ouverts dans l'IDE, le serveur de langage peut n'avoir aucun diagnostic à rapporter même si le fichier contient de vrais problèmes. Ouvrez le fichier ou exécutez le build pour une couverture faisant autorité.
