import * as path from 'path';
import * as chokidar from 'chokidar';
import { updateModpack, removeModpack } from './modpack';

const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const modpalFolderPath = path.join(appDataPath, 'Modpal');
const modpacksDirectoryPath = path.join(modpalFolderPath, 'modpacks');


// Function to start the watcher
export function startWatcher(): void{
  // Watch the modpacks directory for changes
  const watcher = chokidar.watch(modpacksDirectoryPath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
  });

  watcher
    .on('add', (dirPath: string) => console.log(`Directory ${dirPath} has been added`))
    .on('change', (filePath: string) => {
      console.log(`File ${filePath} has been changed`);
      if (filePath.endsWith('manifest.json')) {
        const modpackName = path.basename(path.dirname(filePath));
        console.log("THIS THIS THIS " + modpackName)
        updateModpack(modpackName);
      }
    })
    .on('unlink', (path: string) => console.log(`File ${path} has been removed`))
    .on('addDir', (path: string) => console.log(`Directory ${path} has been added`))
    .on('unlinkDir', (dirPath: string) => { 
      console.log(`Directory ${dirPath} has been removed`);
      const modpackName = path.basename(dirPath);
      removeModpack(modpackName);
    }); 
}
