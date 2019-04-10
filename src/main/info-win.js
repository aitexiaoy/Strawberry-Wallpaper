const electron = require('electron')

const { BrowserWindow } = electron
const { baseUrl } = require('../utils/utils.js')

const winURL = `${baseUrl}#/suggestion`

let childrenWin = null;

/**
 * 设置窗口居中
 */
// eslint-disable-next-line no-shadow
function infoWinCenter(screen, win){
    const winWidth = win.getSize()[0];
    const winHeight = win.getSize()[1];
    const screens = screen.getAllDisplays();
    const currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    let width = 0;
    for (let i = 0; i < screens.length; i++){
        if (screens[i].id !== currentScreen.id){
            width += screens[i].workAreaSize.width;
        } else {
            break;
        }
    }
    return {
        x: parseInt(width + ((currentScreen.workAreaSize.width - winWidth) / 2), 10),
        y: parseInt((currentScreen.workAreaSize.height - winHeight) / 2, 10)
    }
}


export function createChildrenWindow() {
    /**
     * Initial window options
     */
    childrenWin = new BrowserWindow({
        height: 500,
        useContentSize: true,
        width: 800,
        resizable: false, // 禁止变化尺寸
        hasShadow: false, // 是否阴影
        thickFrame: false,
        scrollBounce: true,
        backgroundColor: '#222',
        focusable: true,
        fullscreenable: false,
        skipTaskbar: true,
        vibrancy: 'medium-light',
    })
  
    childrenWin.loadURL(winURL)
    childrenWin.on('closed', () => {
        childrenWin = null;
    })
}
  

export function hideChildrenWindow(){
    if (childrenWin && childrenWin.isVisible()){
        childrenWin.close();
    }
}

export function showChildrenWinndow(){
    if (childrenWin == null){
        createChildrenWindow();
        const { screen } = electron
        const position = infoWinCenter(screen, childrenWin);
        childrenWin.setPosition(position.x, position.y);
    }
    // if(childrenWin&&!childrenWin.isVisible()){
    //     childrenWin.show();
    // }
}
