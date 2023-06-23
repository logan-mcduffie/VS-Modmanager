import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const modpalFolderPath = path.join(appDataPath, 'Modpal');
const modpacksDirectoryPath = path.join(modpalFolderPath, 'modpacks');

interface Modpack {
    name: string;
    author: string;
    version: string;
    creationDate: string;
    modList?: string[]; // optional if not always present
    description?: string; // optional if not always present
    logo: string;
  }

// Function to create modpack tile
export function createModpackTile(modpackData: Modpack, logoData: Buffer): void {
    // Define the path to the logo image file
    console.log(modpackData)
    const logoFilePath = path.join(modpacksDirectoryPath, modpackData.name, 'logo.png');

    // Read the logo image file
    fs.readFile(logoFilePath, (error, logoData) => {
        if (error) {
            console.error('An error occurred:', error);
            return;
        }

        // Add the click event listener to the modpack tile
        modpackTile.addEventListener('click', () => displayModpackPage({
            name: modpackData.name,
            author: modpackData.author,
            version: modpackData.version,
            creationDate: modpackData.creationDate,
            logo: URL.createObjectURL(new Blob([logoData]))
        }));
    });

    var modpackTile = document.createElement('div');
    modpackTile.className = 'modpack-tile';
    modpackTile.id = modpackData.name;
  
    var logoElement = document.createElement('img');
    logoElement.src = URL.createObjectURL(new Blob([logoData]));
    modpackTile.appendChild(logoElement);
  
    var nameElement = document.createElement('h2');
    nameElement.textContent = modpackData.name;
    modpackTile.appendChild(nameElement);
  
    var authorElement = document.createElement('p');
    authorElement.textContent = "Author: " + modpackData.author;
    modpackTile.appendChild(authorElement);
  
    let myModpacksElement = document.getElementById('my-modpacks');
        if (myModpacksElement) {
            myModpacksElement.appendChild(modpackTile);
        } else {
            console.error("Element with id 'my-modpacks' not found");
    }
}

// Function to create modpack directory
export function createModpackDirectory(): void {
    let modpackNameElement = document.getElementById('modpackName') as HTMLInputElement;
    let modpackLogoElement = document.getElementById('modpackLogo') as HTMLInputElement;

    if (modpackNameElement && modpackLogoElement && modpackLogoElement.files) {
        var modpackName = modpackNameElement.value;
        var modpackLogo = modpackLogoElement.files[0];
    
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

    } else {
        console.error("Element with id 'modpackName' or 'modpackLogo' not found");
    }
}

// Function to create modpack page
export function createModpackPage(modpack: Modpack): string {
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
export function displayModpackPage(data: Modpack): void {
    console.log(data)
    const modpackPageHTML = createModpackPage(data);
    const myModpacksElement = document.getElementById('my-modpacks');
    const modpackContent = document.getElementById('modpack-content');
    const myModpacksButtonElement = document.getElementById('my-modpacks-button');

    if (myModpacksElement) {
        myModpacksElement.style.display = 'none'; // Hide "My Modpacks" page
    }

    if (modpackContent) {
        modpackContent.innerHTML = modpackPageHTML;
        modpackContent.style.display = 'grid'; // Show modpack page
    }

    if (myModpacksButtonElement) {
        myModpacksButtonElement.classList.remove('active');
    }
}


// Function to remove modpack
export function removeModpack(modpackName: string): void {
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
export function updateModpack(modpackName: string): void {
    console.log("IM WHAT YOU'RE LOOKING FOR" + " " + modpackName)
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
            if (nameElement) {
                nameElement.textContent = manifestData.modpackName;
            }
            if (authorElement) {
                authorElement.textContent = "Author: " + manifestData.author;
            }
        }
    });
}