"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_1 = require("@electron/remote");
// Function to toggle maximize
function toggleMaximize() {
    var window = remote_1.BrowserWindow.getFocusedWindow();
    if (window) {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    }
}
// Function to close modal and reset form
function closeModalAndResetForm() {
    var modal = document.getElementById('modal-id'); // replace 'modal-id' with the actual id
    var form = document.getElementById('form-id'); // replace 'form-id' with the actual id
    var modpackLogoButton = document.getElementById('modpackLogoButton-id'); // replace 'modpackLogoButton-id' with the actual id
    if (modal && form && modpackLogoButton) {
        modal.style.display = "none";
        form.reset();
        modpackLogoButton.textContent = 'Choose File';
    }
}
// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    ipcRenderer.once('create-modpack-reply', function (event, message, modpackData, logoData) {
        console.log(message);
        createModpackTile(modpackData, logoData);
    });
    createModpackDirectory();
    closeModalAndResetForm();
}
// Export functions
module.exports = {
    toggleMaximize: toggleMaximize,
    closeModalAndResetForm: closeModalAndResetForm,
    handleFormSubmission: handleFormSubmission
};
