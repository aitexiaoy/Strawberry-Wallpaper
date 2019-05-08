#### 文件代码在 src/file.js

起初采用axios进行图片的下载，但是axios在服务端不支持进度条，最后又换成了request请求。

```js
export const downloadPic = async function (src, mainWindow) {
    // 返回一个Promise方便处理
    return new Promise((resolve, reject) => {
    // 先检测目录，没有相关目录的话会自动创建新的目录
        mkdirSync(hostdir) 
        // 自动重命名
        let dstpath = `${hostdir}/${(new Date()).getTime()}_${(new Date()).getMilliseconds()}`
        // webp格式的图片标志，500px下载的图片为webp格式的
        let isWebp = false
        // 判断图片格式
        if (src.match('webp=true')) {
            dstpath += '.webp'
            isWebp = true
        } else {
            dstpath += '.jpg'
            isWebp = false
        }

        // 已经接受的文件的大小
        let receivedBytes = 0
        // 文件总的字大小
        let totalBytes = 0

        // 创建一个文件流
        const writeStream = fs.createWriteStream(dstpath, {
            autoClose: true
        })
        // 创建一个请求
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
            // 更新进度条
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
                    // 将webp图片转成jpg图片
                    webp.dwebp(dstpath, dstpath.replace('webp', 'jpg'), '-o', (status) => {
                        // status 101->fails || 100->successful
                        if (status === '100'){
                            fs.unlink(dstpath, (err) => {
                                if (err) throw err
                                // console.log('文件已删除')
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
                // 更新进度条
                mainWindow.webContents.send('datainfo', {
                    type: 'updaterProgress',
                    data: 0
                })
                reject()
            }
        })
    })
}
```