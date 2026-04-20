# TeamCreate

Estabelece uma nova equipe de colaboração com uma lista de tarefas compartilhada e canal de mensagens entre agentes. Uma equipe é a primitiva de coordenação para trabalho multiagente — a sessão principal atua como líder e dispara colegas nomeados via a ferramenta `Agent`.

## Quando usar

- O usuário solicita explicitamente uma equipe, swarm, crew ou colaboração multiagente.
- Um projeto tem vários fluxos de trabalho claramente independentes que se beneficiam de especialistas dedicados (por exemplo frontend, backend, testes, docs).
- Você precisa de uma lista de tarefas compartilhada persistente que múltiplos agentes atualizam conforme progridem.
- Você quer colegas nomeados e endereçáveis que podem trocar mensagens via `SendMessage` em vez de chamadas de subagente únicas.

NÃO use para uma única busca delegada ou um fan-out paralelo único — chamadas simples de `Agent` são mais leves e suficientes.

## Parâmetros

- `team_name` (string, obrigatório): Identificador único para a equipe. Usado como nome do diretório sob `~/.claude/teams/` e como argumento `team_name` ao disparar colegas.
- `description` (string, obrigatório): Declaração curta do objetivo da equipe. Mostrada a cada colega no spawn e escrita na configuração da equipe.
- `agent_type` (string, opcional): Persona de subagente padrão aplicada aos colegas que não a sobrescrevem. Valores típicos são `general-purpose`, `Explore` ou `Plan`.

## Exemplos

### Exemplo 1: Criar uma equipe de refatoração

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

Após a criação, dispare colegas com `Agent` usando `team_name: "refactor-crew"` e valores distintos de `name` como `db-lead`, `migrations` e `tests`.

### Exemplo 2: Criar uma equipe de investigação

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

Cada colega disparado herda `Explore` como persona padrão, combinando com a natureza investigativa e somente leitura do trabalho.

## Observações

- Apenas uma equipe pode ser liderada por vez em uma dada sessão. Finalize ou exclua a equipe atual antes de criar outra.
- Uma equipe tem relação 1:1 com uma lista de tarefas compartilhada. O líder é dono da criação, atribuição e fechamento de tarefas; colegas atualizam o status das tarefas em que estão trabalhando.
- A configuração da equipe é persistida em `~/.claude/teams/{team_name}/config.json`, e o diretório de tarefas fica junto. Esses arquivos sobrevivem entre sessões até serem explicitamente removidos com `TeamDelete`.
- Colegas são disparados usando a ferramenta `Agent` com `team_name` correspondente mais um `name` distinto. O `name` torna-se o endereço usado por `SendMessage`.
- Escolha um `team_name` que seja seguro para sistema de arquivos (letras, dígitos, hífens, underscores). Evite espaços ou barras.
- Escreva a `description` para que um colega totalmente novo, lendo-a do zero, entenda o objetivo da equipe sem mais contexto. Ela se torna parte do prompt de inicialização de cada colega.
