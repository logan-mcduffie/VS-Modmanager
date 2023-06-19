// Import required modules
const { BrowserWindow } = require('@electron/remote');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

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

    // Function to change the current page
    function goToPage(pageName) {
        const pageElement = pageElements[pageName];
        const button = buttons[pageName];
        if (!pageElement || !button) {
            console.error(`Page or button "${pageName}" not found`);
            return;
        }

        // Hide all pages and remove 'active' class from all buttons
        for (const page of pages) {
            pageElements[page].style.display = 'none';
            buttons[page].classList.remove('active');
        }

        // Show the current page and add 'active' class to the current button
        pageElement.style.display = 'grid';
        button.classList.add('active');
    }

    // Event listeners for switching views
    buttons['my-modpacks'].addEventListener('click', () => goToPage('my-modpacks'));
    buttons['browse-modpacks'].addEventListener('click', () => goToPage('browse-modpacks'));

    // Initialize the default page
    goToPage('my-modpacks');

    // Rest of your code...
};

// Watch the modpack directory for changes
fs.watch(modpacksDirectoryPath, (eventType, filename) => {
    // If a file was added or changed
    if (eventType === 'change' || eventType === 'rename') {
        const filePath = path.join(modpacksDirectoryPath, filename);

        // If a modpack was deleted
        if (!fs.existsSync(filePath)) {
            // Remove the modpack from the modpack list
            removeModpack(filename);
        } else {
            // If the manifest was updated
            if (filename === 'manifest.json') {
                // Update the associated text
                updateModpack(filename);
            }
        }
    }
});

function removeModpack(modpackName) {
    // Remove the modpack from the modpack list in "My Modpacks"
    // You'll need to implement this function based on how you're storing and displaying your modpacks
}

function updateModpack(modpackName) {
    // Read the updated manifest
    const manifestPath = path.join(modpackDirectory, modpackName, 'manifest.json');
    fs.readFile(manifestPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Failed to read manifest for modpack "${modpackName}":`, err);
            return;
        }

        // Parse the manifest data
        const manifestData = JSON.parse(data);

        // Update the associated text (like modpack name and author)
        // You'll need to implement this function based on how you're storing and displaying your modpacks
    });
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
    ipcRenderer.on('create-modpack-reply', (event, message, modpackData, logoData) => {
        console.log(message);
        createModpackTile(modpackData, logoData);
      });
    createModpackDirectory();
    closeModalAndResetForm();
}

function createModpackTile(manifestData, logoData) {
    var modpackTile = document.createElement('div');
    modpackTile.className = 'modpack-tile';
  
    var logoElement = document.createElement('img');
    logoElement.src = URL.createObjectURL(new Blob([logoData]));
    modpackTile.appendChild(logoElement);
  
    var nameElement = document.createElement('h2');
    nameElement.textContent = manifestData.modpackName;
    modpackTile.appendChild(nameElement);
  
    var authorElement = document.createElement('p');
    authorElement.textContent = "Author: " + manifestData.author;
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

ipcRenderer.send('load-modpacks');