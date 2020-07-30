const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  // Création d'une fenetre en résolution 800x600 
  mainWindow = new BrowserWindow({
    width: 1133,
    height: 720,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile(`${__dirname}/src/index.html`) 

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

/
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