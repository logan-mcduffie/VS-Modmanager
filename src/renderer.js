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
        document.getElementById('modpack-content').innerHTML = '';
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
    // Define the path to the logo image file
    const logoFilePath = path.join(modpacksDirectoryPath, manifestData.modpackName, 'logo.png');

    // Read the logo image file
    fs.readFile(logoFilePath, (error, logoData) => {
        if (error) {
            console.error('An error occurred:', error);
            return;
        }

        // Add the click event listener to the modpack tile
        modpackTile.addEventListener('click', () => displayModpackPage({
            name: manifestData.modpackName,
            author: manifestData.author,
            version: manifestData.version,
            creationDate: manifestData.creationDate,
            logo: URL.createObjectURL(new Blob([logoData.buffer]))
        }));
    });

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

    modpackTile.addEventListener('click', () => displayModpackPage(manifestData));
  
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
    console.log(modpack);
    return `
        <div id="modpack-page">
            <div id="modpack-header">
            <img id="modpack-logo" src="${modpack.logo}">
                <div id="modpack-info">
                    <h1 id="modpack-title">${modpack.name}</h1>
                    <p id="modpack-author">| ${modpack.author}</p>
                    <p id="modpack-version">${modpack.version}</p>
                    <p id="modpack-date"><i class="fa fa-clock-o"></i> ${modpack.creationDate}</p>
                    <p id="modpack-last-played"><i class="fa fa-play"></i>TBD</p>
                    <p id="modpack-game-version"><i class="fa fa-gamepad"></i>TBD</p>
                </div>
                <button id="play-button">Play</button>
                <div id="kebab-menu">
                    <button>Change Version</button>
                    <button>Open Folder</button>
                    <button>Duplicate Modpack</button>
                    <button>Delete Modpack</button>
                    <button>Export Modpack</button>
                </div>
            </div>
            <div id="modpack-content">
                <button id="overview-button">Overview</button>
                <button id="mods-button">Mods</button>
                <div id="overview-content"></div>
                <div id="mods-content"></div>
            </div>
        </div>
    `;
}

function displayModpackPage(modpack) {
    const modpackPageHTML = createModpackPage(modpack);
    document.getElementById('my-modpacks').style.display = 'none'; // Hide "My Modpacks" page
    const modpackContent = document.getElementById('modpack-content');
    modpackContent.innerHTML = modpackPageHTML;
    modpackContent.style.display = 'grid'; // Show modpack page
    document.getElementById('my-modpacks-button').classList.remove('active');
  }

ipcRenderer.on('load-modpacks', (event, modpackData, logoData) => {
    createModpackTile(modpackData, logoData);
  });

ipcRenderer.send('load-modpacks');