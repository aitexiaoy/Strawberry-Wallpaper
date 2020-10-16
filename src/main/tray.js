/**
 *  功能：顶部tray管理
 *  作者：--
 *  日期：2020/9/30
 */
const path = require('path')
const electron = require('electron')
const { log, isMac, isWin } = require('../power/utils')
const { Icon } = require('./utils')

const { Menu, Tray, nativeImage, app, } = electron

// eslint-disable-next-line no-nested-ternary
const trayIcon = isMac ? Icon('./img/icon-tray.png', 16) : (isWin ? path.resolve(__static, './img/tray.png') : '')

class CreateAppTray extends Tray {
    constructor(mainWindow){
        super(trayIcon)
        this.currentScreenIndex = 0
        this.init(mainWindow)
    }

    // 点击时显示窗口，并修改窗口的显示位置
    setMainWinPosition(win, trayBounds) {
        try {
            const { screen } = electron
            const winWidth = win.getSize()[0]
            const winHeight = win.getSize()[1]
            const cursorPosition = screen.getCursorScreenPoint()
            const currentScreen = screen.getDisplayNearestPoint(cursorPosition)
            const screenLists = screen.getAllDisplays()
            

            this.currentScreenIndex = screenLists.findIndex(i => i.id === currentScreen.id)

            // 保证永远在图标的中心位置,因为没有做其他方向的三角，所以暂不考虑高
            cursorPosition.x = trayBounds.x + trayBounds.width / 2
            const parallelType = cursorPosition.x < currentScreen.bounds.x + currentScreen.workAreaSize.width / 2 ? 'left' : 'right'
            const verticaType = cursorPosition.y < currentScreen.bounds.y + currentScreen.workAreaSize.height / 2 ? 'top' : 'bottom'

            let trayPositionType = '' // 任务栏的位置 top|bottom|left|right
            let trayPositionSize = 0 // 任务栏的尺寸

            if (currentScreen.workAreaSize.height < currentScreen.size.height) {
                trayPositionType = verticaType === 'top' ? 'top' : 'bottom'
                // trayPositionSize = currentScreen.size.height - currentScreen.workAreaSize.height
                trayPositionSize = currentScreen.workArea.y
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

            win.setPosition(parseInt(winPositionX, 10), winPositionY)

            log.info('--------------------------------')
            log.info('currentScreen:', currentScreen)
            log.info('position:', winPositionX, winPositionY)
            log.info('trayPositionType:', trayPositionType)
            log.info('trayPositionSize', trayPositionSize)
            log.info('cursorPosition:', cursorPosition)
            log.info('--------------------------------')
        } catch (error) {
            log.error(error)
        }
    }

    init(mainWindow){
        const icon = nativeImage.createFromPath(path.resolve(__static, './img/tray.png'))
    
        const contextMenu = Menu.buildFromTemplate([
            { label: '全屏模式', type: 'normal', icon: icon.resize({ width: 20, height: 20 }) },
            { label: '意见反馈', type: 'normal', role: 'window' },
            { label: '赞助', type: 'normal', },
            { 
                label: '退出',
                type: 'normal', 
                click(){
                    app.quit()
                } }
        ])
    
        // this.setContextMenu(contextMenu)
    
        // 系统托盘图标目录
        this.on('click', (event, bounds, position) => {
            const isVisible = mainWindow.isVisible()
            try {
                if (isVisible) {
                    mainWindow.animateHide()
                } else {
                    mainWindow.animateShow()
                    this.setMainWinPosition(mainWindow, bounds)
                }

                mainWindow.webContents.send('datainfo', {
                    type: 'windowShow',
                    data: !isVisible
                })
            } catch (error) {
                log.error(error)
            }
        })
    
        this.on('right-click', (event, bounds) => {
            if (!mainWindow.isVisible()){
                this.popUpContextMenu(contextMenu)
            }
        })
    }
}


module.exports = CreateAppTray
