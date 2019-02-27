const electron = require('electron');
const {
  app,
  BrowserWindow,
  Tray,
  ipcMain,
  dialog
} = electron

const path = require('path');

const {
  autoUpdater
} = require("electron-updater");

const {
  setOnCurrentSpace
} = require('../wallpaper/outwallpaper.js')

const {
  open_autoStart,
  open_disStart
} = require('../file/open-start.js')

const {
  downloadPic
} = require('../file/file.js');

const {
  get_urls
} = require('../get-image/search.js')

const {
  hideChildrenWindow,
  showChildrenWinndow
} = require('./info-win.js')

const {
  newEmail
} = require('./mail.js')


const utils = require('../utils/utils.js');
const {
  isDev
} = require('../utils/utils.js');

const log = require("electron-log");
log.transports.file.level = "info";



//托盘对象
var mainWindow = null;
var appTray = null;
var openAppFlag = true;

const mainCallBack = {
  'autoUpdater.downloadUpdate': (data) => {
    autoUpdater.downloadUpdate()
  },
}


ipcMainInit();
autoUpdaterInit();

/*** 创建程序锁，保证只能打开单个实例 */
if (utils.isWin()) {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (!mainWindow.isVisible()) {
          mainWindow_show();
        }
        mainWindow.focus();
      }
    })

    app.on('ready', function () {
      setTimeout(() => {
        if (!isDev()) {
          autoUpdater.logger = log;
          autoUpdater.autoDownload = false;
          checkUpdater();
        }
        app_init();
      }, 10)

    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    })

    app.on('activate', () => {
      if (mainWindow === null) {
        app_init();
      } else {
        mainWindow_show();
      }
    })
  }
} else if (utils.isMac()) {
  app.dock.hide();
  app.on('ready', function () {
    setTimeout(() => {
      if (!isDev()) {
        autoUpdater.logger = log;
        autoUpdater.autoDownload = false;
        checkUpdater();
      }
      app_init();
    }, 10)

  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      app_init();
    } else {
      mainWindow_show();
    }
  })

}





function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    // useContentSize: true,
    width: 300,
    // width: 800,
    frame: false,
    transparent: true,
    show: false,
    alwaysOnTop: true,
    resizable: false, //禁止变化尺寸
    hasShadow: true, //是否阴影
    focusable: true,
    fullscreenable: false,
    skipTaskbar: true,
    titleBarStyle: 'customButtonsOnHover'
  })

  // mainWindow.openDevTools();

  mainWindow.loadURL(utils.base_url)

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });

  mainWindow.on('closed', () => {
    app.quit();
    mainWindow = null;
  })
}

function createAppTray() {
  if (utils.isMac()) {
    appTray = new Tray(path.resolve(__static, './img/tray.png'));


    log.info(app.dock.isVisible());

  } else if (utils.isWin()) {
    appTray = new Tray(path.resolve(__static, './img/tray.ico'));
  }



  //系统托盘图标目录
  appTray.on('click', (event, bounds, position) => {
    log.info(event, bounds, position);
    // mainWindow === null ? createWindow() : mainWindow.close();
    // return;
    // 点击时显示窗口，并修改窗口的显示位置
    try {
      if (mainWindow.isVisible()) {
        mainWindow.webContents.send('datainfo', {
          type: 'windowShow',
          data: false
        })
        mainWindow_hide();
      } else {
        mainWindow.webContents.send('datainfo', {
          type: 'windowShow',
          data: true
        })
        mainWindow_show();
        setMainWinPosition(mainWindow, bounds);
      }
    } catch (error) {
      log.error(error);
    }

    function setMainWinPosition(win, trayBounds) {
      try {
        const {
          screen
        } = electron;
        const win_width = mainWindow.getSize()[0];
        const win_height = mainWindow.getSize()[1];
        const cursorPosition = screen.getCursorScreenPoint();
        const currentScreen = screen.getDisplayNearestPoint(cursorPosition);
        const screens = screen.getAllDisplays();

        log.info(screens);

        let screenWidth = 0;
        let screenHeight = 0;

        // 这目前判断多屏都是横着拼的多屏,
        for (let i = 0; i < screens.length; i++) {
          screenWidth += screens[i].workAreaSize.width;
        }

        cursorPosition.x = trayBounds.x + trayBounds.width / 2;

        var parallel_type = cursorPosition.x < screenWidth / 2 ? 'left' : 'right';
        var vertica_type = cursorPosition.y < currentScreen.workAreaSize.height / 2 ? 'top' : 'bottom';

        var trayPositionType = ''; //任务栏的位置
        var trayPositionSize = 0;
        if (currentScreen.workAreaSize.height < currentScreen.size.height) {
          trayPositionType = vertica_type === 'top' ? 'top' : 'bottom';
          trayPositionSize = currentScreen.size.height - currentScreen.workAreaSize.height;
        } else if (currentScreen.workAreaSize.width < currentScreen.size.width) {
          trayPositionType = parallel_type === 'left' ? 'left' : 'right';
          trayPositionSize = currentScreen.size.width - currentScreen.workAreaSize.width;
        }

        var winPositionX = 1;
        var winPositionY = 1;



        if (trayPositionType == 'top') {
          winPositionX = Math.max(Math.min(screenWidth - win_width, cursorPosition.x - (win_width / 2)), 1);
          winPositionY = trayBounds.width + trayBounds.y + 2;
        } else if (trayPositionType == 'bottom') {
          winPositionX = Math.max(Math.min(screenWidth - win_width, cursorPosition.x - (win_width / 2)), 1);
          winPositionY = currentScreen.size.height - trayPositionSize - win_height;
        } else if (trayPositionType == 'left') {
          winPositionX = trayPositionSize;
          winPositionY = Math.max(Math.min(currentScreen.size.height - win_height, cursorPosition.y - (win_height / 2)), 1);
        } else if (trayPositionType == 'right') {
          winPositionX = screenWidth - trayPositionSize - win_width;
          winPositionY = Math.max(Math.min(currentScreen.size.height - win_height, cursorPosition.y - (win_height / 2)), 1);
        }

        log.info(currentScreen, winPositionX, winPositionY, cursorPosition, screenWidth);

        win.setPosition(winPositionX, winPositionY);
      } catch (error) {
        log.error(error)
      }

    }
    return;

  })

  mainWindow.on('show', () => {
    appTray.setHighlightMode('never')
  })
  mainWindow.on('hide', () => {
    appTray.setHighlightMode('selection')
  })
}


