/**
 *  功能：全屏页面窗口
 *  作者：--
 *  日期：2020/9/30
 */
const electron = require('electron')
const { baseUrl } = require('../utils/utils')

const { BrowserWindow } = electron

const defaultOptions = {
    width: 1200,
    height: 700,
    webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
    },
    frame: false,
    maximizable: true,
    minimizable: true,

}

class CreateFullWindow extends BrowserWindow{
    constructor(props = { ...defaultOptions }){
        super(props)
        this.init()
    }

    init(){
        this.loadURL(`${baseUrl}#/full`)
        
        this.on('enter-full-screen', () => {
            // console.log('Jin人员')
            // this.setWindowButtonVisibility(true)
        })
    }
}

module.exports = CreateFullWindow
