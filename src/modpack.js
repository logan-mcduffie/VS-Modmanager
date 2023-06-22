const fs = require('fs');
const path = require('path');

// Function to create modpack tile
function createModpackTile(manifestData, logoData) {
    // Define the path to the logo image file
    console.log(manifestData)
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
            logo: URL.createObjectURL(new Blob([logoData]))
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

// Function to create modpack directory
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

// Function to create modpack page
function createModpackPage(modpack) {
    // console.log(modpack);
    // console.log(modpack.logo)
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

// Function to display modpack page
function displayModpackPage(manifestData) {
    console.log(manifestData)
    const modpackPageHTML = createModpackPage(manifestData);
    document.getElementById('my-modpacks').style.display = 'none'; // Hide "My Modpacks" page
    const modpackContent = document.getElementById('modpack-content');
    modpackContent.innerHTML = modpackPageHTML;
    modpackContent.style.display = 'grid'; // Show modpack page
    document.getElementById('my-modpacks-button').classList.remove('active');
}

// Function to remove modpack
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

// Function to update modpack
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

// Export functions
module.exports = {
  createModpackTile,
  createModpackDirectory,
  createModpackPage,
  displayModpackPage,
  removeModpack,
  updateModpack
};