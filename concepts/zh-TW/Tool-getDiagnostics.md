# getDiagnostics

從已連接的 IDE 擷取語言伺服器診斷（錯誤、警告、提示），可針對特定檔案或 IDE 目前開啟的所有檔案。用它在宣告任務完成之前確認程式碼變更能乾淨地編譯。

## 使用時機

- 在 `Edit` 或 `Write` 之後，確認變更未引入型別錯誤、語法錯誤或 lint 警告。
- 在結束任務前掃過每個開啟的檔案，清查未解的問題。
- 診斷使用者回報的錯誤時——從 IDE 中取得確切的編譯器或型別檢查訊息可避免臆測。
- 只需檢查靜態正確性時，作為跑完整建構或測試指令的輕量替代。

不要把 `getDiagnostics` 當成測試套件的替代品。它只回報語言伺服器所見，而不是測試或正式環境中實際執行的行為。

## 參數

- `uri`（string，選填）：要擷取診斷的檔案 URI（通常為 `file:///absolute/path`）。省略時會回傳 IDE 目前開啟的每個檔案的診斷。

## 範例

### 範例 1：編輯後檢查單一檔案

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

回傳 `src/auth.ts` 的任何 TypeScript 錯誤、ESLint 警告或其他語言伺服器訊息。

### 範例 2：掃過所有開啟的檔案

```
getDiagnostics()
```

回傳每個目前開啟編輯器的診斷。在多檔重構結束時很有用，可確保其他地方沒有退步。

## 注意事項

- `getDiagnostics` 是 IDE bridge 工具。只有在 Claude Code 連接到支援的 IDE 整合（例如 VS Code 擴充套件）時才可用。在純終端工作階段中，此工具不會出現。
- 結果反映 IDE 所載入的語言伺服器——TypeScript、Pyright、ESLint、rust-analyzer 等。品質與覆蓋範圍取決於使用者的 IDE 設定，而非 Claude Code。
- 診斷是即時的。在編輯之後，請給語言伺服器一點時間重新分析，再把空結果解讀為成功——若檔案剛存檔，可重新執行一次。
- 嚴重程度通常包含 `error`、`warning`、`information` 與 `hint`。先處理 `error`；warning 可能是專案刻意的風格。
- 對於目前未在 IDE 中開啟的檔案，即使實際有問題，語言伺服器也可能沒有診斷可回報。請開啟檔案，或以建構流程取得權威涵蓋範圍。
