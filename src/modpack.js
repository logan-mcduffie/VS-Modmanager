"use strict";
var fs = require('fs');
var path = require('path');
// Function to create modpack tile
function createModpackTile(manifestData, logoData) {
    // Define the path to the logo image file
    console.log(manifestData);
    var logoFilePath = path.join(modpacksDirectoryPath, manifestData.modpackName, 'logo.png');
    // Read the logo image file
    fs.readFile(logoFilePath, function (error, logoData) {
        if (error) {
            console.error('An error occurred:', error);
            return;
        }
        // Add the click event listener to the modpack tile
        modpackTile.addEventListener('click', function () { return displayModpackPage({
            name: manifestData.modpackName,
            author: manifestData.author,
            version: manifestData.version,
            creationDate: manifestData.creationDate,
            logo: URL.createObjectURL(new Blob([logoData]))
        }); });
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
    document.getElementById('my-modpacks').appendChild(modpackTile);
}
// Function to create modpack directory
function createModpackDirectory() {
    var modpackName = document.getElementById('modpackName').value;
    var modpackLogo = document.getElementById('modpackLogo').files[0];
    // Read the logo file into a Buffer
    fs.readFile(modpackLogo.path, function (error, data) {
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
// Function to create modpack page
function createModpackPage(modpack) {
    // console.log(modpack);
    // console.log(modpack.logo)
    return "\n        <div id=\"modpack-page\">\n            <div id=\"modpack-header\">\n            <img id=\"modpack-logo\" src=\"".concat(modpack.logo, "\">\n                <div id=\"modpack-info\">\n                    <h1 id=\"modpack-title\">").concat(modpack.name, "</h1>\n                    <p id=\"modpack-author\">| ").concat(modpack.author, "</p>\n                    <p id=\"modpack-version\">").concat(modpack.version, "</p>\n                    <p id=\"modpack-date\"><i class=\"fa fa-clock-o\"></i> ").concat(modpack.creationDate, "</p>\n                    <p id=\"modpack-last-played\"><i class=\"fa fa-play\"></i>TBD</p>\n                    <p id=\"modpack-game-version\"><i class=\"fa fa-gamepad\"></i>TBD</p>\n                </div>\n                <button id=\"play-button\">Play</button>\n                <div id=\"kebab-menu\">\n                    <button>Change Version</button>\n                    <button>Open Folder</button>\n                    <button>Duplicate Modpack</button>\n                    <button>Delete Modpack</button>\n                    <button>Export Modpack</button>\n                </div>\n            </div>\n            <div id=\"modpack-content\">\n                <button id=\"overview-button\">Overview</button>\n                <button id=\"mods-button\">Mods</button>\n                <div id=\"overview-content\"></div>\n                <div id=\"mods-content\"></div>\n            </div>\n        </div>\n    ");
}
// Function to display modpack page
function displayModpackPage(manifestData) {
    console.log(manifestData);
    var modpackPageHTML = createModpackPage(manifestData);
    document.getElementById('my-modpacks').style.display = 'none'; // Hide "My Modpacks" page
    var modpackContent = document.getElementById('modpack-content');
    modpackContent.innerHTML = modpackPageHTML;
    modpackContent.style.display = 'grid'; // Show modpack page
    document.getElementById('my-modpacks-button').classList.remove('active');
}
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
// Function to update modpack
function updateModpack(modpackName) {
    console.log("IM WHAT YOU'RE LOOKING FOR" + " " + modpackName);
    // Read the updated manifest
    var manifestPath = path.join(modpacksDirectoryPath, modpackName, 'manifest.json');
    fs.readFile(manifestPath, 'utf8', function (err, data) {
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
            nameElement.textContent = manifestData.modpackName;
            authorElement.textContent = "Author: " + manifestData.author;
        }
    });
}
// Export functions
module.exports = {
    createModpackTile: createModpackTile,
    createModpackDirectory: createModpackDirectory,
    createModpackPage: createModpackPage,
    displayModpackPage: displayModpackPage,
    removeModpack: removeModpack,
    updateModpack: updateModpack
};
