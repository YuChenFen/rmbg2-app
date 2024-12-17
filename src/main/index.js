import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const { spawn, exec } = require('child_process')
const rootPath = process.cwd()

const EXECUTION_OPTIONS = {
  windowsHide: true,
  detached: false // 让子进程独立于父进程运行
}

let mp = '.'
if (!(is.dev && process.env['ELECTRON_RENDERER_URL'])) {
  mp = './resources'
}
const model_path = join(rootPath, `${mp}/python/main.exe`)

function createWindow() {
  const model_process = spawn(model_path, [], EXECUTION_OPTIONS)
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.setTitle('RMBG2.0-app')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('closed', (e) => {
    e.preventDefault()
    let pid = model_process.pid
    exec(`taskkill /PID ${pid} /T /F`, (error, stdout, stderr) => {
      console.log('taskkill stdout: ' + stdout)
      console.log('taskkill stderr: ' + stderr)
      if (error) {
        console.log('error: ' + error.message)
      }
    })
    app.quit()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  model_process.stdout.on('data', (data) => {
    mainWindow.webContents.send('model-log', data.toString())
  })
  model_process.stderr.on('data', (data) => {
    mainWindow.webContents.send('model-log', data.toString())
  })
}
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
