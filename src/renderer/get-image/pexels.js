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
        const url = baseUrl
        console.log('------------', url)
        reqObject = got.get(url, {
            method: 'GET',
            http2: true,
            searchParams: {
                format: 'js',
                seed: '2020-09-28 11:56:55 UTC',
                type: '',
            },
            headers: {
                cookie: `ab.storage.deviceId.5791d6db-4410-4ace-8814-12c903a548ba:%7B%22g%22%3A%2208a98635-964a-942e-4aa7-f5a8277129f7%22%2C%22c%22%3A1594043770325%2C%22l%22%3A1594043770325%7D;_ga:GA1.2.1067444658.1594043770;
                _fbp:fb.1.1594043772346.1178853169;
                pexels_auth:true;
                ab.storage.userId.5791d6db-4410-4ace-8814-12c903a548ba:%7B%22g%22%3A%223273119%22%2C%22c%22%3A1595228766092%2C%22l%22%3A1595228766092%7D;
                __cfduid:dddf34aa364822e49bbd359fba2abf1041601458245;
                _gid:GA1.2.1202628450.1601458253;
                remember_user_token:eyJfcmFpbHMiOnsibWVzc2FnZSI6Ilcxc3pNamN6TVRFNVhTd2lKREpoSkRFd0pHcERiVTl4ZHpBeEwxazJVamRQY1U5S1dIWjJjRThpTENJeE5qQXhORFU0TWpVekxqUXlPRGs0TWpNaVhRPT0iLCJleHAiOiIyMDIxLTA5LTMwVDA5OjMwOjUzLjQyOVoiLCJwdXIiOiJjb29raWUucmVtZW1iZXJfdXNlcl90b2tlbiJ9fQ%3D%3D--981d2a5cd64e6dfeb64603e61bb6b5de59ac44c8;
                locale:zh-CN;
                _hjTLDTest:1;
                _hjid:183a33cf-ab06-4bc2-92f5-0ea69313a9cb;
                _hjAbsoluteSessionInProgress:1;
                ab.storage.sessionId.5791d6db-4410-4ace-8814-12c903a548ba:%7B%22g%22%3A%22b319d860-f7c1-3a78-e7c2-094647f81caf%22%2C%22e%22%3A1601461662443%2C%22c%22%3A1601458251441%2C%22l%22%3A1601459862443%7D;
                _pexels_session:2IbaQQ4au43QlL7QbVasM%2F62lJ1m%2FNwMij1Sui%2Fe3OuPIWmcIKpTsw6GKEbJalBdLHYgMx%2BTdIxrJtA2DDGpkMNGEOu3Gbdf9PxMO9Sx2D8xfZoLTJrXaj1djSdWEiEPZ7m2Jy%2FWnH3kYAf5gYIfW7l5TYYYT26NGMzSkcSfeQkkwQAriZeocWDHqDt7ZKiYc9iJYsYgarEjrDCNaZlg%2Bnc54S%2F%2FpCNgGSytSnzSGsfDm8kEwSmHBmw8QdrK09Fa8PKYIWbbzKVhKgoJ%2Bc%2FgVs0JLZWHH3ZR8ZNg7s%2Bw%2BMmqfxTm%2BF5ucBqQYzSy%2BVmGb5E5VbHgyIKUsflTmpU181n5sxbRv8KXwYNorK8Z5x4ocsKKfqZUWavOB%2F5Q3GJCDupPeNSrIw%3D%3D--PzrO4O1MVogCX%2FsL--my6GBqgd3N6S%2B0c6GjfqeA%3D%3D;`
                
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
