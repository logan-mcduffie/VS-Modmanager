"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFormSubmission = exports.closeModalAndResetForm = exports.toggleMaximize = void 0;
const remote_1 = require("@electron/remote");
const modpack_1 = require("./modpack");
const electron_1 = require("electron");
// Function to toggle maximize
function toggleMaximize() {
    let window = remote_1.BrowserWindow.getFocusedWindow();
    if (window) {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    }
}
exports.toggleMaximize = toggleMaximize;
// Function to close modal and reset form
function closeModalAndResetForm() {
    const modal = document.getElementById('modal-id'); // replace 'modal-id' with the actual id
    const form = document.getElementById('form-id'); // replace 'form-id' with the actual id
    const modpackLogoButton = document.getElementById('modpackLogoButton-id'); // replace 'modpackLogoButton-id' with the actual id
    if (modal && form && modpackLogoButton) {
        modal.style.display = "none";
        form.reset();
        modpackLogoButton.textContent = 'Choose File';
    }
}
exports.closeModalAndResetForm = closeModalAndResetForm;
// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    electron_1.ipcRenderer.once('create-modpack-reply', (event, message, modpackData, logoData) => {
        console.log(message);
        (0, modpack_1.createModpackTile)(modpackData, logoData);
    });
    (0, modpack_1.createModpackDirectory)();
    closeModalAndResetForm();
}
exports.handleFormSubmission = handleFormSubmission;
