/** 
 * @Description: 下载图片并存到指定文件夹
 * @Author: yangpeng
 * @Date: 2019-01-24 21:35:23
 * @LastEditTime: 2019-04-09 09:39:45
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const request = require('request')
/**
 * webp格式图片转jpg
 */
const webp = require('webp-converter')

/**
 * @type {String} 图片下载地址 
 */
const hostdir = path.resolve(`${os.homedir()}/Downloads/wallpaper`)
const { browserHeader } = require('../utils/config')
/**
 * @type {Object} 保存当前的请求对象
 */
let myRequest = null


/**
 * 创建指定路径文件
 * @param {String} dirname 
 */
export function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true
    } 
    if (mkdirSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
    }
  
    return false
}

/**
 * 从指定连接下图片
 * @param {*} src 下载图片的绝对地址
 * @param {*} mainWindow  主进程窗口对象
 */
export const downloadPic = async function (src, mainWindow) {
    return new Promise((resolve, reject) => {
    // 创建文件夹
        mkdirSync(hostdir)
        let dstpath = `${hostdir}/${(new Date()).getTime()}_${(new Date()).getMilliseconds()}-${parseInt('', (Math.random() * 100000).toString())}`
        let isWebp = false
        if (src.match('webp=true')) {
            dstpath += '.webp'
            isWebp = true
        } else {
            dstpath += '.jpg'
            isWebp = false
        }

        let receivedBytes = 0
        let totalBytes = 0

        const writeStream = fs.createWriteStream(dstpath, {
            autoClose: true
        })
        myRequest = request({
            url: src,
            headers: browserHeader,
        })
        myRequest.pipe(writeStream)
        myRequest.on('response', (data) => {
            // 更新总文件字节大小
            totalBytes = parseInt(data.headers['content-length'], 10)
        })
        myRequest.on('data', (chunk) => {
            // 更新下载的文件块字节大小
            receivedBytes += chunk.length
            console.log(receivedBytes / totalBytes)
            mainWindow.webContents.send('datainfo', {
                type: 'updaterProgress',
                data: parseFloat(((receivedBytes / totalBytes) * 100))
            })
        })

        myRequest.on('finish', () => {
            myRequest = null
        })
        myRequest.on('error', () => {
            reject()
        })
        writeStream.on('finish', () => {
            writeStream.end()
            myRequest = null
            if (receivedBytes === totalBytes){
                if (isWebp) {
                    webp.dwebp(dstpath, dstpath.replace('webp', 'jpg'), '-o', (status) => {
                        // status 101->fails || 100->successful
                        if (status === 100){
                            fs.unlink(dstpath, (err) => {
                                if (err) throw err
                                console.log('文件已删除')
                            })
                            resolve(dstpath.replace('webp', 'jpg'))
                        } else {
                            reject()
                        }
                    })
                } else {
                    resolve(dstpath)
                }
            } else {
                fs.unlink(dstpath, (err) => {
                    if (err) throw err
                })
                mainWindow.webContents.send('datainfo', {
                    type: 'updaterProgress',
                    data: 0
                })
                reject()
            }
        })
    })
}

/**
 * 取消下载
 */
export const cancelDownloadPic = function (){
    return new Promise((resolve) => {
        if (myRequest){
            myRequest.abort()
        }
        resolve()
    })
}
