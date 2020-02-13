const { ipcRenderer } = require('electron')
const { render } = require('./render')

const isImg = target => target.tagName === 'A' && target.parentNode.tagName === 'FIGURE'

const mouseoverFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target
        window.setTimeout(() => {
            if (!parentNode.addChild){
                const node = parentNode
                const wallpaperId = node.getAttribute('data-wallpaper-id')
                const url = node.querySelector('img').getAttribute('data-src')
                const isPng = Boolean(node.querySelector('.png'))
                const [width, height] = node.querySelector('.wall-res').innerHTML.split('x')
                const downloadUrl = `https://w.wallhaven.cc/full/${wallpaperId.slice(0, 2)}/wallhaven-${wallpaperId}.${isPng ? 'png' : 'jpg'}`
                const options = {
                    width: width.trim(),
                    height: height.trim(),
                    url,
                    downloadUrl,
                }
                
                parentNode.addChild = render(options)
                parentNode.addChild.style.zIndex = '9999'
                parentNode.appendChild(parentNode.addChild)
            }
        }, 80)
    }
}

const mouseoutFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target
        if (parentNode.addChild){
            window.setTimeout(() => {
                if (!parentNode.addChild.mouseoverFlag){
                    parentNode.removeChild(parentNode.addChild)
                    parentNode.addChild = null
                }
            }, 80)
        }
    }
}

ipcRenderer.on('dom-ready', () => {
    console.log('================wall-load')
    document.querySelector('body').addEventListener('mouseover', mouseoverFn, false)
    document.querySelector('body').addEventListener('mouseout', mouseoutFn, false)
})
