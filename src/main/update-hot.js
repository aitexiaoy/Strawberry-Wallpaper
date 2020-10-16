
const download = require('download')
const electron = require('electron')

const { app } = electron
const fs = require('fs-extra')
const tar = require('tar')

/**
 * @type {Object} 保存当前的请求对象
 */
let myRequest = null
let currentSaveFilePath = ''

const downloadPackage = async function (ll, progressCallback = () => {}) {
    await cancelDownloadPic()

    const src = 'http://192.168.1.112:8080/strawberrywallpaper-1.4.1-mac.zip'
    return new Promise((resolve, reject) => {
        // 保存到electron的临时目录
        // const hostdir = app.getPath('temp')


        currentSaveFilePath = '/Users/yangpeng/Desktop/ll/aa.zip'


        // temp = '/var/folders/3q/2d05qswn43x04gl0m3z8df100000gn/T/'

        // 文件名
        // currentSaveFilePath = fs.mkdtempSync(`${hostdir}/strawberrywallpaper_upgrade_`)

        console.log('===================hostdir', currentSaveFilePath)


        myRequest = download(src)
        console.log('===================hostdir2222', currentSaveFilePath)

        myRequest.on('error', (error) => {
            console.log('===================error', error)
            // fs.remove(currentSaveFilePath)
            reject()
        })
            .on('downloadProgress', (progress) => {
                console.log('===================progress.percent', progress.percent * 100)
                progressCallback(parseFloat((progress.percent * 100)))
            })
            .pipe(fs.createWriteStream(`${currentSaveFilePath}`)) // 这个地方变成了whiteStream对象了
            .on('finish', () => {
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
    tar.x({
        cmd: '/Users/yangpeng/Desktop/ll',
        sync: true,
    })
        .on('close', () => {
        // 解压完毕，复制更新文件
            fs.copySync(currentSaveFilePath, '/Users/yangpeng/Desktop/ll') // 解压至指定的目录，这里用 __dirname 为例
            fs.removeSync(currentSaveFilePath) // 删除临时目录
        
        // app.relaunch({ args: process.argv.slice(1) }) // 重启
        // app.exit(0)
        })
}

module.exports = {
    downloadPackage,
    cancelDownloadPic,
    quitAndInstall
} 
