'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

// Set feedUrl to the server url that you put the release app
// const feedUrl = ``

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let welcomeWindow
const welcomeUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/welcome.html`
  : `file://${__dirname}/welcome.html`
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  // 欢迎窗口：用于播放loading动画
  welcomeWindow = new BrowserWindow({
    height: 400,
    useContentSize: true,
    width: 400,
    transparent: true,
    frame: false,
    show: false
  })
  // 保持欢迎窗口的DE=evtool关闭
  welcomeWindow.webContents.on('devtools-opened', () => { welcomeWindow.webContents.closeDevTools() })
  mainWindow = new BrowserWindow({
    height: 820,
    useContentSize: true,
    width: 1200,
    transparent: true,
    frame: false,
    show: false
  })
  welcomeWindow.loadURL(welcomeUrl)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  welcomeWindow.on('closed', () => {
    welcomeWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  console.log('activate')
  if (mainWindow === null) {
    createWindow()
  }
})

var initComplete = false
var welcomeComplete = false

// 当欢迎窗口初始化完毕，他会向主进程发送 'show-welcome'
ipcMain.on('show-welcome', function (event, status) {
  console.log('show-welcome')
  welcomeWindow.show()
})

// 当应用数据库初始化完毕，它会向主进程发送 'init-complete'
ipcMain.on('init-complete', function (event, status) {
  initComplete = true
  console.log('init-complete', initComplete, welcomeComplete)
  if (initComplete && welcomeComplete) {
    if (welcomeWindow) {
      welcomeWindow.close()
    }
    mainWindow.show()
  }
})

// 当循环的欢迎动画播放完第一遍，它会向主进程发送 'welcome-complete'
ipcMain.on('welcome-complete', function (event, status) {
  welcomeComplete = true
  console.log('welcome-complete', initComplete, welcomeComplete)
  if (initComplete && welcomeComplete) {
    if (welcomeWindow) {
      welcomeWindow.close()
    }
    mainWindow.show()
  }
})

ipcMain.on('quit-app', function (event, status) {
  console.log('quit-app')
  app.quit()
})

// 主进程监听渲染进程传来的信息
ipcMain.on('checkUpdate', (e, arg) => {
  console.log('checkUpdate')
  checkForUpdates()
})

let checkForUpdates = () => {
  // 配置安装包远端服务器
  // autoUpdater.setFeedURL(feedUrl)

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function (message) {
    console.log('error', message)
    sendUpdateMessage('error', message)
  })
  autoUpdater.on('checking-for-update', function (message) {
    console.log('checking-for-update', message)
    sendUpdateMessage('checking-for-update', message)
  })
  autoUpdater.on('update-available', function (message) {
    console.log('update-available', message)
    sendUpdateMessage('update-available', message)
  })
  autoUpdater.on('update-not-available', function (message) {
    console.log('update-not-available', message)
    sendUpdateMessage('update-not-available', message)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    console.log('downloadProgress', progressObj)
    sendUpdateMessage('downloadProgress', progressObj)
  })
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function (info) {
    console.log('isUpdateNow')
    sendUpdateMessage('isUpdateNow', info)
    mainWindow.webContents.send('isUpdateNow', info)
    ipcMain.on('updateNow', (e, arg) => {
      autoUpdater.quitAndInstall()
    })
  })

  // 执行自动更新检查
  // 设置你的feedUrl并取消下面一行的注释，即可实现检查更新
  // autoUpdater.checkForUpdates()
}

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage (message, data) {
  console.log({ message, data })
  mainWindow.webContents.send('message', { message, data })
}