function app_init() {
  if (mainWindow == null) {
    createWindow(); //创建主窗口
  } else {
    mainWindow_show();
  }
  if (appTray == null) {
    createAppTray(); //创建系统托盘    
  }
}

function mainWindow_show() {
  let opacity = 0;
  mainWindow.show();
  let time = setInterval(() => {
    if (opacity >= 1) {
      opacity = 1;
      clearInterval(time);
    }
    mainWindow.setOpacity(opacity);
    opacity = parseFloat((opacity + 0.1).toFixed(1));
  }, 30)
}

function mainWindow_hide() {
  let opacity = 1;
  let time = setInterval(() => {
    if (opacity <= 0) {
      opacity = 0.0;
      clearInterval(time);
      mainWindow.hide();
    }
    mainWindow.setOpacity(opacity);
    opacity = parseFloat((opacity - 0.1).toFixed(1));
  }, 30)
}


function ipcMainInit() {
  /*** 主进程传一个字符串给渲染进程，渲染进程在传递事件给主进程 用于主进程中的一些函数回调 */
  ipcMain.on('maincallback', (event, data, argument) => {
    if (typeof mainCallBack[data] != 'undefined') {
      mainCallBack[data](argument);
    }
  })


  ipcMain.on('dataWallpaper', (event, arg) => {
    downloadPic(arg.downloadUrl, mainWindow).then((result) => {
      console.log(result);
      setOnCurrentSpace(result);
      event.sender.send('dataWallpaper', 'success');
      log.info('设置壁纸成功');
    }).catch(error => {
      log.error(error);
    })
  })

  ipcMain.on('getImageUrls', (event, data) => {
    get_urls(data).then(result => {
      mainWindow.webContents.send('datainfo', {
        type: 'urls',
        data: result
      })
    })
    log.info(data);
  })

  ipcMain.on('btn', (event, data) => {
    log.info(data);
    if (data.type == 'quit') {
      app.quit();
    } else if (data.type == 'searchKey') {

    } else if (data.type == 'openStart') {
      if (data.data) {
        open_autoStart();
      } else {
        open_disStart();
      }
    } else if (data.type == 'openChildren') {
      if (data.data) {
        showChildrenWinndow();
      } else {
        hideChildrenWindow();
      }
    } else if (data.type == 'newEmail') {
      newEmail(data.data.html, data.data.telUser, {
        version: autoUpdater.currentVersion,
        emailType: data.data.emailType
      }).then(result => {
        event.sender.send('sendnewEmail', 'success', data.data.emailType);
      }).catch(error => {
        event.sender.send('sendnewEmail', 'error', data.data.emailType, error);
      })
    } else if (data.type == 'check_newVersion') {
      checkUpdater();
    }
  })
}

function checkUpdater() {
  autoUpdater.checkForUpdates().then(result => {
    log.info(result);
  }).catch(error => {
    log.error('-----------xxxx')
    log.error(error)
  })

}

function autoUpdaterInit() {

  /*** 下载完成 */
  autoUpdater.on('update-downloaded', () => {
    log.info('下载完成:');
    autoUpdater.quitAndInstall();
  })

  autoUpdater.on('error', function (info) {
    log.error('版本错误:');
    log.error(info);
    if (openAppFlag) {
      openAppFlag = false;
      return;
    }
    dialog.showMessageBox({
      type: 'error',
      buttons: ['关闭'],
      title: '版本更新',
      message: `版本更新检测出错`,
      detail: '可能是网路不好或者版本Bug,请提交意见反馈',
      icon: path.resolve(__static, './img/banben.png')
    });
  });


  autoUpdater.on('update-available', function (info) {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['是', '否'],
      title: '版本更新',
      message: `当前版本:${autoUpdater.currentVersion}`,
      detail: `检测到新版本:${info.version},是否升级？`,
      icon: path.resolve(__static, './img/banben.png')
    }, function (response) {
      if (response == 0) {
        autoUpdater.downloadUpdate();
      } else if (response == 1) {
        return;
      }
    });

    log.info('检测到新版本', info);
  });

  autoUpdater.on('checking-for-update', function (info) {
    log.info('检测更新已发出', info);
  });


  autoUpdater.on('update-not-available', function (info) {
    if (openAppFlag) {
      openAppFlag = false;
      return;
    }
    log.error('没有检测到新版本', info);
    dialog.showMessageBox({
      type: 'info',
      buttons: ['关闭'],
      title: '版本更新',
      message: `当前版本:${autoUpdater.currentVersion}`,
      detail: '当前已是最新版本，无需更新',
      icon: path.resolve(__static, './img/banben.png')
    });
  });


  //更新下载进度
  autoUpdater.on('download-progress', function (progressObj) {
    log.info('下载进度:')
    log.info(progressObj);
    mainWindow.webContents.send('datainfo', {
      type: 'updaterProgress',
      data: progressObj.percent
    })
  })
}
