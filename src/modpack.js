"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModpack = exports.removeModpack = exports.displayModpackPage = exports.createModpackPage = exports.createModpackDirectory = exports.createModpackTile = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// Function to create modpack tile
function createModpackTile(modpackData, logoData) {
    // Define the path to the logo image file
    console.log(modpackData);
    var logoFilePath = path_1.default.join(modpacksDirectoryPath, modpackData.name, 'logo.png');
    // Read the logo image file
    fs_1.default.readFile(logoFilePath, function (error, logoData) {
        if (error) {
            console.error('An error occurred:', error);
            return;
        }
        // Add the click event listener to the modpack tile
        modpackTile.addEventListener('click', function () { return displayModpackPage({
            name: modpackData.name,
            author: modpackData.author,
            version: modpackData.version,
            creationDate: modpackData.creationDate,
            logo: URL.createObjectURL(new Blob([logoData]))
        }); });
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
    var myModpacksElement = document.getElementById('my-modpacks');
    if (myModpacksElement) {
        myModpacksElement.appendChild(modpackTile);
    }
    else {
        console.error("Element with id 'my-modpacks' not found");
    }
}
exports.createModpackTile = createModpackTile;
// Function to create modpack directory
function createModpackDirectory() {
    var modpackNameElement = document.getElementById('modpackName');
    var modpackLogoElement = document.getElementById('modpackLogo');
    if (modpackNameElement && modpackLogoElement && modpackLogoElement.files) {
        var modpackName = modpackNameElement.value;
        var modpackLogo = modpackLogoElement.files[0];
        // Read the logo file into a Buffer
        fs_1.default.readFile(modpackLogo.path, function (error, data) {
            if (error) {
                console.error('An error occurred:', error);
                return;
            }
            // Send a 'create-modpack' message to the main process with the modpack name and logo
            ipcRenderer.send('create-modpack', modpackName, data);
        });
        ipcRenderer.on('create-modpack-reply', function (event, message) {
            console.log(message);
        });
    }
    else {
        console.error("Element with id 'modpackName' or 'modpackLogo' not found");
    }
}
exports.createModpackDirectory = createModpackDirectory;
// Function to create modpack page
function createModpackPage(modpack) {
    // console.log(modpack);
    // console.log(modpack.logo)
    return "\n        <div id=\"modpack-page\">\n            <div id=\"modpack-header\">\n            <img id=\"modpack-logo\" src=\"".concat(modpack.logo, "\">\n                <div id=\"modpack-info\">\n                    <h1 id=\"modpack-title\">").concat(modpack.name, "</h1>\n                    <p id=\"modpack-author\">| ").concat(modpack.author, "</p>\n                    <p id=\"modpack-version\">").concat(modpack.version, "</p>\n                    <p id=\"modpack-date\"><i class=\"fa fa-clock-o\"></i> ").concat(modpack.creationDate, "</p>\n                    <p id=\"modpack-last-played\"><i class=\"fa fa-play\"></i>TBD</p>\n                    <p id=\"modpack-game-version\"><i class=\"fa fa-gamepad\"></i>TBD</p>\n                </div>\n                <button id=\"play-button\">Play</button>\n                <div id=\"kebab-menu\">\n                    <button>Change Version</button>\n                    <button>Open Folder</button>\n                    <button>Duplicate Modpack</button>\n                    <button>Delete Modpack</button>\n                    <button>Export Modpack</button>\n                </div>\n            </div>\n            <div id=\"modpack-content\">\n                <button id=\"overview-button\">Overview</button>\n                <button id=\"mods-button\">Mods</button>\n                <div id=\"overview-content\"></div>\n                <div id=\"mods-content\"></div>\n            </div>\n        </div>\n    ");
}
exports.createModpackPage = createModpackPage;
// Function to display modpack page
function displayModpackPage(data) {
    console.log(data);
    var modpackPageHTML = createModpackPage(data);
    var myModpacksElement = document.getElementById('my-modpacks');
    var modpackContent = document.getElementById('modpack-content');
    var myModpacksButtonElement = document.getElementById('my-modpacks-button');
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
exports.displayModpackPage = displayModpackPage;
// Function to remove modpack
function removeModpack(modpackName) {
    console.log("Attempting to remove modpack \"".concat(modpackName, "\""));
    // Get the modpack tile element
    var modpackTile = document.getElementById(modpackName);
    console.log("Modpack tile:", modpackTile);
    if (modpackTile) {
        // Remove the modpack tile from the modpack list in "My Modpacks"
        modpackTile.remove();
        console.log("Removed modpack \"".concat(modpackName, "\""));
    }
    else {
        console.log("Could not find modpack \"".concat(modpackName, "\""));
    }
}
exports.removeModpack = removeModpack;
// Function to update modpack
function updateModpack(modpackName) {
    console.log("IM WHAT YOU'RE LOOKING FOR" + " " + modpackName);
    // Read the updated manifest
    var manifestPath = path_1.default.join(modpacksDirectoryPath, modpackName, 'manifest.json');
    fs_1.default.readFile(manifestPath, 'utf8', function (err, data) {
        if (err) {
            console.error("Failed to read manifest for modpack \"".concat(modpackName, "\":"), err);
            return;
        }
        // Parse the manifest data
        var manifestData = JSON.parse(data);
        // Get the modpack tile element
        var modpackTile = document.getElementById(modpackName);
        if (modpackTile) {
            // Update the associated text (like modpack name and author)
            var nameElement = modpackTile.querySelector('.modpack-name');
            var authorElement = modpackTile.querySelector('.modpack-author');
            if (nameElement) {
                nameElement.textContent = manifestData.modpackName;
            }
            if (authorElement) {
                authorElement.textContent = "Author: " + manifestData.author;
            }
        }
    });
}
exports.updateModpack = updateModpack;
