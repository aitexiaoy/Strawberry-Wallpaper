#### 文件代码在 src/file.js

起初采用axios进行图片的下载，但是axios在服务端不支持进度条，最后又换成了request请求。

```js
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
                        if (status === '100'){
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
```