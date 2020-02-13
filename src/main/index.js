import fullWindow from './full-window'

const electron = require('electron')

const { app, BrowserWindow, Tray, ipcMain, dialog } = electron
const fs = require('fs')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const { setCurrentWallpaper, changeWallpaperScale } = require('../wallpaper/outwallpaper')
const { openAutoStart, openDisStart } = require('../file/auto-open')
const { downloadPic, cancelDownloadPic } = require('../file/file')
const { getUrls, cancelUrls } = require('../get-image/search')
const { newEmail } = require('./mail')

const { isDev, isMac, isWin, baseUrl } = require('../utils/utils')
const { getPaperSetting } = require('../get-image/paper')

log.transports.file.level = 'info'


let mainWindow = null
// 托盘对象
let appTray = null
let openAppFlag = true
let currentScreenIndex = 0 // 当前屏幕的索引

const mainCallBack = {
    'autoUpdater.downloadUpdate': () => {
        autoUpdater.downloadUpdate()
    },
}

appOpenInit()
ipcMainInit()
autoUpdaterInit()
setTimeIntervalInit()


/**
 * 创建程序锁，保证只能打开单个实例 
 * @function appOpenInit
 */
function appOpenInit(){
    if (isWin()) {
        const gotTheLock = app.requestSingleInstanceLock()
        if (!gotTheLock) {
            app.quit()
        } else {
            app.on('second-instance', (event, commandLine, workingDirectory) => {
                if (mainWindow) {
                    if (!mainWindow.isVisible()) {
                        mainWindowShow()
                    }
                    mainWindow.focus()
                }
            })
        }
    } else if (isMac()) {
        app.dock.hide()  
    }
    app.on('ready', () => {
        // fullWindow.openWindow()
        setTimeout(() => {
            if (!isDev()) {
                autoUpdater.logger = log
                autoUpdater.autoDownload = false
                checkUpdater()
            }
            appInit()
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
            mainWindowShow()
        }
    })
}

/**
 * 创建窗口
 * @function createWindow
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 310,
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
    })

    // mainWindow.openDevTools()

    mainWindow.loadURL(baseUrl)

    mainWindow.on('blur', () => {
        mainWindow.hide()
    })

    mainWindow.on('closed', () => {
        app.quit()
        mainWindow = null
    })
}

/**
 * 设置定时器
 */
function setTimeIntervalInit(){
    // 10s执行一次
    setInterval(() => {
        sendData('intervalTime')
    }, 10000)
}

/**
 * 创建 Tray
 * @function createAppTray
 */
function createAppTray() {
    if (isMac()) {
        // eslint-disable-next-line no-undef
        appTray = new Tray(path.resolve(__static, './img/trayTemplate.png'))
    } else if (isWin()) {
        // eslint-disable-next-line no-undef
        appTray = new Tray(path.resolve(__static, './img/tray.png'))
    }

    // 系统托盘图标目录
    appTray.on('click', (event, bounds, position) => {
        // mainWindow === null ? createWindow() : mainWindow.close()
        // return
        // 点击时显示窗口，并修改窗口的显示位置
        function setMainWinPosition(win, trayBounds) {
            try {
                const { screen } = electron
                const winWidth = mainWindow.getSize()[0]
                const winHeight = mainWindow.getSize()[1]
                const cursorPosition = screen.getCursorScreenPoint()
                const currentScreen = screen.getDisplayNearestPoint(cursorPosition)
                const screenLists = screen.getAllDisplays()

                currentScreenIndex = screenLists.findIndex(i => i.id === currentScreen.id)


                // 保证永远在图标的中心位置,因为没有做其他方向的三角，所以暂不考虑高
                cursorPosition.x = trayBounds.x + trayBounds.width / 2
                const parallelType = cursorPosition.x < currentScreen.bounds.x + currentScreen.workAreaSize.width / 2 ? 'left' : 'right'
                const verticaType = cursorPosition.y < currentScreen.bounds.y + currentScreen.workAreaSize.height / 2 ? 'top' : 'bottom'

                let trayPositionType = '' // 任务栏的位置 top|bottom|left|right
                let trayPositionSize = 0 // 任务栏的尺寸
    
                if (currentScreen.workAreaSize.height < currentScreen.size.height) {
                    trayPositionType = verticaType === 'top' ? 'top' : 'bottom'
                    trayPositionSize = currentScreen.size.height - currentScreen.workAreaSize.height
                } else if (currentScreen.workAreaSize.width < currentScreen.size.width) {
                    trayPositionType = parallelType === 'left' ? 'left' : 'right'
                    trayPositionSize = currentScreen.size.width - currentScreen.workAreaSize.width
                }
                let winPositionX = 0
                let winPositionY = 0
                if (trayPositionType === 'top') {
                    winPositionX = Math.max(Math.min(currentScreen.bounds.width + currentScreen.bounds.x - winWidth, cursorPosition.x - (winWidth / 2)), currentScreen.bounds.x)
                    winPositionY = currentScreen.bounds.y + trayPositionSize + 2
                } else if (trayPositionType === 'bottom') {
                    winPositionX = Math.max(Math.min(currentScreen.bounds.width + currentScreen.bounds.x - winWidth, cursorPosition.x - (winWidth / 2)), currentScreen.bounds.x)
                    winPositionY = currentScreen.bounds.height + currentScreen.bounds.y - trayPositionSize - winHeight
                } else if (trayPositionType === 'left') {
                    winPositionX = currentScreen.bounds.x + trayPositionSize
                    winPositionY = Math.max(Math.min(currentScreen.bounds.height + currentScreen.bounds.y - winHeight, cursorPosition.y - (winHeight / 2)), currentScreen.bounds.y)
                } else if (trayPositionType === 'right') {
                    winPositionX = currentScreen.bounds.x + currentScreen.bounds.width - trayPositionSize - winWidth
                    winPositionY = Math.max(Math.min(currentScreen.bounds.height + currentScreen.bounds.y - winHeight, cursorPosition.y - (winHeight / 2)), currentScreen.bounds.y)
                }
                log.info('--------------------------------')
                log.info('currentScreen:', currentScreen)
                log.info('position:', winPositionX, winPositionY)
                log.info('trayPositionType:', trayPositionType)
                log.info('trayPositionSize', trayPositionSize)
                log.info('cursorPosition:', cursorPosition)
                log.info('--------------------------------')
                win.setPosition(parseInt(winPositionX, 10), winPositionY)
            } catch (error) {
                log.error(error)
            }
        }
        try {
            if (mainWindow.isVisible()) {
                sendData('datainfo', {
                    type: 'windowShow',
                    data: false
                })
                mainWindowHide()
            } else {
                sendData('datainfo', {
                    type: 'windowShow',
                    data: true
                })
                mainWindowShow()
                setMainWinPosition(mainWindow, bounds)
            }
        } catch (error) {
            log.error(error)
        }
    })

    mainWindow.on('show', () => {
        appTray.setHighlightMode('never')
    })
    mainWindow.on('hide', () => {
        appTray.setHighlightMode('selection')
    })
}


function appInit() {
    if (mainWindow == null) {
        createWindow() // 创建主窗口
    } else {
        mainWindowShow()
    }
    if (appTray == null) {
        createAppTray() // 创建系统托盘    
    }
}

/**
 * 给所有的的渲染进程发消息
 */
function sendData(...args){
    const fullWindowWindow = fullWindow.getWindow()
    const windows = [mainWindow, fullWindowWindow]
    windows.forEach((i) => {
        if (i){
            i.webContents.send(...args) 
        }
    })
}

/**
 * 主窗口显示，创建一个动画效果
 */
function mainWindowShow() {
    let opacity = 0
    mainWindow.show()
    const time = setInterval(() => {
        if (opacity >= 1) {
            opacity = 1
            clearInterval(time)
        }
        mainWindow.setOpacity(opacity)
        opacity = parseFloat((opacity + 0.1).toFixed(1))
    }, 80)
}

/**
 * 主窗口隐藏，创建一个动画效果
 */
function mainWindowHide() {
    let opacity = 1
    const time = setInterval(() => {
        if (opacity <= 0) {
            opacity = 0.0
            clearInterval(time)
            mainWindow.hide()
        }
        mainWindow.setOpacity(opacity)
        opacity = parseFloat((opacity - 0.1).toFixed(1))
    }, 80)
}


function ipcMainInit() {
    /** * 主进程传一个字符串给渲染进程，渲染进程在传递事件给主进程 用于主进程中的一些函数回调 */
    ipcMain.on('maincallback', (event, data, argument) => {
        if (typeof mainCallBack[data] !== 'undefined') {
            mainCallBack[data](argument)
        }
    })

    // 取消所有请求
    // eslint-disable-next-line no-unused-vars
    ipcMain.on('cancelAllRequest', (event, data) => {
        cancelDownloadPic()
        cancelUrls()
    })

    ipcMain.on('fullWindow', (event, data) => {
        if (data){
            fullWindow.openWindow()
        }
        else {
            fullWindow.closeWindow()
        }
    })


    ipcMain.on('dataWallpaper', (event, arg) => {
        downloadPic(arg.downloadUrl, sendData).then((filePath) => {
            const { options } = arg
            if (isMac() && options.isAutoSet === false){
                setCurrentWallpaper(filePath, {
                    ...options,
                    screen: currentScreenIndex,
                })
            }
            else {
                setCurrentWallpaper(filePath)
            }
            
            log.info(`设置壁纸成功:${filePath}`)
            event.sender.send('dataWallpaper', 'success')
        }).catch((error) => {
            log.error(`设置壁纸失败:${arg.downloadUrl}`)
            log.error(error)
            event.sender.send('dataWallpaper', 'error')
        })
    })

    ipcMain.on('getImageUrls', (event, data) => {
        getUrls(data).then((result) => {
            sendData('datainfo', {
                type: 'urls',
                data: result
            })
        }).catch(() => {
            sendData('datainfo', {
                type: 'urlsError',
                data: ''
            })
        })
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
                openAutoStart()
            } else {
                openDisStart()
            }
        } else if (data.type === 'newEmail') {
            newEmail(data.data.data, data.data.telUser, {
                version: autoUpdater.currentVersion,
                emailType: data.data.emailType
            }).then(() => {
                event.sender.send('sendnewEmail', 'success', data.data.emailType)
            }).catch((error) => {
                event.sender.send('sendnewEmail', 'error', data.data.emailType, error)
            })
        } else if (data.type === 'checkNewVersion') {
            checkUpdater()
        }
        else if (data.type === 'setDefaultDownPath'){
            mainWindow.setAlwaysOnTop(false)
            dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory', 'promptToCreate'], 
                message: '选择要下载图片所在文件夹',
                defaultPath: data.data },
            (paths) => {
                mainWindow.setAlwaysOnTop(true)
                if (paths){
                    // 清空原目录中的文件
                    delPath(data.data)
                    event.sender.send('defaultPath', paths[0])
                }
            }, mainWindow)
        }
        else if (data.type === 'deleteFile'){
            delPath(data.data)
        }

        else if (data.type === 'changeWallpaperScale'){
            changeWallpaperScale({ scale: data.data })
        }
    })

    // 渲染函数运行过来
    ipcMain.on('runFunc', async (event, data) => {
        // 存放一些函数
        const FUNCLIST = {
            getPaperSetting, // 获取paper的设置
        }
        if (FUNCLIST[data]){
            FUNCLIST[data]().then((result) => {
                event.returnValue = result
            }).catch(() => {
                event.returnValue = false
            })
        }
    })
}

