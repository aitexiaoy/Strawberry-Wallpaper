const { ipcRenderer } = require('electron')
const { render } = require('./render')

const PUBLICURL = '/sites/default/files/styles/image_card_4x3_ratio/public/'
const DOWNLOADPUBLICURL = '/sites/default/files/'

const isImg = target => target.tagName === 'IMG' && target.parentNode.className === 'image'

const mouseoverFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target
        window.setTimeout(() => {
            if (!parentNode.addChild){
                const src = target.getAttribute('src')
                const options = {
                    width: 0,
                    height: 0,
                    url: src,
                    downloadUrl: `https://www.nasa.gov${src.replace(PUBLICURL, DOWNLOADPUBLICURL)}`
                }
                parentNode.addChild = render(options)
                parentNode.appendChild(parentNode.addChild)
            }
        }, 30)
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
            }, 30)
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.sendToHost('event', 'DOMContentLoaded')
})

window.onload = () => {
    document.querySelector('body').addEventListener('mouseover', mouseoverFn, false)
    document.querySelector('body').addEventListener('mouseout', mouseoutFn, false)
}
