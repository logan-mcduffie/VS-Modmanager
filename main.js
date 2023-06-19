const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const modpalFolderPath = path.join(appDataPath, 'Modpal');
const modpacksDirectoryPath = path.join(modpalFolderPath, 'modpacks');
require('@electron/remote/main').initialize()
let win;

const createWindow = () => {
  win = new BrowserWindow({
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

// Listen for the 'create-modpack' message
ipcMain.on('create-modpack', (event, modpackName, logoData) => {
  const modpackDirectoryPath = path.join(modpalFolderPath, 'modpacks', modpackName);
  const logoFilePath = path.join(modpackDirectoryPath, 'logo.png');

  // Create the modpack directory
  fs.mkdir(modpackDirectoryPath, { recursive: true }, (error) => {
    if (error) {
      event.reply('create-modpack-reply', 'An error occurred: ' + error.message);
      return;
    }

    // Write the logo file
    fs.writeFile(logoFilePath, logoData, (error) => {
      if (error) {
        event.reply('create-modpack-reply', 'An error occurred: ' + error.message);
        return;
      }

      // Define the manifest data
      const manifestData = {
        modpackName: modpackName,
        author: 'Author Name',
        version: '1.0.0',
        modList: [
          // Add your mods here
        ],
        description: 'A brief description of the modpack.',
        creationDate: new Date().toLocaleDateString() // Get the current date in YYYY-MM-DD format
      };

      // Define the path for the manifest file
      const manifestFilePath = path.join(modpackDirectoryPath, 'manifest.json');

      // Write the manifest file
      fs.writeFile(manifestFilePath, JSON.stringify(manifestData, null, 2), (error) => {
        if (error) {
          console.error('An error occurred:', error);
          return;
        }
        console.log('Manifest file created successfully!');
        event.reply('create-modpack-reply', 'Modpack created successfully!', manifestData, logoData);
      });
    });
  });
});

function loadModpacks() {
  fs.readdir(modpacksDirectoryPath, (error, modpackDirectories) => {
    if (error) {
      console.error('An error occurred:', error);
      return;
    }
    
    modpackDirectories.forEach((modpackDirectory) => {
      const manifestFilePath = path.join(modpacksDirectoryPath, modpackDirectory, 'manifest.json');
      fs.readFile(manifestFilePath, 'utf8', (error, manifestFile) => {
        if (error) {
          console.error('An error occurred:', error);
          return;
        }
        
        const manifestData = JSON.parse(manifestFile);
        const logoFilePath = path.join(modpacksDirectoryPath, modpackDirectory, 'logo.png');
        fs.readFile(logoFilePath, (error, logoData) => {
          if (error) {
            console.error('An error occurred:', error);
            return;
          }
          
          win.webContents.send('load-modpacks', manifestData, logoData);
        });
      });
    });
  });
}

ipcMain.on('load-modpacks', (event) => {
  loadModpacks();
});

app.whenReady().then(() => {
  createWindow()
})