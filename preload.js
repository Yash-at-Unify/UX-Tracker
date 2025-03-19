const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded!");  // ✅ Debugging Log

contextBridge.exposeInMainWorld('electronAPI', {
  login: (username, password) => {
    console.log("Sending login request from preload.js");  // ✅ Debugging Log
    return ipcRenderer.invoke('login', username, password);
  }
});
