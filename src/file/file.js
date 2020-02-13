
/** 
 * @Description: 下载图片并存到指定文件夹
 * @Author: --
 * @Date: 2019-01-24 21:35:23
 * @LastEditTime: 2019-04-09 09:39:45
 */
const fs = require('fs')
const path = require('path')
const request = require('request')
const webp = require('webp-converter')
const store = require('../renderer/store')
const { md5_32: md5 } = require('../utils/md5')

/**
 * @type {String} 图片下载地址 
 */
const { browserHeader } = require('../utils/config')
/**
 * @type {Object} 保存当前的请求对象
 */
let myRequest = null
let currentSaveFilePath = ''

/**
 * 创建指定路径文件
 * @param {String} dirname 
 */
export function mkdirSync(dirname) {
    try {
        if (fs.existsSync(dirname)) {
            return true
        }
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname)
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

/**
 * 从指定连接下图片
 * @param {*} src 下载图片的绝对地址
 * @param {*} sendData  发送消息
 */
export const downloadPic = async function (src, sendData) {
    return new Promise((resolve, reject) => {
        // 创建文件夹
        const hostdir = store.default.state.main.config.downloadImagePath
        // 文件名
        const fileName = md5(src)
        mkdirSync(hostdir)
        let dstpath = `${hostdir}/SW-${fileName}`
        let isWebp = false
        // 如图图片已经下载完成了
        if (fs.existsSync(`${dstpath}.jpg`)){
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

        let receivedBytes = 0
        let totalBytes = 0

        const writeStream = fs.createWriteStream(dstpath, {
            autoClose: true
        })
        myRequest = request({
            url: src,
            headers: browserHeader,
            timeout: 120000 // 120s
        })
        myRequest.pipe(writeStream)
        myRequest.on('response', (data) => {
            // 更新总文件字节大小
            totalBytes = parseInt(data.headers['content-length'], 10)
        })
        myRequest.on('data', (chunk) => {
            // 更新下载的文件块字节大小
            receivedBytes += chunk.length
            // console.log(receivedBytes, totalBytes)
            sendData('datainfo', {
                type: 'updaterProgress',
                data: parseFloat(((receivedBytes / totalBytes) * 100))
            })
        })
        
        myRequest.on('error', () => {
            deleteDownLoadFile(dstpath)
            reject()
        })
        writeStream.on('finish', () => {
            writeStream.end()
            myRequest = null
            if (receivedBytes === totalBytes) {
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
            } else {
                deleteDownLoadFile(dstpath)
                reject()
            }
        })
    })
}

/**
 * 取消下载
 */
export const cancelDownloadPic = function () {
    return new Promise((resolve) => {
        if (myRequest) {
            myRequest.abort()
            deleteDownLoadFile(currentSaveFilePath)
        }
        resolve()
    })
}


function deleteDownLoadFile(filePath){
    try {
        // 取消下载的时候删除图片
        if (fs.existsSync(filePath)){
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('图片已删除')
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}
