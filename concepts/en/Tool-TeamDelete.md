# TeamDelete

Tears down the currently active team, removing its configuration directory and shared task directory. This is the cleanup counterpart to `TeamCreate` and is typically called after the team's objective has been achieved and all teammates have shut down.

## When to Use

- The team has completed its work and the final report has been delivered to the user.
- The team was created in error or its scope has changed so drastically that starting fresh is cleaner than continuing.
- You need to create a new team but one is already active — delete the old one first, since only one team can be led at a time.
- A team has become stale across sessions and its persisted state under `~/.claude/teams/` is no longer needed.

Do NOT call while teammates are still running — shut them down first via `SendMessage` with a `shutdown_request`, wait for every `shutdown_response`, then delete.

## Parameters

`TeamDelete` takes no parameters in its typical invocation. It operates on the currently active team owned by the calling session.

## Examples

### Example 1: Routine shutdown after success

1. Broadcast a shutdown request to the team:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Wait for each teammate to reply with a `shutdown_response`.
3. Call `TeamDelete()` to remove the team directory and task directory.

### Example 2: Replacing a misconfigured team

If `TeamCreate` was called with the wrong `agent_type` or `description`, first ensure no teammates have been spawned yet (or shut them down), then:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Notes

- `TeamDelete` fails if any teammate is still active. The error response lists the live teammates — send each one a `shutdown_request` via `SendMessage`, await their `shutdown_response`, and retry.
- Deletion is irreversible from the tool's perspective. The team's config at `~/.claude/teams/{team_name}/config.json` and its task directory are removed from disk. If you need the task list preserved, export or copy the directory before deleting.
- Only the leader session that created the team can delete it. A spawned teammate cannot call `TeamDelete` on its own team.
- Deleting the team does not roll back any filesystem changes that teammates made in the repository. Those are ordinary git-tracked edits and must be reverted separately if unwanted.
- After `TeamDelete` returns successfully, the session is free to call `TeamCreate` again for a new team.
