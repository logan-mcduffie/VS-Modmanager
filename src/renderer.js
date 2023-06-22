// Import required modules
const { BrowserWindow } = require('@electron/remote');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const { toggleMaximize, closeModalAndResetForm, handleFormSubmission } = require('./utils.js');
const { createModpackTile, createModpackDirectory, createModpackPage, displayModpackPage, removeModpack, updateModpack } = require('./modpack.js');
const { startWatcher } = require('./watcher.js');
const { goToPage } = require('./page.js');

// Define UI elements
const modal = document.getElementById("myModal");
const createModpackButton = document.getElementById("create-modpack-button");
const closeButton = document.getElementsByClassName("close")[0];
const form = document.getElementById('modpackForm');
const modpackLogoButton = document.getElementById('modpackLogoButton');
const modpackLogoInput = document.getElementById('modpackLogo');
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const modpalFolderPath = path.join(appDataPath, 'Modpal');
const modpacksDirectoryPath = path.join(modpalFolderPath, 'modpacks');

// Event listeners for window controls
document.getElementById('minimize').addEventListener('click', () => BrowserWindow.getFocusedWindow().minimize());
document.getElementById('maximize').addEventListener('click', toggleMaximize);
document.getElementById('close').addEventListener('click', () => BrowserWindow.getFocusedWindow().close());

// Event listeners for modal controls
createModpackButton.onclick = () => modal.style.display = "block";
closeButton.onclick = closeModalAndResetForm;
window.onclick = (event) => { if (event.target == modal) closeModalAndResetForm(); };

// Event listeners for form controls
modpackLogoButton.onclick = () => modpackLogoInput.click();
modpackLogoInput.onchange = () => modpackLogoButton.textContent = modpackLogoInput.value ? 'File Chosen' : 'Choose File';

// Event listener for form submission
form.addEventListener('submit', handleFormSubmission);

window.onload = function() {
    startWatcher(modpacksDirectoryPath);

    // Define your pages
    const pages = ['my-modpacks', 'browse-modpacks']; // Add more page IDs as needed...

    // Store your page elements in an object
    const pageElements = {};
    for (const page of pages) {
        pageElements[page] = document.getElementById(page);
    }

    // Store your buttons in an object
    const buttons = {
        'my-modpacks': document.getElementById('my-modpacks-button'),
        'browse-modpacks': document.getElementById('browse-modpacks-button'),
        // Add more buttons as needed...
    };

    // Event listeners for switching views
    buttons['my-modpacks'].addEventListener('click', () => goToPage('my-modpacks'));
    buttons['browse-modpacks'].addEventListener('click', () => goToPage('browse-modpacks'));

    // Initialize the default page
    goToPage('my-modpacks');

    // Rest of your code...
};

removeModpack(modpackName)

updateModpack(modpackName)

createModpackTile(manifestData, logoData)
  
createModpackDirectory()

createModpackPage(modpack)

displayModpackPage(manifestData)

ipcRenderer.on('load-modpacks', (event, modpackData, logoData) => {
    createModpackTile(modpackData, logoData);
  });

ipcRenderer.send('load-modpacks');