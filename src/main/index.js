/**
 *  功能：主渲染程序逻辑
 *  作者：--
 *  日期：2020/9/30
 */

const electron = require('electron')
const { Icon } = require('./utils')
const { isDev, isMac, isWin, log } = require('../power/utils')
const { checkUpdater, autoUpdater } = require('./update')

const CreateMainWindow = require('./main-window')
const CreateFullWindow = require('./full-window')
const CreateAppTray = require('./tray')

const { app, ipcMain, dialog } = electron

let appTray = null
let mainWindow = null
let fullWindow = null
const openAppFlag = true

appOpenInit()
ipcMainInit()

setTimeIntervalInit()

/**
 * 创建程序锁，保证只能打开单个实例 
 * @function appOpenInit
 */
function appOpenInit(){
    if (isWin) {
        const gotTheLock = app.requestSingleInstanceLock()
        if (!gotTheLock) {
            app.quit()
        } else {
            app.on('second-instance', (event, commandLine, workingDirectory) => {
                if (mainWindow) {
                    if (!mainWindow.isVisible()) {
                        mainWindow.animateShow()
                    }
                    mainWindow.focus()
                }
            })
        }
    } else if (isMac) {
        app.on('will-continue-activity', (e) => {
            e.preventDefault()
            console.log(e)
        }) 
    }
    app.on('ready', () => {
        // fullWindow.openWindow()
        if (isMac && isDev) {
            if (isDev){
                app.dock.setIcon(Icon('./img/iconTemplate.png', 128))
            } else {
                app.dock.hide() 
            }
        }
        setTimeout(() => {
            appInit()
            if (!isDev) {
                autoUpdater.logger = log
                autoUpdater.autoDownload = false
                mainWindow.sendData('app-ready')
            }
        }, 10)
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })


    app.on('activate', () => {
        if (mainWindow === null) {
            appInit()
        } else {
            mainWindow.animateShow()
        }
    })
}

/**
 * 给所有的的渲染进程发消息
 */
function sendDataAll(...args){
    [mainWindow, fullWindow].forEach((i) => {
        if (i){
            i.sendData(...args) 
        }
    })
}


/**
 * 设置定时器
 */
function setTimeIntervalInit(){
    // 10s执行一次
    setInterval(() => {
        sendDataAll('intervalTime')
    }, 10000)
}


function appInit() {
    if (!mainWindow){
        mainWindow = new CreateMainWindow()
    }
    mainWindow.animateShow()
    if (appTray == null) {
        appTray = new CreateAppTray(mainWindow) // 创建系统托盘    
    }
}


function ipcMainInit() {
    /** * 主进程传一个字符串给渲染进程，渲染进程在传递事件给主进程 用于主进程中的一些函数回调 */
    ipcMain.on('maincallback', (event, data, argument) => {
        // if (typeof mainCallBack[data] !== 'undefined') {
        //     mainCallBack[data](argument)
        // }
    })

    // 取消所有请求
    // eslint-disable-next-line no-unused-vars
    ipcMain.on('cancelAllRequest', (event, data) => {
        // cancelDownloadPic()
        // cancelUrls()
    })

    ipcMain.on('fullWindow', (event, data) => {
        if (!fullWindow){
            fullWindow = new CreateFullWindow()
        }
        if (data){
            fullWindow.show()
        }
        else {
            fullWindow.hide()
        }
    })


    ipcMain.on('dataWallpaper', (event, arg) => {
        // downloadPic(arg.downloadUrl, sendData, arg.userConfig).then((filePath) => {
        //     const { options } = arg
        //     if (isMac && options.autoSetAllScreens === false){
        //         setCurrentWallpaper(filePath, {
        //             ...options,
        //             screen: currentScreenIndex,
        //         })
        //     }
        //     else {
        //         setCurrentWallpaper(filePath)
        //     }
            
        //     log.info(`设置壁纸成功:${filePath}`)
        //     event.sender.send('dataWallpaper', 'success')
        // }).catch((error) => {
        //     log.error(`设置壁纸失败:${arg.downloadUrl}`)
        //     log.error(error)
        //     event.sender.send('dataWallpaper', 'error')
        // })
    })

    ipcMain.on('getImageUrls', (event, data) => {
        // getUrls(data).then((result) => {
        //     sendData('datainfo', {
        //         type: 'urls',
        //         data: result
        //     })
        // }).catch(() => {
        //     sendData('datainfo', {
        //         type: 'urlsError',
        //         data: ''
        //     })
        // })
    })

    ipcMain.on('btn', (event, data) => {
        if (data.type === 'quit') {
            // 窗口设置了closeable为false后不能退出程序，手动再设置一下
            mainWindow.setClosable(true)
            app.quit()
        // eslint-disable-next-line no-empty
        } else if (data.type === 'searchKey') {

        } else if (data.type === 'openStart') {
            if (data.data) {
                // openAutoStart()
            } else {
                // openDisStart()
            }
        } else if (data.type === 'checkNewVersion') {
            checkUpdater(data.data.version)
        }
        else if (data.type === 'setDefaultDownPath'){
           
        }
        else if (data.type === 'deleteFile'){
            // delPath(data.data)
        }
    })
}
