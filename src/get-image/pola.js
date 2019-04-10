/** *
 * 获取到图片路径
 */
const axios = require('axios')
const { downloadUrl } = require('../file/file.js')

// eslint-disable-next-line no-unused-vars
async function getPage(url) {
    return new Promise((resolve) => {
        axios.request({
            url,

            // `method` 是创建请求时使用的方法
            method: 'get', // 默认是 get
            // `onDownloadProgress` 允许为下载处理进度事件
            onDownloadProgress(progressEvent) {
                // 对原生进度事件的处理
                console.log('--------------------下载图片进度:')
                console.log(progressEvent)
            },
        }).then(async (result) => {
            if (result.status === 200) {
                // eslint-disable-next-line no-param-reassign
                result = result.data.data
            } else {
                return
            }
            try {
                const urls = []
                for (let index = 0; index < result.length; index++) {
                    const path = result[index].full_res
                    console.log(path)
                    urls.push(path)
                }
                await downloadUrl(urls)
                resolve()
            } catch (error) {
                console.log(error)
                resolve()
            }
        }).catch((error) => {
            console.log(error)
            resolve()
        })
    })
}

async function getPageUrl() {
    for (let index = 131; index > 80; index--) {
        console.log('---------------00000')
        console.log('--------------2222')
    }
}
getPageUrl()
