const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Function to start the watcher
function startWatcher(modpacksDirectoryPath) {
  // Watch the modpacks directory for changes
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
}

// Export functions
module.exports = {
  startWatcher
};