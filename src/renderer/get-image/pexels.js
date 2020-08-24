/** *
 * pexels网站 https://www.pexels.com
 */

import cheerio from 'cheerio'
import got from 'got'


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
        let baseUrl = 'https://www.pexels.com/zh-cn/'
        if (data.searchKey) {
            baseUrl = `https://www.pexels.com/search/${data.searchKey}`
        }
        const url = baseUrl + nextPageSeed
        console.log('------------', url)
        reqObject = got.get(url, {
            method: 'GET',
            http2: true,
            searchParams: {
                format: 'js',
                seed: '2020-07-16 15:05:00 UTC',
                type: ''
            },
            headers: {
                // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                // accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                // 'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                // cookie: '__cfduid=d40568cb2f513df09c99e7698e2d202761594043769; ab.storage.deviceId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%2208a98635-964a-942e-4aa7-f5a8277129f7%22%2C%22c%22%3A1594043770325%2C%22l%22%3A1594043770325%7D; locale=zh-CN; _ga=GA1.2.1067444658.1594043770; _gid=GA1.2.1460006495.1594043770; _fbp=fb.1.1594043772346.1178853169; _hjid=183a33cf-ab06-4bc2-92f5-0ea69313a9cb; ab.storage.sessionId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%22a9ca93d5-3b5f-1665-9bfa-341289eb5a52%22%2C%22e%22%3A1594045722456%2C%22c%22%3A1594043770323%2C%22l%22%3A1594043922456%7D; _gat=1',

                // 'x-csrf-token': 'CJhqRifDW5d0DShLdxx1xiNP4TyP7B0bJ49vrsRFBJr3Ug8C5ze59DA5Z2F9mM0Ksk1x5ZVxAHVJU97vYAgHFQ==',
                // 'x-requested-with': 'XMLHttpRequest'
                // ':authority': 'www.pexels.com',
                // ':path': '/zh-cn/?format=js&seed=2020-04-18%2015%3A05%3A28%20UTC&type=',
                // ':scheme': 'https',
                // accept: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
                // 'accept-encoding': 'gzip, deflate, br',
                // 'accept-language': 'zh-CN,zh;q=0.9',
                // 'cache-control': 'no-cache',
                cookie: '__cfduid=d40568cb2f513df09c99e7698e2d202761594043769; ab.storage.deviceId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%2208a98635-964a-942e-4aa7-f5a8277129f7%22%2C%22c%22%3A1594043770325%2C%22l%22%3A1594043770325%7D; locale=zh-CN; _ga=GA1.2.1067444658.1594043770; _fbp=fb.1.1594043772346.1178853169; _gid=GA1.2.2023373995.1595225088; _hjid=183a33cf-ab06-4bc2-92f5-0ea69313a9cb; _hjAbsoluteSessionInProgress=1; ab.storage.sessionId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%2283c6187f-9387-34c9-7a10-40d461dc1510%22%2C%22e%22%3A1595226970076%2C%22c%22%3A1595225087452%2C%22l%22%3A1595225170076%7D',
                // pragma: 'no-cache',
                // referer: 'https://www.pexels.com/zh-cn/',
                // 'sec-fetch-dest': 'empty',
                // 'sec-fetch-mode': 'cors',
                // 'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                'x-csrf-token': 'rw06b2ozQl8meMdWV2iy2f5b9cEXncAclDiMlS3CPk+LnnGtIdnSsdheLScVBZafPQ1ewZpaae8tW8bortLVcQ==',
                // 'x-requested-with': 'XMLHttpRequest',
            },
        }).then((res) => {
            console.log('==========', res)
            // if (res.statusCode === 200){
            //     res.setEncoding('utf8')
            //     let resultData = ''
            //     res.on('data', (chunk) => { resultData += chunk })
            //     res.on('end', () => {
            //         try {
            //             reqObject = null
            //             resolve(analysisResult(resultData))
            //         } catch (error) {
            //             console.log('------------解析失败pexels:')
            //             reject()
            //         }
            //     })
            // }
            // else {
            //     console.log('------------请求失败pexels:')
            //     reject()
            //     reqObject = null
            // }
            // res.end()
        }).catch((err) => {
            console.log('------------', err)
            reject()
        })
    })
}


export const cancelImage = function () {
    if (reqObject && reqObject.getGlobalManager) {
        const { http2Clients } = reqObject.getGlobalManager({})
        Object.values(http2Clients).forEach((i) => { i.close() })
    }
}
