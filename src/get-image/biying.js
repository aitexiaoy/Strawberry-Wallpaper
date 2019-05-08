/** 必应的每日壁纸图片 */
const axios = require('axios')
const { downloadUrl } = require('../file/file.js')

async function getPage(url) {
    return new Promise((resolve) => {
        axios.request({
            url,
            method: 'get', // 默认是 get
        }).then(async (res) => {
            let result = ''
            if (res.status === 200) {
                result = res.data.images
            } else {
                return
            }
            try {
                const urls = []
                for (let index = 0; index < result.length; index++) {
                    const path = `https://cn.bing.com${result[index].url}`
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
    getPage('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1550218434235&pid=hp&FORM=BEHPTB&video=1')
}

getPageUrl()
