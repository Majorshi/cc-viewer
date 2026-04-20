# getDiagnostics

Recupera diagnósticos do language server (erros, warnings, dicas) da IDE conectada para um arquivo específico ou para cada arquivo que a IDE tem atualmente aberto. Usado para verificar que as mudanças de código compilam limpas antes de declarar uma tarefa concluída.

## Quando usar

- Após um `Edit` ou `Write` para confirmar que a mudança não introduziu um erro de tipo, erro de sintaxe ou warning de lint.
- Antes de finalizar uma tarefa, para varrer cada arquivo aberto em busca de problemas não resolvidos.
- Ao diagnosticar um erro que o usuário reporta — extrair a mensagem exata do compilador ou type-checker da IDE evita adivinhação.
- Como uma alternativa leve a rodar um build ou comando de teste completo quando você só precisa verificar correção estática.

NÃO confie em `getDiagnostics` como substituto para a suíte de testes. Ele reporta o que o language server vê, não o que roda em tempo de teste ou produção.

## Parâmetros

- `uri` (string, opcional): A URI do arquivo (tipicamente `file:///absolute/path`) para buscar diagnósticos. Quando omitido, a ferramenta retorna diagnósticos para cada arquivo que a IDE tem atualmente aberto.

## Exemplos

### Exemplo 1: Verificar um único arquivo após editar

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Retorna quaisquer erros TypeScript, warnings ESLint ou outras mensagens do language server para `src/auth.ts`.

### Exemplo 2: Varrer todos os arquivos abertos

```
getDiagnostics()
```

Retorna diagnósticos em cada editor atualmente aberto. Útil ao final de uma refatoração multi-arquivo para garantir que nada regrediu em outro lugar.

## Observações

- `getDiagnostics` é uma ferramenta de ponte de IDE. Está disponível apenas quando o Claude Code está conectado a uma integração de IDE suportada (por exemplo a extensão do VS Code). Em uma sessão de terminal puro, a ferramenta não aparecerá.
- Os resultados refletem quaisquer language servers que a IDE tenha carregado — TypeScript, Pyright, ESLint, rust-analyzer etc. Qualidade e cobertura dependem da configuração da IDE do usuário, não do Claude Code.
- Os diagnósticos são ao vivo. Após uma edição, dê ao language server um momento para reanalisar antes de interpretar um resultado vazio como sucesso — rode de novo se o arquivo acabou de ser salvo.
- Os níveis de severidade tipicamente incluem `error`, `warning`, `information` e `hint`. Foque em `error` primeiro; warnings podem ser estilo intencional do projeto.
- Para arquivos que não estão abertos atualmente na IDE, o language server pode não ter diagnósticos a reportar mesmo que o arquivo contenha problemas reais. Abra o arquivo ou rode o build para cobertura autorizada.
