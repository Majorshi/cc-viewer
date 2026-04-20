# TeamCreate

建立一个新的协作团队，带有共享任务列表和代理间消息通道。团队是多代理工作的协调原语——主会话担任负责人，并通过 `Agent` 工具派生具名队友。

## 何时使用

- 用户明确请求团队、swarm、crew 或多代理协作。
- 项目包含若干明显独立的工作流，受益于专属专家（例如前端、后端、测试、文档）。
- 你需要一份持久的共享任务列表，供多个代理在推进工作时更新。
- 你希望队友具名且可寻址，能通过 `SendMessage` 交换消息，而不是一次性的子代理调用。

对于单次委派搜索或一次性并行扇出，不要使用——普通 `Agent` 调用更轻也足够。

## 参数

- `team_name` (string, 必填)：团队的唯一标识符。用作 `~/.claude/teams/` 下的目录名，以及派生队友时的 `team_name` 参数。
- `description` (string, 必填)：对团队目标的简短陈述。派生时展示给每个队友，并写入团队配置。
- `agent_type` (string, 可选)：应用于未覆盖的队友的默认子代理角色。典型值为 `general-purpose`、`Explore` 或 `Plan`。

## 示例

### 示例 1：创建重构团队

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

创建后，以 `team_name: "refactor-crew"` 及不同的 `name` 值（如 `db-lead`、`migrations`、`tests`）用 `Agent` 派生队友。

### 示例 2：创建调查团队

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

每个被派生的队友继承 `Explore` 作为默认角色，契合这份工作只读调研的性质。

## 注意事项

- 同一会话同一时间只能领一个团队。创建另一个团队前请先结束或删除当前团队。
- 团队与共享任务列表 1:1。负责人拥有任务的创建、指派和关闭权；队友更新自己正在处理的任务状态。
- 团队配置持久化在 `~/.claude/teams/{team_name}/config.json`，任务目录与之并列。这些文件跨会话保留，直到使用 `TeamDelete` 显式清除。
- 队友通过 `Agent` 工具以匹配的 `team_name` 加上独有的 `name` 派生。`name` 就是 `SendMessage` 使用的地址。
- 选择文件系统安全的 `team_name`（字母、数字、短横线、下划线）。避免空格或斜杠。
- 撰写 `description` 时要让崭新的队友在没有额外上下文下读完也能理解团队目标。它会成为每个队友启动提示的一部分。
