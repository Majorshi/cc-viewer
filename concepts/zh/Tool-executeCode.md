# executeCode

在 IDE 集成提供的活跃内核或沙箱中执行一段代码（例如与当前打开 notebook 绑定的 Jupyter 内核）。该工具只有在 Claude Code 与兼容的 IDE 桥（如选择了 Jupyter 内核的 VS Code 扩展）同时运行时才存在。

## 何时使用

- 针对活跃 Jupyter 内核中已加载的状态，运行一次快速计算、数据检查或绘图。
- 在粘入 notebook cell 之前验证一段代码。
- 探索存在于内核但未序列化到磁盘的内存 dataframe、变量或模型。
- 生成用户希望在 IDE 中内嵌渲染的图表或数值结果。

不要用于独立脚本——那些更适合 `Bash` 运行 `python script.py`；也不要用于需要跨新内核持久化的代码。

## 参数

- `code` (string, 必填)：要在当前内核中执行的代码。像粘进 notebook cell 一样运行——定义的变量会在内核中持久，直到重启。
- `language` (string, 可选)：当 IDE 桥支持多种内核时，代码片段的语言。通常省略；默认使用活跃内核的语言（通常是 Python）。

## 示例

### 示例 1：检查内存中的 dataframe

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

返回内核中已加载的 dataframe 的前几行、形状和列 dtype。

### 示例 2：一次性数值检查

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

在不新建 notebook cell 的前提下运行一次性计算。

## 注意事项

- `executeCode` 是 IDE 桥工具。在 Claude Code 的纯终端会话中不可用；它只在会话连接到暴露内核的 IDE（例如 VS Code Jupyter 扩展）时出现。
- 状态在内核中持久。一次 `executeCode` 调用定义的变量对后续调用、notebook cell 及用户都可见——当心副作用。
- 长时间运行或阻塞的代码会阻塞内核。片段应保持简短；多分钟工作请写成真正的脚本并通过 `Bash` 运行。
- 输出（stdout、返回值、图像）会回传到会话。非常大的输出可能被 IDE 桥截断。
- 文件编辑请优先使用 `Edit`、`Write` 或 `NotebookEdit`——`executeCode` 不是撰写源文件的替代品。
