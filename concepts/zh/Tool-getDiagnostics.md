# getDiagnostics

从连接的 IDE 获取特定文件或当前所有打开文件的语言服务诊断（错误、警告、提示）。用于在宣告任务完成前验证代码改动是否干净编译。

## 何时使用

- 在 `Edit` 或 `Write` 之后，确认改动没有引入类型错误、语法错误或 lint 警告。
- 在结束任务之前，扫视每个打开文件是否存在未解决的问题。
- 在诊断用户报告的错误时——从 IDE 直接拉取编译器或类型检查器的精确消息，避免凭空猜测。
- 当你只需检查静态正确性时，可作为运行完整构建或测试命令的轻量替代。

不要把 `getDiagnostics` 当作测试套件的替代。它报告语言服务所见，并不等于测试或生产时运行的结果。

## 参数

- `uri` (string, 可选)：要获取诊断的文件 URI（通常为 `file:///absolute/path`）。省略时，工具返回 IDE 当前打开的每个文件的诊断。

## 示例

### 示例 1：编辑后检查单个文件

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

返回 `src/auth.ts` 的任何 TypeScript 错误、ESLint 警告或其他语言服务消息。

### 示例 2：扫视所有打开文件

```
getDiagnostics()
```

返回每个当前打开编辑器的诊断。多文件重构结束时很有用，可确保别处未出现回退。

## 注意事项

- `getDiagnostics` 是 IDE 桥工具。它仅在 Claude Code 连接到受支持的 IDE 集成（例如 VS Code 扩展）时可用。在纯终端会话中工具不会出现。
- 结果反映 IDE 加载的语言服务——TypeScript、Pyright、ESLint、rust-analyzer 等。质量与覆盖取决于用户的 IDE 配置，而非 Claude Code。
- 诊断是实时的。编辑后请给语言服务一点时间重新分析，再把空结果当作成功——若文件刚保存请重跑一次。
- 严重级别通常包含 `error`、`warning`、`information`、`hint`。优先关注 `error`；警告可能是项目风格所致。
- 对于当前未在 IDE 中打开的文件，即使文件真的有问题，语言服务也可能没有诊断可报告。请打开该文件或运行构建以获得权威覆盖。
