const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => process.versions,
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // App controls
  restart: () => ipcRenderer.invoke('app-restart'),
  quit: () => ipcRenderer.invoke('app-quit'),
  
  // Services status
  getServicesStatus: () => ipcRenderer.invoke('get-services-status'),
  
  // File operations
  selectFile: (options) => ipcRenderer.invoke('dialog-open-file', options),
  selectFolder: (options) => ipcRenderer.invoke('dialog-open-folder', options),
  
  // Notifications
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings)
});
