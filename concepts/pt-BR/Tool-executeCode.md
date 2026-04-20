# executeCode

Executa um trecho de código dentro de um kernel ou sandbox ao vivo fornecido por uma integração de IDE (por exemplo, o kernel Jupyter vinculado ao notebook atualmente aberto). A ferramenta está disponível apenas quando o Claude Code está rodando junto com uma ponte de IDE compatível, como a extensão do VS Code com um kernel Jupyter selecionado.

## Quando usar

- Rodar uma computação rápida, inspeção de dados ou plot contra o estado já carregado em um kernel Jupyter ativo.
- Validar um trecho de código antes de colá-lo em uma célula de notebook.
- Explorar um dataframe, variável ou modelo em memória que existe no kernel, mas não está serializado em disco.
- Produzir um gráfico ou resultado numérico que o usuário quer renderizado inline na IDE.

NÃO use para scripts autônomos que seriam melhor atendidos por `Bash` rodando `python script.py`, ou para código que precisa persistir entre um kernel novo.

## Parâmetros

- `code` (string, obrigatório): O código a executar no kernel atual. Roda como se colado em uma célula de notebook — variáveis definidas persistem no kernel até que ele seja reiniciado.
- `language` (string, opcional): A linguagem do trecho quando a ponte da IDE suporta múltiplos kernels. Mais comumente omitido; o padrão é a linguagem do kernel ativo (tipicamente Python).

## Exemplos

### Exemplo 1: Inspecionar um dataframe em memória

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Retorna as primeiras linhas, forma e dtypes das colunas de um dataframe já carregado no kernel.

### Exemplo 2: Verificação numérica rápida

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Executa um cálculo único sem criar uma célula de notebook.

## Observações

- `executeCode` é uma ferramenta de ponte de IDE. Está indisponível em sessões de terminal puro do Claude Code; só aparece quando a sessão está conectada a uma IDE que expõe um kernel (por exemplo a extensão Jupyter do VS Code).
- O estado persiste no kernel. Variáveis definidas por uma chamada `executeCode` permanecem visíveis para chamadas posteriores, para células do notebook e para o usuário — esteja atento a efeitos colaterais.
- Código de longa duração ou bloqueante bloqueará o kernel. Mantenha trechos curtos; para trabalho de vários minutos, escreva um script real e rode-o via `Bash`.
- A saída (stdout, valores de retorno, imagens) é retornada à sessão. Saídas muito grandes podem ser truncadas pela ponte da IDE.
- Para edições de arquivo, prefira `Edit`, `Write` ou `NotebookEdit` — `executeCode` não é um substituto para autoria de arquivos fonte.
