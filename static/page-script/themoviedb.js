const { ipcRenderer } = require('electron')
const { render } = require('./render')

const isImg = target => target.tagName === 'IMG' && target.parentNode.tagName === 'A' && target.parentNode.parentNode.className === 'image_content'

const mouseoverFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target.parentNode
        window.setTimeout(() => {
            if (!parentNode.addChild){
                const src = target.parentNode.getAttribute('href')
                const options = {
                    width: 0,
                    height: 0,
                    url: src,
                    downloadUrl: src,
                }
                parentNode.addChild = render(options)
                parentNode.appendChild(parentNode.addChild)
            }
        }, 80)
    }
}

const mouseoutFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target.parentNode
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
    console.log('================them-load')
    document.querySelector('body').addEventListener('mouseover', mouseoverFn, false)
    document.querySelector('body').addEventListener('mouseout', mouseoutFn, false)
})
