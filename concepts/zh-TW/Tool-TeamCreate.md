# TeamCreate

建立一個具有共享任務清單與代理間訊息頻道的新協作團隊。團隊是多代理工作的協調原語——主工作階段擔任領導，並透過 `Agent` 工具派生具名隊友。

## 使用時機

- 使用者明確要求團隊、swarm、crew 或多代理協作。
- 專案有多個明顯獨立的工作流，適合交給專屬角色（例如前端、後端、測試、文件）。
- 你需要由多個代理共同更新進度的持久共享任務清單。
- 你想要具名且可尋址的隊友，透過 `SendMessage` 交換訊息，而不只是一次性的子代理呼叫。

不要為了單次委派搜尋或一次性平行扇出而使用——純 `Agent` 呼叫更輕量也足夠。

## 參數

- `team_name`（string，必填）：團隊的唯一識別碼。作為 `~/.claude/teams/` 下的目錄名稱，也作為派生隊友時的 `team_name` 參數。
- `description`（string，必填）：團隊目標的簡短陳述。每位隊友派生時會看到，並寫入團隊設定。
- `agent_type`（string，選填）：套用在未覆寫此值之隊友上的預設子代理角色。常見值為 `general-purpose`、`Explore` 或 `Plan`。

## 範例

### 範例 1：建立重構團隊

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

建立後，以 `Agent` 搭配 `team_name: "refactor-crew"` 與不同的 `name` 值（例如 `db-lead`、`migrations`、`tests`）派生隊友。

### 範例 2：建立調查團隊

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

每位被派生的隊友都繼承 `Explore` 為預設角色，呼應此工作的唯讀調查性質。

## 注意事項

- 單一工作階段同時只能領導一個團隊。先結束或刪除目前的團隊，再建立另一個。
- 團隊與共享任務清單為 1:1。領導負責任務建立、指派與結案；隊友則更新自己正在進行的任務狀態。
- 團隊設定會持久化於 `~/.claude/teams/{team_name}/config.json`，而任務目錄位於其旁邊。這些檔案會跨工作階段保留，直到以 `TeamDelete` 明確移除。
- 隊友以 `Agent` 工具搭配相同 `team_name` 加上不同 `name` 派生。`name` 成為 `SendMessage` 用來尋址的位址。
- 挑選對檔案系統友善的 `team_name`（字母、數字、破折號、底線）。避免空白或斜線。
- 寫 `description` 時要假設一位全新的隊友會冷讀——他應能在無額外背景下理解團隊目標。它會成為每位隊友開機 prompt 的一部分。
