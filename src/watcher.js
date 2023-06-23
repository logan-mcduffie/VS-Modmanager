"use strict";
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var _a = require('./modpack'), updateModpack = _a.updateModpack, removeModpack = _a.removeModpack;
// Function to start the watcher
function startWatcher(modpacksDirectoryPath) {
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
            updateModpack(modpackName);
        }
    })
        .on('unlink', function (path) { return console.log("File ".concat(path, " has been removed")); })
        .on('addDir', function (path) { return console.log("Directory ".concat(path, " has been added")); })
        .on('unlinkDir', function (dirPath) {
        console.log("Directory ".concat(dirPath, " has been removed"));
        var modpackName = path.basename(dirPath);
        removeModpack(modpackName);
    });
}
// Export functions
module.exports = {
    startWatcher: startWatcher
};
