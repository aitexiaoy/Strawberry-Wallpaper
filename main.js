
// const electron=require('electron');
// const {app,BrowserWindow,ipcMain,Tray} =require('electron');
const {app,BrowserWindow} =require('electron');

// const path = require('path');

const {version} =require('./package.json')

// const { autoUpdater }=require("electron-updater")

const log = require("electron-log");
log.transports.file.level = "debug";

// const {setOnCurrentSpace} = require('./src/wallpaper/outwallpaper.js')

// const {downloadPic} = require('./src/file/file2.js'); //这里面不能引入promise的相关对象

// const {open_autoStart,open_disStart} =require('../file/open-start.js')

// const get_urls = require('./src/get-image/search.js').get_urlsfdock


// const {hideChildrenWindow,showChildrenWinndow}=require('../src/main/info-win.js')

// const {newEmail}= require( '../src/main/mail.js')

//托盘对象
var appTray = null;


// /**
//  * Set `__static` path to static files in production
//  * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
//  */
// if (process.env.NODE_ENV !== 'development') {
//   global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
// }

let mainWindow = null;
const winURL = 'http://www.baidu.com'

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    // useContentSize: true,
    // width: 280,
    width: 800,
    // frame: false,
    // transparent: true,
    // resizable:false,     //禁止变化尺寸
    // hasShadow: false, //是否阴影
    // thickFrame: false,
    // scrollBounce: true,
    // backgroundColor: '#222',
    // alwaysOnTop:true,
    // focusable:true,
    // fullscreenable:false,
    // skipTaskbar:true,
    // hasShadow:true,
    // vibrancy:'medium-light',
  })


  mainWindow.openDevTools();



  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null;
  })

  // mainWindow.on('blur', () => {
  //     mainWindow.hide();
  // }); 
}

app.on('ready', function () {
  createWindow();
})




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
})

