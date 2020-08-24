const electron = require('electron')
const { baseUrl } = require('../utils/utils')

const { BrowserWindow } = electron

let fullWindow = null

/**
 * 创建窗口
 * @function createWindow
 */
function createWindow() {
    fullWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        maximizable: true,
        minimizable: true,
    })
    fullWindow.loadURL(`${baseUrl}#/full`)

    fullWindow.on('close', () => {
        fullWindow = null
    })

    fullWindow.on('enter-full-screen', () => {
        // console.log('Jin人员')
        // fullWindow.setWindowButtonVisibility(true)
    })
}

function openWindow(){
    if (!fullWindow){
        createWindow()
        // fullWindow.openDevTools()
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

function getWindow(){
    return fullWindow
}

export default {
    openWindow,
    closeWindow,
    getWindow,
}
