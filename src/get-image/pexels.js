/** *
 * pexels网站 https://www.pexels.com
 */

const cheerio = require('cheerio')
const { request } = require('http2-client')

// 下一页的时间参数
let nextPageSeed = ''
// 请求对象
let reqObject = null

const analysisResult = function (result){
    const urls = []
    const $ = cheerio.load(result)
    if ($('.next_page').length){
        nextPageSeed = $('.next_page')[0].attribs.href
    }
    const imageItems = $('.photo-item__img')
    // 是否存在
    if (nextPageSeed.length){
        const imageItemsLength = imageItems.length
        for (let i = 0; i < imageItemsLength; i++){
            const { attribs } = imageItems[i]
            if (attribs['data-big-src']){
                const obj = {
                    width: attribs['data-image-width'],
                    height: attribs['data-image-height'],
                    url: attribs['data-large-src'],
                    downloadUrl: attribs['data-big-src'].split('?')[0]
                }
                urls.push(obj)
            }
        }
    }
    return urls
}


export const getImage = function (data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            resolve([])
        }
        if (data.page === 0){
            nextPageSeed = ''
        }
        let baseUrl = 'https://www.pexels.com'
        if (data.searchKey) {
            baseUrl = `https://www.pexels.com/search/${data.searchKey}`
        }
        const url = baseUrl + nextPageSeed
        console.log('------------', url)

        reqObject = request(url, {
            method: 'GET',
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                cookie: '__cfduid=dc0c8a5d9efdac6eb0e5b49745a6ce78e1579152913;'
                + 'locale=en-US; _ga=GA1.2.727888903.1579152916;' 
                + '_gid=GA1.2.1309891260.1579152916; _fbp=fb.1.1579152916921.482810349;'
                + '_hjid=dac493c8-a7f3-4834-9d25-10ef85de0227; _gat=1',
            },
        }, (res) => {
            const { http2Clients } = reqObject.getGlobalManager({})
            if (res.statusCode === 200){
                res.setEncoding('utf8')
                let resultData = ''
                res.on('data', (chunk) => { resultData += chunk })
                res.on('end', () => {
                    Object.values(http2Clients).forEach((i) => { i.close() })
                    try {
                        reqObject = null
                        resolve(analysisResult(resultData))
                    } catch (error) {
                        console.log('------------解析失败pexels:')
                        reject()
                    }
                })
            }
            else {
                console.log('------------请求失败pexels:')
                reject()
                Object.values(http2Clients).forEach((i) => { i.close() })
                reqObject = null
            }
            res.end()
        })
    })
}


export const cancelImage = function () {
    if (reqObject && reqObject.getGlobalManager) {
        const { http2Clients } = reqObject.getGlobalManager({})
        Object.values(http2Clients).forEach((i) => { i.close() })
    }
}
