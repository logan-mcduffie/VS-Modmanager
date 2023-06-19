// Import required modules
const { BrowserWindow } = require('@electron/remote');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

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

// Event listener for modpack tile press
modpackTile.addEventListener('click', () => displayModpackPage(manifestData));

window.onload = function() {

    const watcher = chokidar.watch(modpacksDirectoryPath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
      });

      watcher
      .on('add', dirPath => console.log(`Directory ${dirPath} has been added`))
      .on('change', filePath => {
        console.log(`File ${filePath} has been changed`);
        if (filePath.endsWith('manifest.json')) {
          const modpackName = path.basename(path.dirname(filePath));
          updateModpack(modpackName);
        }
      })
      .on('unlink', path => console.log(`File ${path} has been removed`))
      .on('addDir', path => console.log(`Directory ${path} has been added`))
      .on('unlinkDir', dirPath => { 
        console.log(`Directory ${dirPath} has been removed`);
        const modpackName = path.basename(dirPath);
        removeModpack(modpackName);
      });

    
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

function removeModpack(modpackName) {
    console.log(`Attempting to remove modpack "${modpackName}"`);

    // Get the modpack tile element
    const modpackTile = document.getElementById(modpackName);
    console.log(`Modpack tile:`, modpackTile);

    if (modpackTile) {
        // Remove the modpack tile from the modpack list in "My Modpacks"
        modpackTile.remove();
        console.log(`Removed modpack "${modpackName}"`);
    } else {
        console.log(`Could not find modpack "${modpackName}"`);
    }
}

function updateModpack(modpackName) {
    // Read the updated manifest
    const manifestPath = path.join(modpacksDirectoryPath, modpackName, 'manifest.json');
    fs.readFile(manifestPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Failed to read manifest for modpack "${modpackName}":`, err);
            return;
        }

        // Parse the manifest data
        const manifestData = JSON.parse(data);

        // Get the modpack tile element
        const modpackTile = document.getElementById(modpackName);
        if (modpackTile) {
            // Update the associated text (like modpack name and author)
            const nameElement = modpackTile.querySelector('.modpack-name');
            const authorElement = modpackTile.querySelector('.modpack-author');
            nameElement.textContent = manifestData.modpackName;
            authorElement.textContent = "Author: " + manifestData.author;
        }
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
    ipcRenderer.once('create-modpack-reply', (event, message, modpackData, logoData) => {
        console.log(message);
        createModpackTile(modpackData, logoData);
      });
    createModpackDirectory();
    closeModalAndResetForm();
}

function createModpackTile(manifestData, logoData) {
    var modpackTile = document.createElement('div');
    modpackTile.className = 'modpack-tile';
    modpackTile.id = manifestData.modpackName;
  
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

function createModpackPage(modpack) {
    return `
        <div id="modpack-page">
            <h1>${modpack.modpackName}</h1>
            <p>Author: ${modpack.author}</p>
            <p>Version: ${modpack.version}</p>
            <p>Description: ${modpack.description}</p>
            <p>Creation Date: ${modpack.creationDate}</p>
            <h2>Mod List:</h2>
            <ul>
                ${modpack.modList.map(mod => `<li>${mod}</li>`).join('')}
            </ul>
            <button id="back-button">&lt; Back</button>
        </div>
    `
}

function displayModpackPage(modpack) {
    const modpackPageHTML = createModpackPage(modpack);
    document.body.innerHTML = modpackPageHTML;
    setTimeout(() => {
        // Add an event listener to the "Back" button
        document.getElementById('back-button').addEventListener('click', displayMyModpacksPage);
    }, 0);
}

function displayMyModpacksPage() {
    document.body.innerHTML = myModpacksPageHTML;
}

ipcRenderer.on('load-modpacks', (event, modpackData, logoData) => {
    createModpackTile(modpackData, logoData);
  });

ipcRenderer.send('load-modpacks');