const { ipcRenderer } = require('electron')
const { render } = require('./render')

const isImg = target => target.tagName === 'A' && target.parentNode.className.includes('photo_thumbnail')

const mouseoverFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target
        window.setTimeout(() => {
            if (!parentNode.addChild){
                const src = parentNode.querySelector('img').getAttribute('src')
                const options = {
                    width: 0,
                    height: 0,
                    url: src,
                    downloadUrl: src,
                }
                parentNode.addChild = render(options)
                parentNode.addChild.style.left = 0
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
    console.log('================500px-load')
    document.querySelector('body').addEventListener('mouseover', mouseoverFn, false)
    document.querySelector('body').addEventListener('mouseout', mouseoutFn, false)
})
