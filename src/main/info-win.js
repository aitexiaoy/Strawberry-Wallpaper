import {
    BrowserWindow,
  } from 'electron'
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#/suggestion` :
  `file://${__dirname}/index.html#/suggestion`

var childrenWin=null;

export function createChildrenWindow() {
    /**
     * Initial window options
     */
    childrenWin = new BrowserWindow({
      height: 500,
      useContentSize: true,
      // width: 280,
      width: 800,
    //   frame: false,
    //   transparent: true,
      resizable:false,     //禁止变化尺寸
      hasShadow: false, //是否阴影
      thickFrame: false,
      scrollBounce: true,
      backgroundColor: '#222',
    //   alwaysOnTop:true,
      focusable:true,
      fullscreenable:false,
      skipTaskbar:true,
      hasShadow:true,
      vibrancy:'medium-light',
    })
  
    childrenWin.loadURL(winURL)

    // childrenWin.openDevTools();
  
    childrenWin.on('closed', () => {
      childrenWin = null;
    })
  
    // childrenWin.on('blur', () => {
    //     childrenWin.hide();
    // }); 
  }

  

export function hideChildrenWindow(){
    if(childrenWin&&childrenWin.isVisible()){
        childrenWin.close();
    }
}

export function showChildrenWinndow(){
    if(childrenWin==null){
        createChildrenWindow();
    }
    // if(childrenWin&&!childrenWin.isVisible()){
    //     childrenWin.show();
    // }
}

