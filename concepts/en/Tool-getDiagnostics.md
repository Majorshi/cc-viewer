# getDiagnostics

Retrieves language-server diagnostics (errors, warnings, hints) from the connected IDE for a specific file or for every file the IDE currently has open. Used to verify that code changes compile cleanly before declaring a task done.

## When to Use

- After an `Edit` or `Write` to confirm the change did not introduce a type error, syntax error, or lint warning.
- Before ending a task to sweep every open file for unresolved problems.
- When diagnosing an error the user reports — pulling the exact compiler or type-checker message from the IDE avoids guessing.
- As a lightweight alternative to running a full build or test command when you only need to check static correctness.

Do NOT rely on `getDiagnostics` as a replacement for the test suite. It reports what the language server sees, not what runs at test or production time.

## Parameters

- `uri` (string, optional): The file URI (typically `file:///absolute/path`) to fetch diagnostics for. When omitted, the tool returns diagnostics for every file the IDE currently has open.

## Examples

### Example 1: Check a single file after editing

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Returns any TypeScript errors, ESLint warnings, or other language-server messages for `src/auth.ts`.

### Example 2: Sweep all open files

```
getDiagnostics()
```

Returns diagnostics across every currently open editor. Useful at the end of a multi-file refactor to ensure nothing regressed elsewhere.

## Notes

- `getDiagnostics` is an IDE-bridge tool. It is only available when Claude Code is connected to a supporting IDE integration (for example the VS Code extension). In a plain terminal session the tool will not appear.
- The results reflect whatever language servers the IDE has loaded — TypeScript, Pyright, ESLint, rust-analyzer, etc. Quality and coverage depend on the user's IDE setup, not on Claude Code.
- Diagnostics are live. After an edit, give the language server a moment to re-analyze before interpreting an empty result as success — re-run if the file was just saved.
- Severity levels typically include `error`, `warning`, `information`, and `hint`. Focus on `error` first; warnings may be intentional project style.
- For files not currently open in the IDE, the language server may have no diagnostics to report even if the file contains real issues. Open the file or run the build for authoritative coverage.
