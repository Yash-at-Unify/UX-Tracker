const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
});

ipcMain.handle('login', async (event, username, password) => {
  console.log("Received login request:", { username, password });

  try {
    const response = await axios.post(
      'https://www.unifyxperts.com/api/method/login',
      { 
        "usr": username, 
        "pwd": password },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
    );

    console.log("Backend Response:", response.data);  // ✅ Debugging Log

    if (response.data.message === "Logged In") {
      return { success: true, full_name: response.data.full_name };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login error:", error.message);  // ✅ Show full error
    return { success: false, message: "Login failed (Check logs)" };
  }
});
