const { BrowserWindow } = require('@electron/remote')

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
