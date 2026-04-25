/**
 * 检测一个 mainAgent entry 是否是 /clear 之后的首个 checkpoint。
 *
 * 单独抽成无依赖的模块（不引 contentFilter，避免 node --test 走 bare import 失败）。
 *
 * 必要条件三选三：
 *   1. entry._isCheckpoint === true（delta 重建器认为这是一个完整快照）
 *   2. body.messages.length 比 prevMessageCount 小（真正"缩短"，排除增量再快照）
 *   3. msg[0] 是 user 消息且含 `<command-name>/clear</command-name>` 标记
 *
 * 用于 _processEntries / sessionMerge 区分真实 /clear 起点 vs 普通 /compact 缩短。
 * /compact 的 msg[0] 是 summary，没有 /clear 标记，自然返回 false。
 *
 * @param {object} entry
 * @param {number} [prevMessageCount=0]
 * @returns {boolean}
 */
export function isPostClearCheckpoint(entry, prevMessageCount = 0) {
  if (!entry || entry._isCheckpoint !== true) return false;
  const msgs = entry.body && entry.body.messages;
  if (!Array.isArray(msgs) || msgs.length === 0) return false;
  if (prevMessageCount > 0 && msgs.length >= prevMessageCount) return false;
  const m0 = msgs[0];
  if (!m0 || m0.role !== 'user' || !Array.isArray(m0.content)) return false;
  for (let i = 0; i < m0.content.length; i++) {
    const block = m0.content[i];
    if (block && block.type === 'text' && typeof block.text === 'string' &&
        block.text.indexOf('<command-name>/clear</command-name>') !== -1) {
      return true;
    }
  }
  return false;
}
