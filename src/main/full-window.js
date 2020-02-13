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
    })
    // fullWindow.openDevTools()
    fullWindow.loadURL(`${baseUrl}#/full`)

    fullWindow.on('close', () => {
        fullWindow = null
    })
}

function openWindow(){
    if (!fullWindow){
        createWindow()
        fullWindow.openDevTools()
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
