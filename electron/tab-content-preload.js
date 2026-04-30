const { contextBridge, ipcRenderer } = require('electron');

// Bridge for chat content WebContentsView (each tab's main UI).
// Exposed under window.tabBridge so the renderer can react to global approval signals
// emitted by the Electron main process aggregating pending state across tabs.
//
// Subscription APIs (onApprovalBroadcast / onTabIdInit) return a dispose function so the
// renderer can unsubscribe on unmount; otherwise webContents reload accumulates listeners.
contextBridge.exposeInMainWorld('tabBridge', {
  onApprovalBroadcast: (cb) => {
    const handler = (_, payload) => cb(payload);
    ipcRenderer.on('approval-broadcast', handler);
    return () => ipcRenderer.removeListener('approval-broadcast', handler);
  },
  jumpToTab: (tabId) => ipcRenderer.send('approval-jump', tabId),
  onTabIdInit: (cb) => {
    const handler = (_, tabId) => cb(tabId);
    ipcRenderer.on('tab-id-init', handler);
    return () => ipcRenderer.removeListener('tab-id-init', handler);
  },
  notifyPtyPlanPending: (payload) => ipcRenderer.send('pty-plan-pending', payload),
  notifyPtyPlanResolved: (payload) => ipcRenderer.send('pty-plan-resolved', payload),
  // ask resolved 兜底：WS 断连 / ChatView unmount 时 server 不一定推 ask-hook-resolved，
  // renderer 显式通知 main 清 pendingByTab[tabId].ask，避免 badge 残留 + 跨 tab chip 误显
  notifyAskResolved: (payload) => ipcRenderer.send('ask-resolved', payload),
});
