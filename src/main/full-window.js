const electron = require('electron')
const { isDev, isMac, isWin, baseUrl } = require('../utils/utils')

const { app, BrowserWindow, Tray, ipcMain, dialog } = electron

let fullWindow = null

/**
 * 创建窗口
 * @function createWindow
 */
function createWindow() {
    fullWindow = new BrowserWindow({
        width: 1200,
        height: 700,
    })
    // fullWindow.openDevTools()
    fullWindow.loadURL(`${baseUrl}/#/fullWindow`)

    fullWindow.on('close', () => {
        fullWindow = null
    })
}

function openWindow(){
    if (!fullWindow){
        createWindow()
    }
    else {
        fullWindow.show()
    }
}

function closeWindow(){
    if (fullWindow){
        fullWindow.hide()
    }
}

export default {
    openWindow,
    closeWindow,
}
