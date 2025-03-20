const { app, BrowserWindow, ipcMain, Tray, Menu, desktopCapturer, screen } = require('electron');
const axios = require('axios');
const path = require('path');
const fs =  require('fs');

let mainWindow;
let tray= null;
let tracking = false;
let trackedTime = 0;
let timeInterval;
const screenshotDir = path.join(__dirname,'UX-Tracker-Screenshots');

if(!fs.existsSync(screenshotDir)){
  fs.mkdirSync(screenshotDir,{ recursive: true });
}

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
      tray = new Tray(iconPath)
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
  // console.log("Received login request:", { username, password });

  try {
    const response = await axios.post(
      'https://www.unifyxperts.com/api/method/login',
      { 
        "usr": username, 
        "pwd": password },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } },
      {withCredentials: true}
    );

    // console.log("Backend Response:", response.data);  // ✅ Debugging Log

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

ipcMain.on('start-timer',()=> {
  console.log('tracking started.....')
  tracking = true,
  timeInterval = setInterval(()=>{
    trackedTime += 10;
    mainWindow.webContents.send('timer-update', `${trackedTime} mins`);
    captureScreenshot();
  }, 20000);
})

ipcMain.on('stop-timer',()=>{
  console.log('tracker stopped......')
  tracking = false;
  clearInterval(timeInterval);
  trackedTime = 0;
  mainWindow.webContents.send('timer-update', `${trackedTime} mins`);
});

async function captureScreenshot() {
  try {
    // Get actual screen resolution
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width, height } // Capture at full resolution
    });

    for (const source of sources) {
      if (source.name.toLowerCase().includes('screen')) {
        const screenshotPath = path.join(screenshotDir, `screenshot-${Date.now()}.png`);
        
        // Save the full-quality image without resizing
        fs.writeFileSync(screenshotPath, source.thumbnail.toPNG());

        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        return screenshotPath;
      }
    }
  } catch (error) {
    console.error('Screenshot Error:', error);
  }
}