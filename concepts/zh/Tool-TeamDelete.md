# TeamDelete

拆解当前活跃团队，移除其配置目录和共享任务目录。这是 `TeamCreate` 的清理对偶，通常在团队目标达成且所有队友已关停后调用。

## 何时使用

- 团队已完成工作，最终报告已交付给用户。
- 团队创建有误，或其范围变化巨大以至于重新开始比继续更清爽。
- 你需要创建新团队，但已有一个活跃团队——先删除旧的，因为同一时间只能领一个团队。
- 团队已跨会话陈旧，`~/.claude/teams/` 下其持久化状态不再需要。

当队友仍在运行时，不要调用——先通过 `SendMessage` 发送 `shutdown_request`，等待每个 `shutdown_response`，再删除。

## 参数

`TeamDelete` 在典型用法下不接受任何参数。它作用于调用会话所拥有的当前活跃团队。

## 示例

### 示例 1：成功后的例行关停

1. 向团队广播 shutdown request：
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. 等待每个队友以 `shutdown_response` 回复。
3. 调用 `TeamDelete()` 移除团队目录与任务目录。

### 示例 2：替换误配置的团队

若 `TeamCreate` 传入了错误的 `agent_type` 或 `description`，请先确认尚未派生队友（或先关停它们），然后：

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## 注意事项

- 若仍有队友活跃，`TeamDelete` 会失败。错误响应会列出活跃队友——通过 `SendMessage` 向每个队友发送 `shutdown_request`，等待其 `shutdown_response`，然后重试。
- 从工具视角看删除不可逆。团队的配置 `~/.claude/teams/{team_name}/config.json` 及其任务目录将从磁盘移除。如需保留任务列表，请在删除前导出或复制该目录。
- 只有创建团队的负责人会话才能删除它。被派生的队友不能对自己的团队调用 `TeamDelete`。
- 删除团队不会回滚队友在仓库中所做的文件系统改动。那些是普通的 git 跟踪编辑，如果不想保留必须另外回退。
- 在 `TeamDelete` 成功返回后，会话可自由再次调用 `TeamCreate` 以新建团队。
