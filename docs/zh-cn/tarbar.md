#### 定位
```js
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
                const screens = screen.getAllDisplays()

                let screenWidth = 0

                // 这目前判断多屏都是横着拼的多屏,
                for (let i = 0; i < screens.length; i++) {
                    screenWidth += screens[i].workAreaSize.width
                }

                cursorPosition.x = trayBounds.x + trayBounds.width / 2

                const parallelType = cursorPosition.x < screenWidth / 2 ? 'left' : 'right'
                const verticaType = cursorPosition.y < currentScreen.workAreaSize.height / 2 ? 'top' : 'bottom'

                let trayPositionType = '' // 任务栏的位置
                let trayPositionSize = 0
    
                if (currentScreen.workAreaSize.height < currentScreen.size.height) {
                    trayPositionType = verticaType === 'top' ? 'top' : 'bottom'
                    trayPositionSize = currentScreen.size.height - currentScreen.workAreaSize.height
                } else if (currentScreen.workAreaSize.width < currentScreen.size.width) {
                    trayPositionType = parallelType === 'left' ? 'left' : 'right'
                    trayPositionSize = currentScreen.size.width - currentScreen.workAreaSize.width
                }

                let winPositionX = 1
                let winPositionY = 1

                if (trayPositionType === 'top') {
                    winPositionX = Math.max(Math.min(screenWidth - winWidth, cursorPosition.x - (winWidth / 2)), 1)
                    winPositionY = trayBounds.height + 2
                } else if (trayPositionType === 'bottom') {
                    winPositionX = Math.max(Math.min(screenWidth - winWidth, cursorPosition.x - (winWidth / 2)), 1)
                    winPositionY = currentScreen.size.height - trayPositionSize - winHeight
                } else if (trayPositionType === 'left') {
                    winPositionX = trayPositionSize
                    winPositionY = Math.max(Math.min(currentScreen.size.height - winHeight, cursorPosition.y - (winHeight / 2)), 1)
                } else if (trayPositionType === 'right') {
                    winPositionX = screenWidth - trayPositionSize - winWidth
                    winPositionY = Math.max(Math.min(currentScreen.size.height - winHeight, cursorPosition.y - (winHeight / 2)), 1)
                }
                win.setPosition(parseInt(winPositionX, 10), winPositionY)
            } catch (error) {
                log.error(error)
            }
        }
        try {
            if (mainWindow.isVisible()) {
                mainWindow.webContents.send('datainfo', {
                    type: 'windowShow',
                    data: false
                })
                mainWindowHide()
            } else {
                mainWindow.webContents.send('datainfo', {
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
```