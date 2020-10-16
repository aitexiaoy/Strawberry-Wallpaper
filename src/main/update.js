const electron = require('electron')
const path = require('path')
const fs = require('fs')
const { autoUpdater } = require('electron-updater')
const { log } = require('../power/utils')

const updateHot = require('./update-hot')

const updateURL = 'http://sw.taoacat.com/version/'

const { dialog } = electron


//= ==============================================================================================================
//                            清除每次更新下载的文件，否则无法进行更新
//= ==============================================================================================================
// updaterCacheDirName的值与src/main/app-update.yml中的updaterCacheDirName值一致，在windows中会创建一个类似
// C:\Users\Administrator\AppData\Local\electron-updater1\pending文件存储更新下载后的文件"*.exe"和"update-info.json"
// const updaterCacheDirName = 'electron-updater1'
// const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updaterCacheDirName, 'pending')
// log.warn(updatePendingPath)
// fs.emptyDir(updatePendingPath)
// log.warn(autoUpdater.app.baseCachePath)

// 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包，所以设置为false
autoUpdater.autoDownload = false
// https://github.com/electron-userland/electron-builder/issues/1254
// if (process.env.NODE_ENV === 'development') {
//     autoUpdater.updateConfigPath = path.join(__dirname, 'default-app-update.yml')
// } else {
//     autoUpdater.updateConfigPath = path.join(__dirname, '../../../app-update.yml')
// }
autoUpdater.setFeedURL(updateURL)

  
/** * 下载完成 */
autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
})

autoUpdater.on('error', (info) => {
    dialog.showMessageBox({
        type: 'error',
        buttons: ['关闭'],
        title: '版本更新',
        message: '版本更新检测出错',
        detail: '可能是网路不好或者版本Bug,请提交意见反馈',
        // eslint-disable-next-line no-undef
        icon: path.resolve(__static, './img/banben.png')
    })
})


autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox({
        type: 'info',
        buttons: ['是', '否'],
        title: '版本更新',
        message: `当前版本:${autoUpdater.currentVersion}`,
        detail: `检测到新版本:${info.version},是否升级？`,
        // eslint-disable-next-line no-undef
        icon: path.resolve(__static, './img/banben.png')
    }, (response) => {
        log.info('检测到新版本::', response)
        if (response === 0) {
            autoUpdater.downloadUpdate()
        } else if (response === 1) {
            console.log('1')
        }
    })
    log.info('检测到新版本', info)
})

autoUpdater.on('checking-for-update', (info) => {
    log.info('检测更新已发出', info)
})


autoUpdater.on('update-not-available', (info) => {
    log.error('没有检测到新版本', info)
    dialog.showMessageBox({
        type: 'info',
        buttons: ['关闭'],
        title: '版本更新',
        message: `当前版本:${autoUpdater.currentVersion}`,
        detail: '当前已是最新版本，无需更新',
        // eslint-disable-next-line no-undef
        icon: path.resolve(__static, './img/banben.png')
    })
})


// 更新下载进度
autoUpdater.on('download-progress', (progressObj) => {
    // sendData('datainfo', {
    //     type: 'updaterProgress',
    //     data: progressObj.percent
    // })
})


/**
 * 检测是否更新
 */
function checkUpdater() {
    updateHot.downloadPackage().then((res) => {
        console.log('========================请求成功',)
        updateHot.quitAndInstall()
    })
    // autoUpdater.checkForUpdates().then((result) => {
    //     console.log('==================: checkUpdater -> result', result)
    // }).catch((error) => {
    //     log.error(error)
    // })
}


module.exports = {
    checkUpdater,
    autoUpdater
}
