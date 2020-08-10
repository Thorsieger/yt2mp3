const electron = require('electron')
const globalShortcut = electron.globalShortcut

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
  // Création d'une fenetre en résolution 1133x720
  mainWindow = new BrowserWindow({
    width: 1216,
    height: 739,
    frame: false,
    // icon: __dirname + '/src/assets/icons/app.png',
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

  globalShortcut.register('f5', function() {
		console.log('f5 is pressed')
		mainWindow.reload()
	})
	globalShortcut.register('CommandOrControl+R', function() {
		console.log('CommandOrControl+R is pressed')
		mainWindow.reload()
	})
}

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
