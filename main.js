const { app, BrowserWindow } = require('electron')
const fs = require('fs');
const path = require('path');
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const modpalFolderPath = path.join(appDataPath, 'Modpal');
require('@electron/remote/main').initialize()

const createWindow = () => {
  const win = new BrowserWindow({
    backgroundColor: '#2e2c29',
    width: 1120,
    height: 780,
    minWidth: 1120,
    minHeight: 780,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  fs.mkdir(modpalFolderPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  win.loadFile('index.html')

  // win.webContents.openDevTools()

  require('@electron/remote/main').enable(win.webContents)
}

app.whenReady().then(() => {
  createWindow()
})