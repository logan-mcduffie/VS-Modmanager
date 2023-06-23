"use strict";
// Import required modules
var BrowserWindow = require('@electron/remote').BrowserWindow;
var ipcRenderer = require('electron').ipcRenderer;
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var _a = require('c:/Users/logan/OneDrive/Desktop/VS-Modmanager/src/utils'), toggleMaximize = _a.toggleMaximize, closeModalAndResetForm = _a.closeModalAndResetForm, handleFormSubmission = _a.handleFormSubmission;
var _b = require('c:/Users/logan/OneDrive/Desktop/VS-Modmanager/src/modpack'), createModpackTile = _b.createModpackTile, createModpackDirectory = _b.createModpackDirectory, createModpackPage = _b.createModpackPage, displayModpackPage = _b.displayModpackPage, removeModpack = _b.removeModpack, updateModpack = _b.updateModpack;
var startWatcher = require('c:/Users/logan/OneDrive/Desktop/VS-Modmanager/src/watcher').startWatcher;
var goToPage = require('c:/Users/logan/OneDrive/Desktop/VS-Modmanager/src/page').goToPage;
// Define UI elements
var pages = ['my-modpacks', 'browse-modpacks'];
var pageElements = {};
var modal = document.getElementById("myModal");
var createModpackButton = document.getElementById("create-modpack-button");
var closeButton = document.getElementsByClassName("close")[0];
var form = document.getElementById('modpackForm');
var modpackLogoButton = document.getElementById('modpackLogoButton');
var modpackLogoInput = document.getElementById('modpackLogo');
var appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
var modpalFolderPath = path.join(appDataPath, 'Modpal');
var modpacksDirectoryPath = path.join(modpalFolderPath, 'modpacks');
var buttons = {
    'my-modpacks': document.getElementById('my-modpacks-button'),
    'browse-modpacks': document.getElementById('browse-modpacks-button'),
    // Add more buttons as needed...
};
// Event listeners for window controls
document.getElementById('minimize').addEventListener('click', function () { return BrowserWindow.getFocusedWindow().minimize(); });
document.getElementById('maximize').addEventListener('click', toggleMaximize);
document.getElementById('close').addEventListener('click', function () { return BrowserWindow.getFocusedWindow().close(); });
// Event listeners for modal controls
createModpackButton.onclick = function () { return modal.style.display = "block"; };
closeButton.onclick = closeModalAndResetForm;
window.onclick = function (event) { if (event.target == modal)
    closeModalAndResetForm(); };
// Event listeners for form controls
modpackLogoButton.onclick = function () { return modpackLogoInput.click(); };
modpackLogoInput.onchange = function () { return modpackLogoButton.textContent = modpackLogoInput.value ? 'File Chosen' : 'Choose File'; };
// Event listener for form submission
form.addEventListener('submit', handleFormSubmission);
window.onload = function () {
    startWatcher(modpacksDirectoryPath);
    // Store your page elements in an object
    for (var _i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
        var page = pages_1[_i];
        pageElements[page] = document.getElementById(page);
    }
    // Event listeners for switching views
    buttons['my-modpacks'].addEventListener('click', function () { return goToPage('my-modpacks', pageElements, buttons); });
    buttons['browse-modpacks'].addEventListener('click', function () { return goToPage('browse-modpacks', pageElements, buttons); });
    // Initialize the default page
    goToPage('my-modpacks', pageElements, buttons);
    ipcRenderer.on('load-modpacks', function (event, modpackData, logoData) {
        createModpackTile(modpackData, logoData);
    });
    ipcRenderer.send('load-modpacks');
};
removeModpack(modpackName);
updateModpack(modpackName);
createModpackTile(manifestData, logoData);
createModpackDirectory();
createModpackPage(modpack);
displayModpackPage(manifestData);
