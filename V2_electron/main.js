const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
  // Création d'une fenetre en résolution 1133x720
  mainWindow = new BrowserWindow({
    width: 1133,
    height: 720,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })

  mainWindow.loadFile(`${__dirname}/src/index.html`)
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
require('electron-reload')(__dirname)
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
