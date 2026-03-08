const DB_NAME = 'ccv_entryCache';
const STORE_NAME = 'entries';
const CACHE_KEY = 'cache';
const DB_VERSION = 1;
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 天过期

// 单例 DB 连接，避免每次操作都重新打开
let _dbInstance = null;
let _dbPromise = null;

function getDB() {
  if (_dbInstance) return Promise.resolve(_dbInstance);
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => {
      _dbInstance = req.result;
      _dbInstance.onclose = () => { _dbInstance = null; };
      _dbPromise = null;
      resolve(_dbInstance);
    };
    req.onerror = () => {
      _dbPromise = null;
      reject(req.error);
    };
  });
  return _dbPromise;
}

// 写入序列化：丢弃排队中的过时写入，只保留最新一次
let _writeId = 0;

export async function saveEntries(projectName, entries) {
  if (!projectName || !Array.isArray(entries) || entries.length === 0) return;
  const myId = ++_writeId;
  try {
    const db = await getDB();
    // 被更新的写入请求取代，丢弃本次
    if (myId !== _writeId) return;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({ projectName, entries, ts: Date.now() }, CACHE_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // 静默
  }
}

export async function loadEntries(projectName) {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(CACHE_KEY);
      req.onsuccess = () => {
        const data = req.result;
        if (!data || data.projectName !== projectName || !Array.isArray(data.entries) || data.entries.length === 0) {
          resolve(null);
        } else if (data.ts && Date.now() - data.ts > MAX_AGE) {
          // 缓存超过 7 天，清除并返回 null
          clearEntries();
          resolve(null);
        } else {
          resolve(data.entries);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function clearEntries() {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(CACHE_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // 静默
  }
}
