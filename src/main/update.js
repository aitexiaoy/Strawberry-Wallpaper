/**
 *  功能：更新
 *  作者：yangpeng
 *  日期：2020/12/8
 *  如果是render程序更新，默认在版本描述文件后面添加一个isRender:true，以及定义上renderPath
 */

const electron = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const { log } = require('../power/utils')
const updateHot = require('./update-hot')

// const updateURL = build.publish.url

const updateURL = ' http://172.17.14.1:8081/'

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

// 设置更新地址
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
    log.info('检测到新版本', info)

    dialog.showMessageBox({
        type: 'info',
        buttons: ['是', '否'],
        title: '版本更新',
        message: `当前版本:${autoUpdater.currentVersion}`,
        detail: `检测到新版本:${info.version},是否升级？`,
        icon: path.resolve(__static, './img/banben.png')
    }).then(({ response }) => {
        // 更新
        if (response === 0) {
            // 如果是主版本更新,全量更新
            if (info.isRender){
                updateHot.downloadPackage(`${updateURL}${info.renderPath}`).then((res) => {
                    console.log('========================请求成功',)
                    updateHot.quitAndInstall()
                })
            } else {
                autoUpdater.downloadUpdate()
            }
        }
    })
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
function checkUpdater(version) {
    // 手动写入版本
    autoUpdater.currentVersion = version
    autoUpdater.checkForUpdates().then((result) => {

    }).catch((error) => {
        log.error(error)
    })
}


module.exports = {
    checkUpdater,
    autoUpdater
}
