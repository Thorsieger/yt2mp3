const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  // Création d'une fenetre en résolution 800x600 
  mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true}})

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