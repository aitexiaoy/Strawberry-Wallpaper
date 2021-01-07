/**
 *  功能：主窗口
 *  作者：--
 *  日期：2020/9/30
 */

const electron = require('electron')
const { baseUrl, isDev, isPro } = require('../power/utils')

const { app, BrowserWindow } = electron

const defaultOptions = {
    height: 600,
    width: 310,
    // width: 810,
    webPreferences: {
        nodeIntegration: true
    },
    frame: false,
    transparent: true,
    show: false,
    alwaysOnTop: true,
    resizable: false, // 禁止变化尺寸
    hasShadow: true, // 是否阴影
    focusable: true,
    fullscreenable: false,
    skipTaskbar: true,
    minimizable: false,
    maximizable: false,
    closable: false,
    fullscreen: false,
    titleBarStyle: 'customButtonsOnHover'
}
class CreateMainWindow extends BrowserWindow {
    constructor(props = { ...defaultOptions }){
        super(props)
        this.init()
    }

    init(){
        this.loadURL(baseUrl)
        
        this.on('closed', () => {
            app.quit()
        })

        if (isDev){
            // 延时才能加载出来vue-devtools
            setTimeout(() => {
                this.webContents.openDevTools()
            }, 2000)
        }

        if (isPro){
            this.on('blur', () => {
                this.hide()
            })
        }
    }

    /**
     * 窗口显示
     */
    animateShow() {
        let opacity = 0
        this.show()
        const time = setInterval(() => {
            if (opacity >= 1) {
                opacity = 1
                clearInterval(time)
            }
            this.setOpacity(opacity)
            opacity = parseFloat((opacity + 0.1).toFixed(1))
        }, 80)
    }
    
    /**
     * 主窗口隐藏，创建一个动画效果
     */
    animateHide() {
        let opacity = 1
        const time = setInterval(() => {
            if (opacity <= 0) {
                opacity = 0.0
                clearInterval(time)
                this.hide()
            }
            this.setOpacity(opacity)
            opacity = parseFloat((opacity - 0.1).toFixed(1))
        }, 80)
    }

    sendData(...args){
        this.webContents.send(...args) 
    }
}


module.exports = CreateMainWindow
