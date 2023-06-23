"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWatcher = void 0;
var path = __importStar(require("path"));
var chokidar = __importStar(require("chokidar"));
var modpack_1 = require("./modpack");
var appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
var modpalFolderPath = path.join(appDataPath, 'Modpal');
var modpacksDirectoryPath = path.join(modpalFolderPath, 'modpacks');
// Function to start the watcher
function startWatcher() {
    // Watch the modpacks directory for changes
    var watcher = chokidar.watch(modpacksDirectoryPath, {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });
    watcher
        .on('add', function (dirPath) { return console.log("Directory ".concat(dirPath, " has been added")); })
        .on('change', function (filePath) {
        console.log("File ".concat(filePath, " has been changed"));
        if (filePath.endsWith('manifest.json')) {
            var modpackName = path.basename(path.dirname(filePath));
            console.log("THIS THIS THIS " + modpackName);
            (0, modpack_1.updateModpack)(modpackName);
        }
    })
        .on('unlink', function (path) { return console.log("File ".concat(path, " has been removed")); })
        .on('addDir', function (path) { return console.log("Directory ".concat(path, " has been added")); })
        .on('unlinkDir', function (dirPath) {
        console.log("Directory ".concat(dirPath, " has been removed"));
        var modpackName = path.basename(dirPath);
        (0, modpack_1.removeModpack)(modpackName);
    });
}
exports.startWatcher = startWatcher;
