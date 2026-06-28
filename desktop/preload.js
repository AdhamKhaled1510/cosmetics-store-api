const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
  onNotification: (callback) => ipcRenderer.on('notification', (_, msg) => callback(msg)),
  saveAdminCreds: (creds) => ipcRenderer.send('save-admin-creds', creds),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
});
