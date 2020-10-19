
const download = require('download')
const electron = require('electron')

const { app } = electron
const path = require('path')
const fs = require('fs-extra')
const AdmZip = require('adm-zip')

/**
 * @type {Object} 保存当前的请求对象
 */
let myRequest = null
let currentSaveFilePath = ''

const downloadPackage = async function (src, progressCallback = () => {}) {
    await cancelDownloadPic()
    return new Promise((resolve, reject) => {
        // 保存到electron的临时目录
        const hostdir = app.getPath('temp')

        // temp = '/var/folders/3q/2d05qswn43x04gl0m3z8df100000gn/T/'

        // 创建临时文件名
        currentSaveFilePath = fs.mkdtempSync(`${hostdir}/strawberrywallpaper_upgrade_`)

        myRequest = download(src, currentSaveFilePath, { extract: true })
            .on('error', (error) => {
                console.log('===================error', error)
                fs.remove(currentSaveFilePath)
                reject()
            })
            .on('downloadProgress', (progress) => {
                progressCallback(parseFloat((progress.percent * 100)))
            })
            .then(() => {
                resolve(`${currentSaveFilePath}`)
            })
    })
}

function cancelDownloadPic(){
    if (myRequest) {
        myRequest.destroy()
        if (currentSaveFilePath){
            fs.remove(currentSaveFilePath)
        }
        myRequest = null
    }
}


function quitAndInstall(){
    fs.copySync(currentSaveFilePath, __dirname)
    fs.removeSync(currentSaveFilePath) // 删除临时目录
    app.relaunch({ args: process.argv.slice(1) }) // 重启
    app.exit(0)
}

module.exports = {
    downloadPackage,
    cancelDownloadPic,
    quitAndInstall
} 
