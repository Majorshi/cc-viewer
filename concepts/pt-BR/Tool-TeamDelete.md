# TeamDelete

Desmonta a equipe atualmente ativa, removendo seu diretório de configuração e diretório de tarefas compartilhadas. Esta é a contraparte de limpeza para `TeamCreate` e é tipicamente chamada depois que o objetivo da equipe foi alcançado e todos os colegas foram encerrados.

## Quando usar

- A equipe concluiu seu trabalho e o relatório final foi entregue ao usuário.
- A equipe foi criada por engano ou seu escopo mudou tão drasticamente que começar do zero é mais limpo do que continuar.
- Você precisa criar uma nova equipe, mas uma já está ativa — exclua a antiga primeiro, já que apenas uma equipe pode ser liderada por vez.
- Uma equipe ficou obsoleta entre sessões e seu estado persistido sob `~/.claude/teams/` não é mais necessário.

NÃO chame enquanto colegas de equipe ainda estão rodando — desligue-os primeiro via `SendMessage` com um `shutdown_request`, espere cada `shutdown_response` e então exclua.

## Parâmetros

`TeamDelete` não recebe parâmetros em sua invocação típica. Opera sobre a equipe atualmente ativa de propriedade da sessão que chama.

## Exemplos

### Exemplo 1: Encerramento rotineiro após sucesso

1. Faça broadcast de um pedido de encerramento para a equipe:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Espere cada colega responder com um `shutdown_response`.
3. Chame `TeamDelete()` para remover o diretório da equipe e o diretório de tarefas.

### Exemplo 2: Substituindo uma equipe mal configurada

Se `TeamCreate` foi chamado com o `agent_type` ou `description` errados, primeiro garanta que nenhum colega foi disparado ainda (ou desligue-os), então:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Observações

- `TeamDelete` falha se qualquer colega ainda estiver ativo. A resposta de erro lista os colegas ativos — envie a cada um um `shutdown_request` via `SendMessage`, aguarde o `shutdown_response` e tente novamente.
- A exclusão é irreversível do ponto de vista da ferramenta. A configuração da equipe em `~/.claude/teams/{team_name}/config.json` e seu diretório de tarefas são removidos do disco. Se precisar preservar a lista de tarefas, exporte ou copie o diretório antes de excluir.
- Apenas a sessão líder que criou a equipe pode excluí-la. Um colega disparado não pode chamar `TeamDelete` em sua própria equipe.
- Excluir a equipe não reverte quaisquer mudanças de sistema de arquivos que os colegas fizeram no repositório. Essas são edições comuns rastreadas pelo git e devem ser revertidas separadamente se indesejadas.
- Depois que `TeamDelete` retorna com sucesso, a sessão está livre para chamar `TeamCreate` novamente para uma nova equipe.
