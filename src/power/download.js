
/** 
 * @Description: 下载图片并存到指定文件夹
 * @Author: --
 * @Date: 2019-01-24 21:35:23
 * @LastEditTime: 2019-04-09 09:39:45
 */

const webp = require('webp-converter')
const fse = require('fs-extra')
const download = require('download')
const mkdir = require('make-dir')
const md5 = require('./md5').md5_32

/**
 * @type {Object} 保存当前的请求对象
 */
let myRequest = null
let currentSaveFilePath = ''

/**
 * 删除文件
 * @param {*} filePath 
 */
function deleteDownLoadFile(filePath){
    fse.remove(filePath, (err) => {
        if (err) {
            console.error('图片删除', err)
            return
        } 
        console.log('图片已删除!')
    })
}


/**
 * 取消下载
 */
const cancelDownloadPic = function () {
    return new Promise((resolve) => {
        if (myRequest) {
            myRequest.destroy()
            deleteDownLoadFile(currentSaveFilePath)
            myRequest = null
        }
        resolve()
    })
}

/**
 * 从指定连接下图片
 * @param {*} src 下载图片的绝对地址
 * @param {Object} userConfig 用户配置
 */
const downloadPic = async function (src, userConfig, progressCallback) {
    await cancelDownloadPic()

    return new Promise((resolve, reject) => {
        // 创建文件夹
        const hostdir = userConfig.downloadImagePath
        // 文件名
        const fileName = md5(src)
        mkdir.sync(hostdir)
        let dstpath = `${hostdir}/SW-${fileName}`
        let isWebp = false
        // 如图图片已经下载完成了
        if (fse.existsSync(`${dstpath}.jpg`)){
            resolve(`${dstpath}.jpg`)
            return
        }
        if (src.match('webp=true')) {
            dstpath += '.webp'
            isWebp = true
        } else {
            dstpath += '.jpg'
            isWebp = false
        }
        currentSaveFilePath = dstpath

        myRequest = download(src, dstpath)
            .on('error', (error) => {
                deleteDownLoadFile(dstpath)
                reject()
            })
            .on('downloadProgress', (progress) => {
                progressCallback(parseFloat((progress.percent * 100)))
            })
            .then(() => {
                if (isWebp) {
                    webp.dwebp(dstpath, dstpath.replace('webp', 'jpg'), '-o', (status) => {
                        // status 101->fails || 100->successful
                        if (status === '100') {
                            deleteDownLoadFile(dstpath)
                            resolve(dstpath.replace('webp', 'jpg'))
                        } else {
                            reject()
                        }
                    })
                } else {
                    resolve(dstpath)
                }
            })
    })
}


module.exports = {
    downloadPic,
    cancelDownloadPic
}
