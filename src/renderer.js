const { BrowserWindow } = require('@electron/remote')
const myModpacksButton = document.getElementById('my-modpacks-button');
const browseModpacksButton = document.getElementById('browse-modpacks-button');

myModpacksButton.classList.add('active');

myModpacksButton.addEventListener('click', function() {
    myModpacksButton.classList.add('active');
    browseModpacksButton.classList.remove('active');
  });
  
browseModpacksButton.addEventListener('click', function() {
    browseModpacksButton.classList.add('active');
    myModpacksButton.classList.remove('active');
  });

document.getElementById('minimize').addEventListener('click', () => {
    console.log('Minimize button clicked')
    BrowserWindow.getFocusedWindow().minimize()
})

document.getElementById('maximize').addEventListener('click', () => {
    console.log('Maximize button clicked')
    let window = BrowserWindow.getFocusedWindow()
    if (window.isMaximized()) {
        window.unmaximize()
    } else {
        window.maximize()
    }
})

document.getElementById('close').addEventListener('click', () => {
    console.log('Close button clicked')
    BrowserWindow.getFocusedWindow().close()
})
