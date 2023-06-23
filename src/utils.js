"use strict";
var BrowserWindow = require('@electron/remote').BrowserWindow;
// Function to toggle maximize
function toggleMaximize() {
    var window = BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
}
// Function to close modal and reset form
function closeModalAndResetForm() {
    modal.style.display = "none";
    form.reset();
    modpackLogoButton.textContent = 'Choose File';
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
