const { ipcRenderer } = require('electron')
const { iconDownload, iconDownloadHover, iconWallpaper, iconWallpaperHover } = require('./images/index')

const render = (options) => {
    const { downloadUrl } = options
    const downloadFile = function (e){
        e.stopPropagation()
        e.preventDefault()
        ipcRenderer.sendToHost('download', downloadUrl)
    }

    const setWallpaper = function (e){
        e.stopPropagation()
        e.preventDefault()
        ipcRenderer.sendToHost('setWallpaper', { ...options })
    }

    const btnMouseOver = function (e, icon){
        const { target } = e
        target.style.color = '#ffffff'
        target.style.background = `url(${icon}) no-repeat center center`
    }

    const btnMouseLeave = function (e, icon){
        const { target } = e
        target.style.color = '#bbbbbb'
        target.style.background = `url(${icon}) no-repeat center center`
    }
    const dom = document.createElement('div')
    const btnDownload = document.createElement('div')
    btnDownload.setAttribute('title', '点击下载')
   

    const btnWallpaper = document.createElement('div')
    btnWallpaper.setAttribute('title', '设置壁纸')

    const btnCssText = 'width:50px;height:100%;color:#bbb;cursor:default;font-size:20px;'
    btnDownload.style.cssText = btnCssText
    btnWallpaper.style.cssText = btnCssText

    dom.style.cssText = 'display:flex; position:absolute;z-index:99999; right:0;top:0; align-items:center; width:100px;height:40px;background-color:#222;'

    btnDownload.onclick = downloadFile
    btnDownload.onmouseover = (e) => { btnMouseOver(e, iconDownloadHover) } 
    btnDownload.onmouseleave = (e) => { btnMouseLeave(e, iconDownload) }
    btnWallpaper.onclick = setWallpaper
    btnWallpaper.onmouseover = (e) => { btnMouseOver(e, iconWallpaperHover) }
    btnWallpaper.onmouseleave = (e) => { btnMouseLeave(e, iconWallpaper) }

    dom.appendChild(btnDownload)
    dom.appendChild(btnWallpaper)
    btnDownload.style.background = `url(${iconDownload}) no-repeat center center`
    btnWallpaper.style.background = `url(${iconWallpaper}) no-repeat center center`

    dom.className = 'wallpaper-ctrl'
    
    dom.onmouseover = function (e){
        e.stopPropagation()
        e.preventDefault()
        dom.mouseoverFlag = true
        return false
    }

    dom.onmouseout = function (e){
        e.stopPropagation()
        e.preventDefault()
        dom.mouseoverFlag = false
        return false
    }

    return dom
}


module.exports = {
    render,
}
