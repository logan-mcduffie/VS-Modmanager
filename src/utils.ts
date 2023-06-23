import { BrowserWindow } from '@electron/remote';
import { createModpackDirectory, createModpackTile } from './modpack';
import { ipcRenderer } from 'electron';


// Function to toggle maximize
export function toggleMaximize() {
  let window = BrowserWindow.getFocusedWindow();
  if (window) {
      window.isMaximized() ? window.unmaximize() : window.maximize();
  }
}


// Function to close modal and reset form
export function closeModalAndResetForm() {
  const modal = document.getElementById('modal-id'); // replace 'modal-id' with the actual id
  const form = document.getElementById('form-id') as HTMLFormElement; // replace 'form-id' with the actual id
  const modpackLogoButton = document.getElementById('modpackLogoButton-id'); // replace 'modpackLogoButton-id' with the actual id
  if (modal && form && modpackLogoButton) {
      modal.style.display = "none";
      form.reset();
      modpackLogoButton.textContent = 'Choose File';
  }
}


// Function to handle form submission
export function handleFormSubmission(event: any) {
    event.preventDefault();
    ipcRenderer.once('create-modpack-reply', (event, message, modpackData, logoData) => {
        console.log(message);
        createModpackTile(modpackData, logoData);
      });
    createModpackDirectory();
    closeModalAndResetForm();
}