function checkUpdater() {
    autoUpdater.checkForUpdates().then((result) => {
    }).catch((error) => {
        log.error(error)
    })
}

function autoUpdaterInit() {
    /** * 下载完成 */
    autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall()
    })

    autoUpdater.on('error', (info) => {
        if (openAppFlag) {
            openAppFlag = false
            return
        }
        dialog.showMessageBox({
            type: 'error',
            buttons: ['关闭'],
            title: '版本更新',
            message: '版本更新检测出错',
            detail: '可能是网路不好或者版本Bug,请提交意见反馈',
            // eslint-disable-next-line no-undef
            icon: path.resolve(__static, './img/banben.png')
        })
    })


    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox({
            type: 'info',
            buttons: ['是', '否'],
            title: '版本更新',
            message: `当前版本:${autoUpdater.currentVersion}`,
            detail: `检测到新版本:${info.version},是否升级？`,
            // eslint-disable-next-line no-undef
            icon: path.resolve(__static, './img/banben.png')
        }, (response) => {
            if (response === 0) {
                autoUpdater.downloadUpdate()
            } else if (response === 1) {
                console.log('1')
            }
        })
        log.info('检测到新版本', info)
    })

    autoUpdater.on('checking-for-update', (info) => {
        log.info('检测更新已发出', info)
    })


    autoUpdater.on('update-not-available', (info) => {
        if (openAppFlag) {
            openAppFlag = false
            return
        }
        log.error('没有检测到新版本', info)
        dialog.showMessageBox({
            type: 'info',
            buttons: ['关闭'],
            title: '版本更新',
            message: `当前版本:${autoUpdater.currentVersion}`,
            detail: '当前已是最新版本，无需更新',
            // eslint-disable-next-line no-undef
            icon: path.resolve(__static, './img/banben.png')
        })
    })


    // 更新下载进度
    autoUpdater.on('download-progress', (progressObj) => {
        sendData('datainfo', {
            type: 'updaterProgress',
            data: progressObj.percent
        })
    })
}

/**
 * 删除指定目录
 * @param {String} filePath 
 */
function delPath(filePath){
    if (!fs.existsSync(filePath)){
        return '路径不存在'
    }
    const info = fs.statSync(filePath)
    if (info.isDirectory()){ // 目录
        const data = fs.readdirSync(filePath)
        if (data.length > 0){
            for (let i = 0; i < data.length; i++) {
                if (data[i].match('SW-')){
                    delPath(`${filePath}/${data[i]}`) // 使用递归
                    if (i === data.length - 1){ // 删了目录里的内容就删掉这个目录
                        delPath(`${filePath}`)
                    }
                }
            }
        } else {
            fs.rmdirSync(filePath)// 删除空目录
        }
    } else if (info.isFile()){
        fs.unlinkSync(filePath)// 删除文件
    }
    return true
}
