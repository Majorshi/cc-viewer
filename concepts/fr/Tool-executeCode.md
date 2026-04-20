# executeCode

Exécute un extrait de code dans un noyau ou un sandbox en direct fourni par une intégration IDE (par exemple le noyau Jupyter lié au notebook actuellement ouvert). L'outil n'est présent que lorsque Claude Code fonctionne aux côtés d'un pont IDE compatible tel que l'extension VS Code avec un noyau Jupyter sélectionné.

## Quand l'utiliser

- Exécuter un calcul rapide, une inspection de données ou un tracé sur l'état déjà chargé dans un noyau Jupyter actif.
- Valider un extrait de code avant de le coller dans une cellule de notebook.
- Explorer un dataframe, une variable ou un modèle en mémoire qui existe dans le noyau mais n'est pas sérialisé sur disque.
- Produire un graphique ou un résultat numérique que l'utilisateur veut voir rendu inline dans l'IDE.

N'utilisez PAS pour des scripts autonomes qui seraient mieux servis par `Bash` exécutant `python script.py`, ou pour du code qui doit persister à travers un noyau neuf.

## Paramètres

- `code` (string, requis) : le code à exécuter dans le noyau courant. S'exécute comme s'il était collé dans une cellule de notebook — les variables définies persistent dans le noyau jusqu'à son redémarrage.
- `language` (string, optionnel) : le langage de l'extrait lorsque le pont IDE prend en charge plusieurs noyaux. Le plus souvent omis ; par défaut le langage du noyau actif (généralement Python).

## Exemples

### Exemple 1 : inspecter un dataframe en mémoire

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Renvoie les premières lignes, la forme et les dtypes de colonnes d'un dataframe déjà chargé dans le noyau.

### Exemple 2 : vérification numérique rapide

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Effectue un calcul ponctuel sans créer de cellule de notebook.

## Notes

- `executeCode` est un outil de pont IDE. Il est indisponible dans les sessions de terminal classiques de Claude Code ; il n'apparaît que lorsque la session est connectée à un IDE qui expose un noyau (par exemple l'extension Jupyter de VS Code).
- L'état persiste dans le noyau. Les variables définies par un appel `executeCode` restent visibles pour les appels ultérieurs, les cellules de notebook et l'utilisateur — attention aux effets de bord.
- Le code de longue durée ou bloquant bloquera le noyau. Gardez les extraits courts ; pour un travail de plusieurs minutes, écrivez un véritable script et exécutez-le via `Bash`.
- La sortie (sortie standard, valeurs de retour, images) est renvoyée à la session. Les très grandes sorties peuvent être tronquées par le pont IDE.
- Pour les modifications de fichiers, préférez `Edit`, `Write` ou `NotebookEdit` — `executeCode` n'est pas un substitut à la création de fichiers source.
