const { ipcRenderer } = require('electron')
const axios = require('axios')
const { render } = require('./render')


const apiAddress = 'https://api.500px.com/v1/photos'

const getDownloadUrl = id => new Promise((resolve, reject) => {
    axios.get(apiAddress, {
        params: {
            image_size: [1600, 2048, 2500, 3000, 4096, 4500, 5120, 5500, 6144, 7168],
            ids: id,
        },
        responseType: 'json',
        headers: {
            Accept: 'application/json',
        }
    }).then((res) => {
        if (res.status === 200){
            const { photos } = res.data
            const imageInfo = photos[id]
            let maxSize = 0
            let downloadUrl = ''
            for (let i = 0; i < imageInfo.image_url.length; i++) {
                const imagePath = imageInfo.image_url[i]
                const realSize = imagePath.match(/m%3D(\d*)/)
                if (realSize && realSize[1]){
                    const size = parseInt(realSize[1], 10)
                    if (size > maxSize) {
                        downloadUrl = imagePath
                    }
                    maxSize = size
                }
            }
            resolve(downloadUrl)
        } else {
            reject() 
        }
    }).catch(() => {
        reject()
    })
})

const isImg = target => (target.tagName === 'A' && target.parentNode.className.includes('photo_thumbnail'))
|| (target.tagName === 'IMG' && target.className === 'photo-show__img')

const mouseoverFn = function (e){
    const { target } = e
    if (isImg(target)){
        const { parentNode } = target
        if (!parentNode.addChild){
            let href = ''
            if (target.tagName === 'A'){
                href = target.getAttribute('href')
            }
            else if (target.tagName === 'IMG'){
                href = target.getAttribute('src')
            }
                
            const idMatches = href.match(/photo\/(\d*)\//)
            let id = ''
            if (idMatches && idMatches[1]){
                [, id] = idMatches
            }
            const downloadFile = function (event){
                event.stopPropagation()
                event.preventDefault()
                ipcRenderer.sendToHost('notify', {
                    type: 'info',
                    title: '提示',
                    message: '正在解析下载地址，请等待...'
                })
                getDownloadUrl(id).then((res) => {
                    ipcRenderer.sendToHost('download', { downloadUrl: res })
                })
            }
            
            const setWallpaper = function (event){
                event.stopPropagation()
                event.preventDefault()
                ipcRenderer.sendToHost('notify', {
                    type: 'info',
                    title: '提示',
                    message: '正在解析下载地址，请等待...'
                })
                getDownloadUrl(id).then((res) => {
                    ipcRenderer.sendToHost('setWallpaper', { downloadUrl: res })
                })
            }

            const options = {
                downloadFile,
                setWallpaper,
            }
            parentNode.addChild = render(options)
            if (target.tagName === 'IMG'){
                parentNode.addChild.style.left = '50%'
                parentNode.addChild.style.top = '50%'
            }
            else {
                parentNode.addChild.style.left = 0
            }
               
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
            }, 50)
        }
    }
}

ipcRenderer.on('dom-ready', () => {
    console.log('================500px-load')
    document.querySelector('body').addEventListener('mouseover', mouseoverFn, false)
    document.querySelector('body').addEventListener('mouseout', mouseoutFn, false)
})
