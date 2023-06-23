"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const main_1 = require("@electron/remote/main");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let win;
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const modpalFolderPath = path_1.default.join(appDataPath, 'Modpal');
const modpacksDirectoryPath = path_1.default.join(modpalFolderPath, 'modpacks');
const createWindow = async () => {
    win = new electron_1.BrowserWindow({
        backgroundColor: '#2e2c29',
        width: 1120,
        height: 780,
        minWidth: 1120,
        minHeight: 780,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    try {
        await fs_1.default.mkdir(modpalFolderPath, { recursive: true }, () => { }); // Use fs.promises.mkdir with await
    }
    catch (err) {
        console.error(err);
    }
    win.loadFile('index.html');
    (0, main_1.enable)(win.webContents);
};
// Listen for the 'create-modpack' message
electron_1.ipcMain.on('create-modpack', (event, modpackName, logoData) => {
    const modpackDirectoryPath = path_1.default.join(modpalFolderPath, 'modpacks', modpackName);
    const logoFilePath = path_1.default.join(modpackDirectoryPath, 'logo.png');
    // Create the modpack directory
    fs_1.default.mkdir(modpackDirectoryPath, { recursive: true }, (error) => {
        if (error) {
            event.reply('create-modpack-reply', 'An error occurred: ' + error.message);
            return;
        }
        // Write the logo file
        fs_1.default.writeFile(logoFilePath, logoData, (error) => {
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
            const manifestFilePath = path_1.default.join(modpackDirectoryPath, 'manifest.json');
            // Write the manifest file
            fs_1.default.writeFile(manifestFilePath, JSON.stringify(manifestData, null, 2), (error) => {
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
    fs_1.default.readdir(modpacksDirectoryPath, (error, modpackDirectories) => {
        if (error) {
            console.error('An error occurred:', error);
            return;
        }
        modpackDirectories.forEach((modpackDirectory) => {
            const manifestFilePath = path_1.default.join(modpacksDirectoryPath, modpackDirectory, 'manifest.json');
            fs_1.default.readFile(manifestFilePath, 'utf8', (error, manifestFile) => {
                if (error) {
                    console.error('An error occurred:', error);
                    return;
                }
                const manifestData = JSON.parse(manifestFile);
                const logoFilePath = path_1.default.join(modpacksDirectoryPath, modpackDirectory, 'logo.png');
                fs_1.default.readFile(logoFilePath, (error, logoData) => {
                    if (error) {
                        console.error('An error occurred:', error);
                        return;
                    }
                    if (win !== null) {
                        win.webContents.send('load-modpacks', manifestData, logoData);
                    }
                });
            });
        });
    });
}
electron_1.ipcMain.on('load-modpacks', (event) => {
    loadModpacks();
});
electron_1.app.whenReady().then(() => {
    createWindow();
});
