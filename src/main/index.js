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
} = require('../file/file2.js');

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
const {log, isDev} = require('../utils/utils.js');


//托盘对象
var mainWindow=null; 
var appTray = null;
var openAppFlag = true;

const mainCallBack = {
  'autoUpdater.downloadUpdate': (data) => {
    autoUpdater.downloadUpdate()
  },
}


ipcMainInit();
autoUpdaterInit();

if (utils.isMac()) {
  app.dock.hide();
} 
app.on('ready', function () {
  if(!isDev()){
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;
    checkUpdater();
}
  app_init();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    app_init();
  }
})

function createWindow() {
  /**
   * Initial window options
   */
  if (utils.isMac()) {
    mainWindow = new BrowserWindow({
      height: 600,
      useContentSize: true,
      // width: 300,
      width: 300,
      frame: false,
      show: false,
      transparent: true,
      resizable: false, //禁止变化尺寸
      hasShadow: false, //是否阴影
      thickFrame: false,
      scrollBounce: true,
      backgroundColor: '#222',
      alwaysOnTop: true,
      focusable: true,
      fullscreenable: false,
      skipTaskbar: true,
      hasShadow: true,
      vibrancy: 'medium-light',
    })

    mainWindow.on('blur', () => {
      mainWindow.hide();
    });
  } else if (utils.isWin()) {
    mainWindow = new BrowserWindow({
      height: 600,
      useContentSize: true,
      // width: 280,
      width: 500,
      // transparent: true,
      resizable: false, //禁止变化尺寸
      hasShadow: false, //是否阴影
      thickFrame: false,
      scrollBounce: true,
      backgroundColor: '#222',
      fullscreenable: false,
      skipTaskbar: true,
      hasShadow: true,
      vibrancy: 'medium-light',
    })
  }


  // mainWindow.openDevTools();

  mainWindow.loadURL(utils.base_url)

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

function createAppTray() {
  if (utils.isMac()) {
    appTray = new Tray(path.resolve(__static, './img/tray.png'));
  } else if (utils.isWin()) {
    appTray = new Tray(path.resolve(__static, './img/tray.ico'));
  }

  //系统托盘图标目录
  appTray.on('click', () => {
    // mainWindow === null ? createWindow() : mainWindow.close();
    // return;
    // 点击时显示窗口，并修改窗口的显示位置
    if (utils.isMac()) {
      const {
        screen
      } = electron;
      const {
        width,
        height
      } = screen.getPrimaryDisplay().workAreaSize;

      log.info(width, height)

      const WINDOW_WIDTH = mainWindow.getSize()[0];
      const WINDOW_HEIGHT = mainWindow.getSize()[1];

      log.info(screen.getAllDisplays());

      const cursorPosition = screen.getCursorScreenPoint();
      // 计算位置
      function getTrayPosX() {
        return cursorPosition.x-(WINDOW_WIDTH/2);
      }

      function getTrayPosY() {
        return 25;
      }

      mainWindow.setPosition(getTrayPosX(), getTrayPosY());
    } else if (utils.isWin()) {

    }

    if (mainWindow.isVisible()) {
      mainWindow.webContents.send('datainfo', {
        type: 'windowShow',
        data: false
      })
      mainWindow.hide();
    } else {
      mainWindow.webContents.send('datainfo', {
        type: 'windowShow',
        data: true
      })
      mainWindow.show();
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
  createWindow(); //创建主窗口
  createAppTray(); //创建系统托盘
}


function ipcMainInit() {
  /*** 主进程传一个字符串给渲染进程，渲染进程在传递事件给主进程 用于主进程中的一些函数回调 */
  ipcMain.on('maincallback', (event, data, argument) => {
    if (typeof mainCallBack[data] != 'undefined') {
      mainCallBack[data](argument);
    }
  })


  ipcMain.on('dataWallpaper', (event, arg) => {
    downloadPic(arg.downloadUrl, function (result) {
      setOnCurrentSpace(result);
      event.sender.send('dataWallpaper', 'success');
    });
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
        version: autoUpdater.currentVersion
      }).then(result => {
        event.sender.send('sendnewEmail', 'success');
      }).catch(error => {
        event.sender.send('sendnewEmail', 'error', error);
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
function autoUpdaterInit(){

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
    detail: '可能是网路不好火灾版本Bug,请提交意见反馈',
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



