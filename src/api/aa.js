
const axios = require('axios')
const cheerio = require('cheerio')

let nextPageSeed = ''
const urls = []
/**
 * 获得第一页
 */
function getFirstPage(){
    const url = 'https://www.pexels.com/search/animal/?page=400&seed=2019-07-01%2B14%3A54%3A14%2B%2B0000&type='
    return new Promise((resolve, reject) => {
        axios.get(url).then((result) => {
            const $ = cheerio.load(result.data)
            nextPageSeed = $('.next_page')[0].attribs.href
            const imageItems = $('.photo-item__img')
            const imageItemsLength = imageItems.length
            for (let i = 0; i < imageItemsLength; i++){
                const { attribs } = imageItems[i]
                const obj = {
                    width: attribs['data-image-width'],
                    height: attribs['data-image-height'],
                    url: attribs['data-large-src'],
                    downloadUrl: attribs['data-big-src'].split('?')[0]
                }
                // 剔除重复的地址
                if (parseInt(obj.width, 10) > 1600) {
                    urls.push(obj)
                }
            }
            resolve()
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    }) 
}

getFirstPage()
