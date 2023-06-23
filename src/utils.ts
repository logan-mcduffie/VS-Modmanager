const { BrowserWindow } = require('@electron/remote');

// Function to toggle maximize
function toggleMaximize() {
    let window = BrowserWindow.getFocusedWindow();
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
    ipcRenderer.once('create-modpack-reply', (event, message, modpackData, logoData) => {
        console.log(message);
        createModpackTile(modpackData, logoData);
      });
    createModpackDirectory();
    closeModalAndResetForm();
}

// Export functions
module.exports = {
  toggleMaximize,
  closeModalAndResetForm,
  handleFormSubmission
};
