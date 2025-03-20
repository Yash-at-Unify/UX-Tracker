// const { app, BrowserWindow, ipcMain } = require('electron');
// const axios = require('axios');
// const path = require('path');

// let mainWindow;

// const createMainWindow = () => {
//   const mainWindow = new BrowserWindow({
//     mainWindow = new BrowserWindow({
//       width: 800,
//       height: 600,
//       webPreferences: {
//         preload: path.join(__dirname, 'preload.js'),
//         contextIsolation: true,
//         enableRemoteModule: false,
//         nodeIntegration: true,
//       }
//   })
// }

  
// }

// app.whenReady().then(() => {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       contextIsolation: true,
//       enableRemoteModule: false,
//       nodeIntegration: true,
//     }
//   });

//   mainWindow.loadFile('index.html');
// });

// ipcMain.handle('login', async (event, username, password) => {
//   console.log("Received login request:", { username, password });

//   try {
//     const response = await axios.post(
//       'https://www.unifyxperts.com/api/method/login',
//       { 
//         "usr": username, 
//         "pwd": password },
//       { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } },
//       {withCredentials: true}
//     );

//     console.log("Backend Response:", response.data);  // ✅ Debugging Log

//     if (response.data.message === "Logged In") {
//       mainWindow.loadFile("time-tracker.html")
//       return { success: true, full_name: response.data.full_name };
//     } else {
//       return { success: false, message: "Invalid credentials" };
//     }
//   } catch (error) {
//     console.error("Login error:", error.message);  // ✅ Show full error
//     return { success: false, message: "Login failed (Check logs)" };
//   }
// });

const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const axios = require('axios');
const path = require('path');

let mainWindow;
let tray= null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: true,
    }
  })

  mainWindow.loadFile('static/templates/index.html');

  //minimize to tray on close
  mainWindow.on('close', (event)=>{
    event.preventDefault();
    mainWindow.hide();
  });

  if(!tray){
    createTray();
  }
  const createTray = () => {
    const iconPath = path.join(__dirname,'assets','tray-icon.png')

    try{
      tray = new Tray(path.join(__dirname, 'assets','tray-icon.png'))
      const contextMenu = Menu.buildFromTemplate([
        {label:'Show App', click: ()=> mainWindow.show()},
        {label: 'Quit', click: () => app.quit()}
      ]);

      tray.setToolTip('UX Time Tracker');
  tray.setContextMenu(contextMenu);

  tray.on('click',()=>{
    mainWindow.show();
  });
    } catch(er){
      console.log('Tray Error: ',er )
    }
  };
  

  

}

app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


ipcMain.handle('login', async (event, username, password) => {
  console.log("Received login request:", { username, password });

  try {
    const response = await axios.post(
      'https://www.unifyxperts.com/api/method/login',
      { 
        "usr": username, 
        "pwd": password },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } },
      {withCredentials: true}
    );

    console.log("Backend Response:", response.data);  // ✅ Debugging Log

    if (response.data.message === "Logged In") {
      mainWindow.loadFile("static/templates/time-tracker.html")
      return { success: true, full_name: response.data.full_name };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login error:", error.message);  // ✅ Show full error
    return { success: false, message: "Login failed (Check logs)" };
  }
});