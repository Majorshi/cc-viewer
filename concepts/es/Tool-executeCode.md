# executeCode

Ejecuta un fragmento de código dentro de un kernel o sandbox en vivo proporcionado por una integración de IDE (por ejemplo el kernel de Jupyter vinculado al notebook abierto actualmente). La herramienta solo está presente cuando Claude Code se ejecuta junto con un puente de IDE compatible como la extensión de VS Code con un kernel de Jupyter seleccionado.

## Cuándo usar

- Ejecutar un cálculo rápido, inspección de datos o gráfico contra el estado ya cargado en un kernel activo de Jupyter.
- Validar un fragmento de código antes de pegarlo en una celda de notebook.
- Explorar un dataframe, variable o modelo en memoria que existe en el kernel pero no está serializado a disco.
- Producir un gráfico o resultado numérico que el usuario quiere renderizado en línea en el IDE.

NO uses esto para scripts independientes que se atenderían mejor con `Bash` ejecutando `python script.py`, o para código que necesita persistir entre un kernel fresco.

## Parámetros

- `code` (string, obligatorio): El código a ejecutar en el kernel actual. Se ejecuta como si se pegara en una celda de notebook — las variables definidas persisten en el kernel hasta que se reinicie.
- `language` (string, opcional): El lenguaje del fragmento cuando el puente del IDE soporta múltiples kernels. Lo más común es omitirlo; por defecto es el lenguaje del kernel activo (típicamente Python).

## Ejemplos

### Ejemplo 1: Inspeccionar un dataframe en memoria

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Devuelve las primeras filas, la forma y los dtypes de columna de un dataframe ya cargado en el kernel.

### Ejemplo 2: Comprobación numérica rápida

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Ejecuta un cálculo puntual sin crear una celda de notebook.

## Notas

- `executeCode` es una herramienta de puente de IDE. No está disponible en sesiones de terminal plano de Claude Code; solo aparece cuando la sesión está conectada a un IDE que expone un kernel (por ejemplo la extensión Jupyter de VS Code).
- El estado persiste en el kernel. Las variables definidas por una llamada `executeCode` permanecen visibles para llamadas posteriores, para celdas de notebook y para el usuario — ten en cuenta los efectos secundarios.
- El código de larga duración o bloqueante bloqueará el kernel. Mantén los fragmentos cortos; para trabajo de varios minutos, escribe un script real y ejecútalo vía `Bash`.
- La salida (stdout, valores de retorno, imágenes) se devuelve a la sesión. Las salidas muy grandes pueden ser truncadas por el puente del IDE.
- Para ediciones de archivos, prefiere `Edit`, `Write` o `NotebookEdit` — `executeCode` no sustituye a la autoría de archivos fuente.
