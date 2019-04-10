/** *
 * pexels网站 https://www.pexels.com
 */

const axios = require('axios')
const { browserHeader } = require('../utils/config')

const { CancelToken } = axios
let source = null

const { axiosGet } = require('../utils/axios.js')

export const getImage = function (data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            resolve([])
        }
        let baseUrl = 'https://www.pexels.com/'
        if (data.searchKey) {
            baseUrl = `https://www.pexels.com/search/${data.searchKey}/`
        }
        source = CancelToken.source()
        axiosGet({
            url: baseUrl,
            params: {
                format: 'js',
                page: data.page,
            },
            headers: browserHeader,
            cancelToken: source.token
        }).then((res) => {
            source = null
            const urls = []
            const tempUrls = []

            // 匹配图片（g表示匹配所有结果i表示区分大小写）
            const imgReg = /<img.*?(?:>|\/>)/gi
            // 匹配拥有srcset属性的
            const srcReg = /srcset=\\.*?\\/i
            const arr = res.match(imgReg)
            if (!arr) {
                resolve([])
                return
            }
            for (let i = 0; i < arr.length; i++) {
                // console.log(arr[i])
                const src = arr[i].match(srcReg)
                // 获取图片地址
                if (src) {
                    // 把图片地址提取出来
                    const aa = /\\.*?\?/i
                    let result = src[0].match(aa)
                    result = result[0].replace(/"/g, '').replace(/\\/g, '').replace(/\?/, '')
                    const widthReg = /data-image-width=\\.*?\\/i
                    const heightReg = /data-image-height=\\.*?\\/i
                    const urlReg = /data-large-src=\\.*?\\/i
                    const width = arr[i].match(widthReg)
                    const height = arr[i].match(heightReg)
                    const url = arr[i].match(urlReg)
                    const obj = {
                        width: width[0] 
                            ? width[0].replace(/data-image-width=/g, '').replace(/"/g, '').replace(/\\/g, '') : '',
                        height: height[0] 
                            ? height[0].replace(/data-image-height=/g, '').replace(/"/g, '').replace(/\\/g, '') : '',
                        url: url[0] 
                            ? url[0].replace(/data-large-src=/g, '').replace(/"/g, '').replace(/\\/g, '') : '',
                        downloadUrl: result,
                    }

                    if (tempUrls.indexOf(obj.url) === -1) {
                        tempUrls.push(obj.url)
                        urls.push(obj)
                    }
                }
                // 当然你也可以替换src属性
            }
            resolve(urls)
            // downloadUrl(urls)
        }).catch((err) => {
            source = null
            console.log(err)
            reject()
        })
    })
}


export const cancelImage = function () {
    if (source) {
        source.cancel()
    }
}
