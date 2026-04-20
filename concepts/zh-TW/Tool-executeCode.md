# executeCode

在由 IDE 整合提供的活動 kernel 或 sandbox 中執行程式碼片段（例如目前開啟的 notebook 所綁定的 Jupyter kernel）。此工具只在 Claude Code 與相容的 IDE bridge 一起執行時才存在，例如選取了 Jupyter kernel 的 VS Code 擴充套件。

## 使用時機

- 對運作中的 Jupyter kernel 上已載入的狀態執行快速計算、資料檢查或繪圖。
- 在把某段程式碼貼進 notebook cell 之前驗證它。
- 探索存在於 kernel、但尚未序列化至磁碟的 in-memory dataframe、變數或模型。
- 產生圖表或數值結果，讓使用者可在 IDE 中內嵌檢視。

不要用於獨立指令稿——那更適合透過 `Bash` 執行 `python script.py`——也不要用於需要在新 kernel 中持續存在的程式碼。

## 參數

- `code`（string，必填）：要在目前 kernel 中執行的程式碼。執行效果如同貼到一個 notebook cell；定義的變數會保留在 kernel 中，直到 kernel 重新啟動。
- `language`（string，選填）：當 IDE bridge 支援多個 kernel 時的片段語言。多數情況下省略；預設為作用中 kernel 的語言（通常為 Python）。

## 範例

### 範例 1：檢視 in-memory dataframe

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

回傳已載入 kernel 的 dataframe 的前幾列、形狀與欄位 dtype。

### 範例 2：快速數值檢查

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

執行一次性計算，不建立 notebook cell。

## 注意事項

- `executeCode` 是 IDE bridge 工具。在 Claude Code 的純終端工作階段中無法使用；只有在工作階段連接到提供 kernel 的 IDE（例如 VS Code Jupyter 擴充套件）時才會出現。
- 狀態會在 kernel 中保留。某次 `executeCode` 呼叫所定義的變數對後續呼叫、notebook cell 與使用者都可見——請注意副作用。
- 長時間或阻塞的程式碼會阻塞 kernel。保持片段短小；對於耗時數分鐘的工作，請撰寫實際的指令稿並透過 `Bash` 執行。
- 輸出（stdout、回傳值、圖片）會回傳給工作階段。非常大的輸出可能被 IDE bridge 截斷。
- 對於檔案編輯，優先使用 `Edit`、`Write` 或 `NotebookEdit`——`executeCode` 不是撰寫原始檔的替代方案。
