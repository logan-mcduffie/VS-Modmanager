// Import required modules
import { BrowserWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { toggleMaximize, closeModalAndResetForm, handleFormSubmission } from './utils';
import { createModpackTile, createModpackDirectory, createModpackPage, displayModpackPage, removeModpack, updateModpack } from './modpack';
import { startWatcher } from './watcher';
import { goToPage } from './page';

const pages: string[] = ['my-modpacks', 'browse-modpacks'];
const pageElements: { [key: string]: HTMLElement } = {};
const modal: HTMLElement | null = document.getElementById("myModal");
const createModpackButton: HTMLElement | null = document.getElementById("create-modpack-button");
const closeButton: HTMLElement | null = document.getElementsByClassName("close")[0] as HTMLElement | null;
const form: HTMLFormElement | null = document.getElementById('modpackForm') as HTMLFormElement;
const modpackLogoButton: HTMLElement | null = document.getElementById('modpackLogoButton');
const modpackLogoInput: HTMLInputElement | null = document.getElementById('modpackLogo') as HTMLInputElement;
const buttons: { [key: string]: HTMLElement } = {
 'my-modpacks': document.getElementById('my-modpacks-button')!,
 'browse-modpacks': document.getElementById('browse-modpacks-button')!,
 // Add more buttons as needed...
};

// Event listeners for window controls
document.getElementById('minimize')?.addEventListener('click', () => BrowserWindow.getFocusedWindow()?.minimize());
document.getElementById('maximize')?.addEventListener('click', toggleMaximize);
document.getElementById('close')?.addEventListener('click', () => BrowserWindow.getFocusedWindow()?.close());

// Event listeners for modal controls
createModpackButton?.addEventListener('click', () => {
    if (modal) {
      modal.style.display = "block";
    }
  });
  if (closeButton) {
    closeButton.addEventListener('click', closeModalAndResetForm);
  }
  window.onclick = (event) => {
    if (event.target instanceof Element && modal && event.target == modal) {
      closeModalAndResetForm();
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
    form.addEventListener('submit', handleFormSubmission);
  }

window.onload = function(): void {
 startWatcher();
 // Store your page elements in an object
 for (const page of pages) {
   pageElements[page] = document.getElementById(page)!;
 }
 // Event listeners for switching views
 if (buttons['my-modpacks']) {
    buttons['my-modpacks'].addEventListener('click', () => goToPage('my-modpacks', pageElements, buttons));
  }
  if (buttons['browse-modpacks']) {
    buttons['browse-modpacks'].addEventListener('click', () => goToPage('browse-modpacks', pageElements, buttons));
  }

 // Initialize the default page
 goToPage('my-modpacks', pageElements, buttons);

 ipcRenderer.on('load-modpacks', (event: Electron.IpcRendererEvent, modpackData: any, logoData: any) => {
   createModpackTile(modpackData, logoData);
 });

 ipcRenderer.send('load-modpacks');
};

// removeModpack(modpackName)
// updateModpack(modpackName)
// createModpackTile(manifestData, logoData)
// createModpackDirectory()
// createModpackPage(modpack)
// displayModpackPage(manifestData)
