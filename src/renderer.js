"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
const remote_1 = require("@electron/remote");
const electron_1 = require("electron");
const utils_1 = require("./utils");
const modpack_1 = require("./modpack");
const watcher_1 = require("./watcher");
const page_1 = require("./page");
const pages = ['my-modpacks', 'browse-modpacks'];
const pageElements = {};
const modal = document.getElementById("myModal");
const createModpackButton = document.getElementById("create-modpack-button");
const closeButton = document.getElementsByClassName("close")[0];
const form = document.getElementById('modpackForm');
const modpackLogoButton = document.getElementById('modpackLogoButton');
const modpackLogoInput = document.getElementById('modpackLogo');
const buttons = {
    'my-modpacks': document.getElementById('my-modpacks-button'),
    'browse-modpacks': document.getElementById('browse-modpacks-button'),
    // Add more buttons as needed...
};
// Event listeners for window controls
document.getElementById('minimize')?.addEventListener('click', () => remote_1.BrowserWindow.getFocusedWindow()?.minimize());
document.getElementById('maximize')?.addEventListener('click', utils_1.toggleMaximize);
document.getElementById('close')?.addEventListener('click', () => remote_1.BrowserWindow.getFocusedWindow()?.close());
// Event listeners for modal controls
createModpackButton?.addEventListener('click', () => {
    if (modal) {
        modal.style.display = "block";
    }
});
if (closeButton) {
    closeButton.addEventListener('click', utils_1.closeModalAndResetForm);
}
window.onclick = (event) => {
    if (event.target instanceof Element && modal && event.target == modal) {
        (0, utils_1.closeModalAndResetForm)();
    }
};
// Event listeners for form controls
modpackLogoButton?.addEventListener('click', () => {
    if (modpackLogoInput) {
        modpackLogoInput.click();
    }
});
if (modpackLogoInput) {
    modpackLogoInput.onchange = () => {
        if (modpackLogoButton) {
            modpackLogoButton.textContent = modpackLogoInput.value ? 'File Chosen' : 'Choose File';
        }
    };
}
// Event listener for form submission
if (form) {
    form.addEventListener('submit', utils_1.handleFormSubmission);
}
window.onload = function () {
    (0, watcher_1.startWatcher)();
    // Store your page elements in an object
    for (const page of pages) {
        pageElements[page] = document.getElementById(page);
    }
    // Event listeners for switching views
    if (buttons['my-modpacks']) {
        buttons['my-modpacks'].addEventListener('click', () => (0, page_1.goToPage)('my-modpacks', pageElements, buttons));
    }
    if (buttons['browse-modpacks']) {
        buttons['browse-modpacks'].addEventListener('click', () => (0, page_1.goToPage)('browse-modpacks', pageElements, buttons));
    }
    // Initialize the default page
    (0, page_1.goToPage)('my-modpacks', pageElements, buttons);
    electron_1.ipcRenderer.on('load-modpacks', (event, modpackData, logoData) => {
        (0, modpack_1.createModpackTile)(modpackData, logoData);
    });
    electron_1.ipcRenderer.send('load-modpacks');
};
// removeModpack(modpackName)
// updateModpack(modpackName)
// createModpackTile(manifestData, logoData)
// createModpackDirectory()
// createModpackPage(modpack)
// displayModpackPage(manifestData)
