# TeamDelete

拆除目前作用中的團隊，移除其設定目錄與共享任務目錄。這是 `TeamCreate` 的清理對應工具，通常在團隊目標達成且所有隊友關閉後呼叫。

## 使用時機

- 團隊已完成工作，最終報告已交給使用者。
- 團隊是誤建，或其範圍劇烈改變，重新開始比繼續更乾淨。
- 你需要建立新團隊，但已有一個作用中的團隊——先刪除舊的，因為一次只能領導一個團隊。
- 團隊跨工作階段後變得陳舊，`~/.claude/teams/` 下的持久狀態已不再需要。

不要在隊友仍在執行時呼叫——先透過 `SendMessage` 發送 `shutdown_request` 關閉他們，等每個 `shutdown_response` 收到後再刪除。

## 參數

`TeamDelete` 在典型呼叫中不接受任何參數。它作用於呼叫工作階段所擁有、當前作用中的團隊。

## 範例

### 範例 1：成功後的例行關閉

1. 向團隊廣播關閉請求：
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. 等每位隊友回覆 `shutdown_response`。
3. 呼叫 `TeamDelete()` 以移除團隊目錄與任務目錄。

### 範例 2：替換設定錯誤的團隊

若 `TeamCreate` 以錯誤的 `agent_type` 或 `description` 被呼叫，先確認尚未派生任何隊友（或已將其關閉），然後：

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## 注意事項

- 若仍有隊友在執行，`TeamDelete` 會失敗。錯誤回應會列出在線的隊友——透過 `SendMessage` 傳送 `shutdown_request` 給每個，等候他們的 `shutdown_response`，然後重試。
- 從工具的角度看，刪除是不可逆的。團隊位於 `~/.claude/teams/{team_name}/config.json` 的設定與其任務目錄會從磁碟移除。若需保留任務清單，請在刪除前匯出或複製該目錄。
- 只有建立團隊的領導工作階段可以刪除它。被派生的隊友無法對自己團隊呼叫 `TeamDelete`。
- 刪除團隊不會回溯隊友在 repo 中所做的任何檔案系統變更。那些是一般 git 追蹤的編輯，若不需要必須另行還原。
- `TeamDelete` 成功回傳後，該工作階段可再次呼叫 `TeamCreate` 以建立新團隊。
