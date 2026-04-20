# getDiagnostics

Recupera diagnósticos del servidor de lenguaje (errores, advertencias, pistas) desde el IDE conectado para un archivo específico o para todos los archivos que el IDE tiene abiertos actualmente. Se usa para verificar que los cambios de código compilan limpiamente antes de declarar una tarea terminada.

## Cuándo usar

- Tras un `Edit` o `Write` para confirmar que el cambio no introdujo un error de tipo, error de sintaxis o advertencia de lint.
- Antes de finalizar una tarea para barrer cada archivo abierto en busca de problemas sin resolver.
- Al diagnosticar un error que reporta el usuario — extraer el mensaje exacto del compilador o verificador de tipos desde el IDE evita adivinar.
- Como alternativa ligera a ejecutar un build o suite de pruebas completos cuando solo necesitas comprobar la corrección estática.

NO dependas de `getDiagnostics` como reemplazo de la suite de pruebas. Reporta lo que el servidor de lenguaje ve, no lo que se ejecuta en tiempo de prueba o producción.

## Parámetros

- `uri` (string, opcional): La URI del archivo (típicamente `file:///absolute/path`) para la que obtener diagnósticos. Cuando se omite, la herramienta devuelve diagnósticos para cada archivo que el IDE tiene abierto actualmente.

## Ejemplos

### Ejemplo 1: Comprobar un solo archivo tras editar

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Devuelve cualquier error de TypeScript, advertencia de ESLint u otros mensajes del servidor de lenguaje para `src/auth.ts`.

### Ejemplo 2: Barrer todos los archivos abiertos

```
getDiagnostics()
```

Devuelve diagnósticos de cada editor abierto actualmente. Útil al final de un refactor de varios archivos para asegurar que nada ha regresionado en otro lugar.

## Notas

- `getDiagnostics` es una herramienta de puente de IDE. Solo está disponible cuando Claude Code está conectado a una integración de IDE compatible (por ejemplo la extensión de VS Code). En una sesión de terminal plano la herramienta no aparecerá.
- Los resultados reflejan los servidores de lenguaje que el IDE haya cargado — TypeScript, Pyright, ESLint, rust-analyzer, etc. La calidad y cobertura dependen de la configuración del IDE del usuario, no de Claude Code.
- Los diagnósticos son en vivo. Tras una edición, da al servidor de lenguaje un momento para re-analizar antes de interpretar un resultado vacío como éxito — vuelve a ejecutar si el archivo se acaba de guardar.
- Los niveles de severidad típicamente incluyen `error`, `warning`, `information` y `hint`. Enfócate primero en `error`; las advertencias pueden ser estilo intencional del proyecto.
- Para archivos que no están abiertos actualmente en el IDE, el servidor de lenguaje puede no tener diagnósticos que reportar incluso si el archivo contiene problemas reales. Abre el archivo o ejecuta el build para una cobertura autoritativa.
