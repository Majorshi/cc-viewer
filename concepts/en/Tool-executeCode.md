# executeCode

Executes a snippet of code inside a live kernel or sandbox supplied by an IDE integration (for example the Jupyter kernel bound to the currently open notebook). The tool is only present when Claude Code is running alongside a compatible IDE bridge such as the VS Code extension with a Jupyter kernel selected.

## When to Use

- Running a quick computation, data inspection, or plot against the state already loaded in an active Jupyter kernel.
- Validating a snippet of code before pasting it into a notebook cell.
- Exploring an in-memory dataframe, variable, or model that exists in the kernel but is not serialized to disk.
- Producing a chart or numeric result that the user wants rendered inline in the IDE.

Do NOT use for standalone scripts that would be better served by `Bash` running `python script.py`, or for code that needs to persist across a fresh kernel.

## Parameters

- `code` (string, required): The code to execute in the current kernel. Runs as if pasted into a notebook cell — variables defined persist in the kernel until it is restarted.
- `language` (string, optional): The language of the snippet when the IDE bridge supports multiple kernels. Most commonly omitted; defaults to the language of the active kernel (typically Python).

## Examples

### Example 1: Inspect an in-memory dataframe

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Returns the first rows, shape, and column dtypes of a dataframe already loaded in the kernel.

### Example 2: Quick numeric check

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Runs a one-off calculation without creating a notebook cell.

## Notes

- `executeCode` is an IDE-bridge tool. It is unavailable in plain terminal sessions of Claude Code; it only appears when the session is connected to an IDE that exposes a kernel (for example the VS Code Jupyter extension).
- State persists in the kernel. Variables defined by one `executeCode` call remain visible to later calls, to notebook cells, and to the user — be mindful of side effects.
- Long-running or blocking code will block the kernel. Keep snippets short; for multi-minute work, write an actual script and run it via `Bash`.
- Output (stdout, return values, images) is returned to the session. Very large outputs may be truncated by the IDE bridge.
- For file edits, prefer `Edit`, `Write`, or `NotebookEdit` — `executeCode` is not a substitute for authoring source files.
