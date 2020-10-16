

const wallpaper = require('wallpaper')
const os = require('os')
const { log, isMac } = require('./utils')
const { downloadPic, cancelDownloadPic } = require('./download')

// TODO 当前点击的是那个屏幕
const currentScreenIndex = 1

function set(file, options = { screen: 'all', scale: 'auto' }) {
    wallpaper.set(file, options)
}

const changeWallpaperScale = async function (options = { screen: 'all', scale: 'auto' }){
    if (isMac){
        const screens = await wallpaper.screens()
        screens.forEach((i, index) => {
            wallpaper.get({ screen: index }).then((file) => {
                set(file, { screen: index, scale: options.scale })
            })
        })
    }
    else {
        const file = await wallpaper.get()
        set(file, options)
    }
}


function setWallpaper(imageData, options, progressCallback = () => {}) {
    return new Promise((resolve, reject) => {
        if (!imageData || !options){
            throw new Error('设置参数不全', imageData.downloadPic, options)
        }
        downloadPic(imageData.downloadUrl, options, progressCallback).then((filePath) => {
            if (isMac && options.autoSetAllScreens === false){
                set(filePath, {
                    ...options,
                    screen: currentScreenIndex,
                })
            }
            else {
                set(filePath)
            }
            resolve()
            log.info(`设置壁纸成功:${filePath}`)
        }).catch((error) => {
            log.error(`设置壁纸失败:${imageData.downloadUrl}`)
            log.error(error)
            reject()
        })
    })
}

function cancelWallpaper(){
    cancelDownloadPic()
}

module.exports = {
    setWallpaper,
    changeWallpaperScale,
    cancelWallpaper
}
