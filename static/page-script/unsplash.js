const { ipcRenderer } = require('electron')
const { render } = require('./render')

const isImg = target => target.tagName === 'IMG' && target.getAttribute('srcset')

const mouseoverFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target
        if (!parentNode.addChild){
            const srcList = target.getAttribute('srcset').split(', ')
            const src = srcList[srcList.length - 1]
            const options = {
                width: 0,
                height: 0,
                url: src,
                downloadUrl: src.split(' ')[0].split('?')[0],
            }
            parentNode.addChild = render(options)
            parentNode.addChild.style.left = 0
            parentNode.appendChild(parentNode.addChild)
        }
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
    console.log('================un-load')
    document.querySelector('body').addEventListener('mouseover', mouseoverFn, false)
    document.querySelector('body').addEventListener('mouseout', mouseoutFn, false)
})
