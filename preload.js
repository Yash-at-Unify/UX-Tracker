const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded!");  // ✅ Debugging Log

contextBridge.exposeInMainWorld('electronAPI', {
  login: (username, password) => {
    console.log("Sending login request from preload.js");  // ✅ Debugging Log
    return ipcRenderer.invoke('login', username, password);
  }
});

contextBridge.exposeInMainWorld('tracker',{
  toggleTimer: (state)=> ipcRenderer.send('toogle-timer',state),
  startTimer: ()=> ipcRenderer.send('start-timer'),
  stopTimer: () => ipcRenderer.send('stop-timer'),
  getScreenshot: ()=> ipcRenderer.invoke('capture-screenshot'),
  onTimerUpdate: (callback) => ipcRenderer.on('timer-update', (_event, time)=> callback(time)),
  onScreenshotTaken: (callback)=> ipcRenderer.on('screenshot-taken', (_event,imagePath)=> callback(imagePath))
});