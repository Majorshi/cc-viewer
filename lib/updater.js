import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync, spawn as realSpawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { t } from '../i18n.js';
import { getClaudeConfigDir } from '../findcc.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CHECK_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours
const CACHE_DIR = join(getClaudeConfigDir(), 'cc-viewer');
const CACHE_FILE = join(CACHE_DIR, 'update-check.json');
const CC_SETTINGS_FILE = join(getClaudeConfigDir(), 'settings.json');

function getCurrentVersion() {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
  return pkg.version;
}

function parseVersion(ver) {
  const [major, minor, patch] = ver.split('.').map(Number);
  return { major, minor, patch };
}

function isNewer(remote, current) {
  const r = parseVersion(remote);
  const c = parseVersion(current);
  if (r.major !== c.major) return r.major > c.major;
  if (r.minor !== c.minor) return r.minor > c.minor;
  return r.patch > c.patch;
}

// 读取 Claude Code 全局配置，判断是否允许自更新
function isAutoUpdateEnabled() {
  // 环境变量禁用
  if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return false;

  try {
    if (!existsSync(CC_SETTINGS_FILE)) return true; // 默认启用
    const settings = JSON.parse(readFileSync(CC_SETTINGS_FILE, 'utf-8'));
    // Claude Code 用 autoUpdates: false 显式禁用
    if (settings.autoUpdates === false) return false;
  } catch { }

  return true; // 默认启用
}

function shouldCheck() {
  try {
    if (!existsSync(CACHE_FILE)) return true;
    const data = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    return Date.now() - data.lastCheck > CHECK_INTERVAL;
  } catch {
    return true;
  }
}

function saveCheckTime() {
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify({ lastCheck: Date.now() }));
  } catch { }
}

// 判断本机是否有任何 CCV 实例在使用：
//   1. 调用方（当前 server）通过 `busy` 明确告知自己有 SSE client / PTY / SDK session 在跑
//   2. 扫 CCV 端口范围，看是否有**除自己外**的其它 CCV server 实例正在 LISTEN
// 参数 `lsofImpl` 用于单测注入假的 lsof 输出；默认走真 execSync。
// 非 POSIX / 没装 lsof / 超时 → fallback 只看 busy，不强行判忙（避免 Windows 永远升不了级）。
export function isAnyCcvBusy({ currentPid, busy, portRange, lsofImpl } = {}) {
  if (busy) return true;

  const [start, end] = Array.isArray(portRange) && portRange.length === 2 ? portRange : [7008, 7099];
  const pid = typeof currentPid === 'number' ? currentPid : process.pid;
  const runLsof = lsofImpl || ((cmd) => execSync(cmd, { timeout: 2000, encoding: 'utf-8' }));

  try {
    const out = String(runLsof(`lsof -iTCP:${start}-${end} -sTCP:LISTEN -P -n -Fp`));
    // -Fp 输出每行是 field：p<pid> 是进程标识，f<fd>/cwd/txt 等是其它字段，不能误纳。
    // 防御：(a) 预先剥 CRLF（Windows / 某些管道会带 \r），(b) 用严格正则 ^p\d+$，只认"p + 纯数字"，
    //       拒 `p` 空行 / `p-1` 负值 / `p0` / `p\r` 等畸形；(c) 只保留正整数。
    const lines = out.replace(/\r/g, '').split('\n');
    const pids = lines
      .filter(l => /^p\d+$/.test(l))
      .map(l => Number(l.slice(1)))
      .filter(n => Number.isFinite(n) && n > 0);
    const others = pids.filter(p => p !== pid);
    if (others.length > 0) return true;
  } catch {
    // lsof 不在 / 非 POSIX / 超时 → 放过
  }
  return false;
}

// options:
//   fetchImpl        -- 注入 fetch（默认全局 fetch）
//   spawnImpl        -- 注入 spawn（默认 node:child_process 的 spawn）
//   lsofImpl         -- 注入 lsof exec（默认 execSync）；传给 isAnyCcvBusy
//   dryRun           -- 不真执行 install（spawn 路径直接跳过）
//   busy             -- 本进程是否忙（SSE/PTY/SDK 活跃），由 server.js 调用点组装
//   portRange        -- [start, end]，传给 lsof 扫端口；server.js 里 START_PORT/MAX_PORT
//
// 返回 status:
//   disabled | skipped | latest | major_available | deferred_busy | upgrading_in_background | error
export async function checkAndUpdate(options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const spawnImpl = options.spawnImpl || realSpawn;
  const lsofImpl = options.lsofImpl; // undefined → isAnyCcvBusy 走默认
  const dryRun = options.dryRun === true;
  const busy = options.busy === true;
  const portRange = options.portRange;
  const currentVersion = getCurrentVersion();

  // 跟随 Claude Code 全局配置
  if (!isAutoUpdateEnabled()) {
    return { status: 'disabled', currentVersion, remoteVersion: null };
  }

  if (!shouldCheck()) {
    return { status: 'skipped', currentVersion, remoteVersion: null };
  }

  try {
    const res = await fetchImpl('https://registry.npmjs.org/cc-viewer');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const remoteVersion = data['dist-tags']?.latest;

    saveCheckTime();

    if (!remoteVersion) {
      return { status: 'error', currentVersion, remoteVersion: null, error: 'No version found' };
    }

    if (!isNewer(remoteVersion, currentVersion)) {
      return { status: 'latest', currentVersion, remoteVersion };
    }

    const remote = parseVersion(remoteVersion);
    const current = parseVersion(currentVersion);

    // 跨大版本：仅提示
    if (remote.major !== current.major) {
      console.error(`[CC Viewer] ${t('update.majorAvailable', { version: remoteVersion })}`);
      return { status: 'major_available', currentVersion, remoteVersion };
    }

    // 同大版本：查忙
    if (isAnyCcvBusy({ currentPid: process.pid, busy, portRange, lsofImpl })) {
      // 有人在用 → 不升，避免卡顿；下次启动再重试。Banner 仍会广播（见 server.js 调用点）。
      return { status: 'deferred_busy', currentVersion, remoteVersion };
    }

    // 空闲 → detached spawn 后台跑 npm install；立即返回，不阻塞事件循环。
    // Windows 下 `npm` 实际是 `npm.cmd`，Node spawn **不带 shell** 不会自动解析 .cmd 扩展名，会 ENOENT。
    // 用 `shell: process.platform === 'win32'` 条件启用 shell 模式跨平台兜底。
    console.error(`[CC Viewer] ${t('update.updating', { version: remoteVersion })} (background)`);
    if (!dryRun) {
      try {
        const child = spawnImpl(
          'npm',
          ['install', '-g', `cc-viewer@${remoteVersion}`, '--no-audit', '--no-fund'],
          { detached: true, stdio: 'ignore', shell: process.platform === 'win32' }
        );
        if (child && typeof child.unref === 'function') child.unref();
      } catch (err) {
        console.error(`[CC Viewer] ${t('update.failed', { error: err.message })}`);
        return { status: 'error', currentVersion, remoteVersion, error: err.message };
      }
    }
    return { status: 'upgrading_in_background', currentVersion, remoteVersion };
  } catch (err) {
    saveCheckTime();
    return { status: 'error', currentVersion, remoteVersion: null, error: err.message };
  }
}
