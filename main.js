const { app, BrowserWindow } = require('electron')
require('@electron/remote/main').initialize()

const createWindow = () => {
  const win = new BrowserWindow({
    backgroundColor: '#2e2c29',
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html')

  // win.webContents.openDevTools()

  require('@electron/remote/main').enable(win.webContents)
}

app.whenReady().then(() => {
  createWindow()
})
