"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var main_1 = require("@electron/remote/main");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var win;
var appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
var modpalFolderPath = path_1.default.join(appDataPath, 'Modpal');
var modpacksDirectoryPath = path_1.default.join(modpalFolderPath, 'modpacks');
var createWindow = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
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
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs_1.default.mkdir(modpalFolderPath, { recursive: true }, function () { })];
            case 2:
                _a.sent(); // Use fs.promises.mkdir with await
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 4];
            case 4:
                win.loadFile('index.html');
                (0, main_1.enable)(win.webContents);
                return [2 /*return*/];
        }
    });
}); };
// Listen for the 'create-modpack' message
electron_1.ipcMain.on('create-modpack', function (event, modpackName, logoData) {
    var modpackDirectoryPath = path_1.default.join(modpalFolderPath, 'modpacks', modpackName);
    var logoFilePath = path_1.default.join(modpackDirectoryPath, 'logo.png');
    // Create the modpack directory
    fs_1.default.mkdir(modpackDirectoryPath, { recursive: true }, function (error) {
        if (error) {
            event.reply('create-modpack-reply', 'An error occurred: ' + error.message);
            return;
        }
        // Write the logo file
        fs_1.default.writeFile(logoFilePath, logoData, function (error) {
            if (error) {
                event.reply('create-modpack-reply', 'An error occurred: ' + error.message);
                return;
            }
            // Define the manifest data
            var manifestData = {
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
            var manifestFilePath = path_1.default.join(modpackDirectoryPath, 'manifest.json');
            // Write the manifest file
            fs_1.default.writeFile(manifestFilePath, JSON.stringify(manifestData, null, 2), function (error) {
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
    fs_1.default.readdir(modpacksDirectoryPath, function (error, modpackDirectories) {
        if (error) {
            console.error('An error occurred:', error);
            return;
        }
        modpackDirectories.forEach(function (modpackDirectory) {
            var manifestFilePath = path_1.default.join(modpacksDirectoryPath, modpackDirectory, 'manifest.json');
            fs_1.default.readFile(manifestFilePath, 'utf8', function (error, manifestFile) {
                if (error) {
                    console.error('An error occurred:', error);
                    return;
                }
                var manifestData = JSON.parse(manifestFile);
                var logoFilePath = path_1.default.join(modpacksDirectoryPath, modpackDirectory, 'logo.png');
                fs_1.default.readFile(logoFilePath, function (error, logoData) {
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
electron_1.ipcMain.on('load-modpacks', function (event) {
    loadModpacks();
});
electron_1.app.whenReady().then(function () {
    createWindow();
});
