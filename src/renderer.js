// Import required modules
const { BrowserWindow } = require('@electron/remote');

// Define UI elements
const { ipcRenderer } = require('electron');
const myModpacksButton = document.getElementById('my-modpacks-button');
const browseModpacksButton = document.getElementById('browse-modpacks-button');
const modal = document.getElementById("myModal");
const createModpackButton = document.getElementById("create-modpack-button");
const closeButton = document.getElementsByClassName("close")[0];
const form = document.getElementById('modpackForm');
const modpackLogoButton = document.getElementById('modpackLogoButton');
const modpackLogoInput = document.getElementById('modpackLogo');
const fs = require('fs');

// Add 'active' class to 'myModpacksButton' by default
myModpacksButton.classList.add('active');

// Event listeners for switching views
myModpacksButton.addEventListener('click', () => switchView(myModpacksButton, browseModpacksButton, 'my-modpacks', 'browse-modpacks'));
browseModpacksButton.addEventListener('click', () => switchView(browseModpacksButton, myModpacksButton, 'browse-modpacks', 'my-modpacks'));

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

function switchView(activeButton, inactiveButton, activeView, inactiveView) {
    if (!activeButton.classList.contains('active')) {
        document.getElementById(activeView).style.display = 'grid';
        document.getElementById(inactiveView).style.display = 'none';
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');
    }
}

function toggleMaximize() {
    let window = BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
}

function closeModalAndResetForm() {
    modal.style.display = "none";
    form.reset();
    modpackLogoButton.textContent = 'Choose File';
}

function handleFormSubmission(event) {
    event.preventDefault();
    createModpackDirectory();
    createModpackTile();
    closeModalAndResetForm();
}

function createModpackTile(modpackData, logoData) {
    var modpackTile = document.createElement('div');
    modpackTile.className = 'modpack-tile';
  
    var logoElement = document.createElement('img');
    logoElement.src = URL.createObjectURL(new Blob([logoData]));
    modpackTile.appendChild(logoElement);
  
    var nameElement = document.createElement('h2');
    nameElement.textContent = modpackData.modpackName;
    modpackTile.appendChild(nameElement);
  
    var authorElement = document.createElement('p');
    authorElement.textContent = "Author: " + modpackData.author;
    modpackTile.appendChild(authorElement);
  
    document.getElementById('my-modpacks').appendChild(modpackTile);
  }
  

function createModpackDirectory() {
    var modpackName = document.getElementById('modpackName').value;
    var modpackLogo = document.getElementById('modpackLogo').files[0];
    
    // Read the logo file into a Buffer
    fs.readFile(modpackLogo.path, (error, data) => {
        if (error) {
          console.error('An error occurred:', error);
          return;
        }

    // Send a 'create-modpack' message to the main process with the modpack name and logo
    ipcRenderer.send('create-modpack', modpackName, data);
    });

    ipcRenderer.on('create-modpack-reply', (event, message) => {
        console.log(message);
      });
}

ipcRenderer.on('load-modpacks', (event, modpackData, logoData) => {
    createModpackTile(modpackData, logoData);
  });
