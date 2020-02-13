/* eslint-disable max-len */

const { ipcRenderer } = require('electron')

const iconDownload = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABS0lEQVQ4T72TsU7DMBCGfU6y8gzMPAFMLQMbYqpjRQoLAwtiYIWhzcATsDExRIpsZ0SslAkeg2dgjeNDjmIprZLWkQJeklj2d3/++w/IxAsm5hEvoFKK2cKMMbVPgBdQCLGyIM5589y1/haY5/lBFEUnlNJjrfVHkiRrq2ZbYVEU8zAMZ8aYr6qqPtM0/XGqNxTai5TShTGmNMasdwEppXN3tmvFBlAp9a61zhzIVVVKLdumZF3/WqVLxthpr8Ih4FBTpJQXAHDnBbTVgyB4ruv62vplFVhf3Z79CynlJQBceQFdMwDgAREf7bd7d56VZXmDiAtvYAfaeIiIWbcBQoh7SunZKGBfbFwD2lTMRgOHJuP/gUIICQBvcRy/7JvZjhVHnPN4KIfniPhECDn0ARJCvgHgljH22gt0mzaDPsDtiWqi5XNxzJnJgb8whuUV13+BlgAAAABJRU5ErkJggg=='

const iconDownloadHover = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABF0lEQVQ4T72TMU4DMRBF378AZ6DmBFAFCjpEBeloKGhQClooQgpOQEdFDSkRLUkFx+AMucBHtryRE+1ir7QwjS3LfvP9Z0YMHBqYRxXQ9nlILOm1JKAWeJ+Acf0t/hZoewc4APaBpaRFUGN7Q6HtQ2AEfAGfklaN6g2F6eEZMAcWBWCAxruS1lZsAz+AWQNqstqeJg9nuX9J6VTSUZfCLmBrUWyfAjdVwJT9CbhKfgURSyCehV/YvgAuq4BZMe6Ah/SluG88s30dfKwGZtDoYfJ3XQDbt8BxL2Bb22TFCvBRb2DXZKQ2+1/gC/Au6bk0s5kVe5LGXX14AjwCuzVA4BuYSHprBWZmh7EqxvZExWkqvup5YXDgD/V/oxUurSvtAAAAAElFTkSuQmCC'

const iconWallpaper = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABQ0lEQVQ4T7XUsUrDUBQG4P8k6eZj6FJfQai4ueeeSzcfQVwVSsEn8Ams4JATcHDQsYrgAzi4uLgKoiCOjb/c1pQaLG1DvEvIublf/tyTRNDwkIY9TME8z3sAtmdvQPKFZCQiMYCIZCwiEYDxMZyHOoA7VQ3rJ6CZ7QHoiciRc+58ldRmtg7gOoqi4zRNByV4CeBCVU9Xwcpr8zzfJXmlqlKCw6Io+t1u96YOGNZkWfbovW83CX5679caA82MjT7y/4Micuicu6/blD8T1sXCujiOh7/2UCZvUO1BMjRlZ6xkWXYiIl+qul9HNLMzkq/e+4NpLDN7AvBM8n0VVEQ+AHRUdWP6LZeAmW0VRZFUwSRJOqE2Go1uq3OtVustTdOHsr7Uxv38ieCc6y9KPxc0s7aIGMnNKhK6OQ9eKuGiVLPzjYPfQXGrFUxePR0AAAAASUVORK5CYII='

const iconWallpaperHover = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAA/UlEQVQ4T7XUMUrEQBSH8e9TS4+hzXoFYcXOW3iExVZBFjyBJ1DBxsLCQstdETyAhY2NrSAKYu2TYGYJMZJNdpwm8Cbzm38yvJHMw8weMzAiDoGt2gYvwBKw3PK8U4v1P2BE7AJF4UA975I6ItaAG+BIPU3gFXCpnnTB0rsRsQNcW4wy4QQYq9M+YGk8qoOc4Ke6mhOM3J/8/+C+er/AofxO2Bcr103q/3BBjyLhdjrlY+BLHfVRI+IMeFX3qr38BDwD7x3RD2Cors96udJCm8BKAzgsa7cNc2/qQ6rPdX2VNxHquC39n2BEDIALYKOOpDugCZ8rYVuq6nx28BvGs3gV89CM0AAAAABJRU5ErkJggg=='


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
