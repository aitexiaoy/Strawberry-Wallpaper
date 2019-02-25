import {BrowserWindow,screen} from 'electron'
const {base_url} =require('../utils/utils.js')


const winURL = base_url+'#/suggestion'

var childrenWin=null;


/**
 * 设置窗口居中
 */
function infoWinCenter(screen,win){
  let winWidth=win.getSize()[0];
  let winHeight=win.getSize()[1];
  let screens=screen.getAllDisplays();
  let currentScreen=screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  let width=0;
  for(let i=0;i<screens.length;i++){
    if(screens[i].id!==currentScreen.id){
      width=width+screens[i].workAreaSize.width;
    }else{
      break;
    }
  }

  console.log(width,screens,currentScreen,winWidth,winHeight);

  return {
    x:parseInt(width+((currentScreen.workAreaSize.width-winWidth)/2)),
    y:parseInt((currentScreen.workAreaSize.height-winHeight)/2)
  }

}


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
  }

  

export function hideChildrenWindow(){
    if(childrenWin&&childrenWin.isVisible()){
        childrenWin.close();
    }
}

export function showChildrenWinndow(){
    if(childrenWin==null){
        createChildrenWindow();
        let position=infoWinCenter(screen,childrenWin);
        console.log(position);
        childrenWin.setPosition(position.x,position.y);
    }
    // if(childrenWin&&!childrenWin.isVisible()){
    //     childrenWin.show();
    // }
}

