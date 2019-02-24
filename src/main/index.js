
const electron=require('electron');
const {app,BrowserWindow,ipcMain,Tray,dialog} =electron

const os = require('os');

const path = require('path');

const {version} =require('../../package.json')

const { autoUpdater }=require("electron-updater")

const log = require("electron-log");
log.transports.file.level = "debug";

const {setOnCurrentSpace} = require('../wallpaper/outwallpaper.js')

const {downloadPic} = require('../file/file2.js'); 

const {open_autoStart,open_disStart} =require('../file/open-start.js')

const get_urls = require('../get-image/search.js').get_urls

const {hideChildrenWindow,showChildrenWinndow}=require('./info-win.js')

const {newEmail}= require( './mail.js')

//托盘对象
var appTray = null;


const osType=os.type();

const uploadUrl = "https://swallpaper.oss-cn-beijing.aliyuncs.com/version/"; // 下载地址，不加后面的.exe


var openAppFlag=true;


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow = null;
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`


  if(osType=='Darwin'){
    app.dock.hide();
  }
  else if(osType=='Windows_NT'){
  
  }

function createWindow() {
  /**
   * Initial window options
   */
  if(osType=='Darwin'){
    mainWindow = new BrowserWindow({
      height: 600,
      useContentSize: true,
      // width: 280,
      width: 300,
      frame: false,
      transparent: true,
      resizable:false,     //禁止变化尺寸
      hasShadow: false, //是否阴影
      thickFrame: false,
      scrollBounce: true,
      backgroundColor: '#222',
      alwaysOnTop:true,
      focusable:true,
      fullscreenable:false,
      skipTaskbar:true,
      hasShadow:true,
      vibrancy:'medium-light',
    })

    mainWindow.on('blur', () => {
      mainWindow.hide();
  }); 
  }
  else if(osType=='Windows_NT'){
    mainWindow = new BrowserWindow({
      height: 600,
      useContentSize: true,
      // width: 280,
      width: 500,
      // transparent: true,
      resizable:false,     //禁止变化尺寸
      hasShadow: false, //是否阴影
      thickFrame: false,
      scrollBounce: true,
      backgroundColor: '#222',
      fullscreenable:false,
      skipTaskbar:true,
      hasShadow:true,
      vibrancy:'medium-light',
    })
  }
  

  // mainWindow.openDevTools();

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

function createAppTray() {


  createWindow();

  mainWindow.hide();

  appTray = new Tray(path.resolve(__static, './img/tray.png'));

  //系统托盘图标目录
  appTray.on('click', () => {
    // mainWindow === null ? createWindow() : mainWindow.close();
    // return;
    // 点击时显示窗口，并修改窗口的显示位置
    const {screen}=electron;
    const {
      width,
      height
    } = screen.getPrimaryDisplay().workAreaSize;

    log.info(width, height)

    const WINDOW_WIDTH = mainWindow.getSize()[0];
    const WINDOW_HEIGHT = mainWindow.getSize()[1];
    const HORIZ_PADDING = 15;
    const VERT_PADDING = 15;

    const cursorPosition = screen.getCursorScreenPoint();

    // log.info(cursorPosition,mainWindow.getSize())

    const primarySize = screen.getPrimaryDisplay().workAreaSize;
    const trayPositionVert = cursorPosition.y >= primarySize.height / 2 ? 'bottom' : 'top';
    const trayPositionHoriz = cursorPosition.x >= primarySize.width / 2 ? 'right' : 'left';

    mainWindow.setPosition(getTrayPosX(), getTrayPosY());

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
    // 计算位置
    function getTrayPosX() {
      const horizBounds = {
        left: cursorPosition.x - (WINDOW_WIDTH / 2),
        right: cursorPosition.x + (WINDOW_WIDTH / 2)
      };
      if (trayPositionHoriz === 'left') {
        return horizBounds.left <= HORIZ_PADDING ? HORIZ_PADDING : horizBounds.left;
      }
      return horizBounds.right >= primarySize.width ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH : horizBounds.right - WINDOW_WIDTH;
    }

    function getTrayPosY() {
      return trayPositionVert === 'bottom' ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING : cursorPosition.y + VERT_PADDING;
    }
    return;

  })

  mainWindow.on('show', () => {
    appTray.setHighlightMode('never')
  })
  mainWindow.on('hide', () => {
    appTray.setHighlightMode('selection')    
  })

  //图标的上下文菜单
  // const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  // appTray.setToolTip('This is my application.');

  // appTray.popUpContextMenu(mainWindow)


  //设置此图标的上下文菜单
  // appTray.setContextMenu(contextMenu);

}


app.on('ready', function () {
  // autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.logger = log;
  autoUpdater.autoDownload=false;
  if(osType=='Darwin'){
    createAppTray();
  }
  else if(osType=='Windows_NT'){
    createWindow();
  }

  checkUpdater();
  
})




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createAppTray();
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

  } 
  else if (data.type == 'openStart') {
    if (data.data) {
      open_autoStart();
    } else {
      open_disStart();
    }
  }
  else if(data.type=='openChildren'){
    if(data.data){
      showChildrenWinndow()
    }
    else{
      hideChildrenWindow()
    }
  }
  else if(data.type=='newEmail'){
    newEmail(data.data.html,data.data.telUser,{
      version:version,
    }).then(result=>{
      event.sender.send('sendnewEmail', 'success');
    }).catch(error=>{
      event.sender.send('sendnewEmail', 'error',error);
    })
  }
  else if(data.type=='check_newVersion'){
    checkUpdater();
  }
})

function checkUpdater(){
  autoUpdater.checkForUpdates().then(result=>{
    log.info(result);
  }).catch(error=>{
    log.error('-----------xxxx')
    log.error(error)
  })

}


const mainCallBack={
  'autoUpdater.downloadUpdate':(data)=>{
    autoUpdater.downloadUpdate()},
}

/*** 用于主进程中的一些函数回调 */
ipcMain.on('maincallback', (event, data,argument) => {

  console.log('ccccccccccccccccccccccc')
  if(typeof mainCallBack[data] !='undefined'){
    mainCallBack[data](argument);
  }
})


/*** 下载完成 */
autoUpdater.on('update-downloaded', () => {
  log.info('下载完成:');
  autoUpdater.quitAndInstall();
})

autoUpdater.on('error', function (info) {
  log.error('版本错误:');
  log.error(info);
  if(openAppFlag){
    openAppFlag=false;
    return;
  }
  dialog.showMessageBox({
    type:'error',
    buttons:['关闭'],
    title:'版本更新',
    message:`版本更新检测出错`,
    detail:'可能是网路不好火灾版本Bug,请提交意见反馈',
    icon:path.resolve(__static, './img/banben.png')
  });
});


autoUpdater.on('update-available', function (info) {
  if(openAppFlag){
    openAppFlag=false;
    return;
  }
  dialog.showMessageBox({
    type:'info',
    buttons:['是','否'],
    title:'版本更新',
    message:`当前版本:${autoUpdater.currentVersion}`,
    detail:`检测到新版本:${info.version},是否升级？`,
    icon:path.resolve(__static, './img/banben.png')
  },function(response){
    if(response==0){
      autoUpdater.downloadUpdate();
    }
    else if(response==1){
      return;
    }
  });

  log.info('检测到新版本',info);
});

autoUpdater.on('checking-for-update', function (info) {
  log.info('检测更新已发出',info);
});


autoUpdater.on('update-not-available', function (info) {
  log.error('没有检测到新版本',info);
  dialog.showMessageBox({
    type:'info',
    buttons:['关闭'],
    title:'版本更新',
    message:`当前版本:${autoUpdater.currentVersion}`,
    detail:'当前已是最新版本，无需更新',
    icon:path.resolve(__static, './img/banben.png')
  });
  // mainWindow.webContents.send('rendererConfirm',{
  //   title:'版本更新',
  //   content: `当前版本:${autoUpdater.currentVersion},暂无检测到新版本`,
  //   suerText:'是',
  //   cancelText:'否',
  // });
});


//更新下载进度
autoUpdater.on('download-progress', function (progressObj) {
  log.info('下载进度:')
  log.info(progressObj);
  mainWindow.webContents.send('datainfo',{type:'updaterProgress',data:progressObj.percent})
})

