/* eslint-disable class-methods-use-this */
/**
 * pexels网站 https://500px.com/
 */


// 搜索
// https: //api.500px.com/v1/photos/search?type=photos&term=cat&image_size%5B%5D=1&image_size%5B%5D=2&image_size%5B%5D=32&image_size%5B%5D=31&image_size%5B%5D=33&image_size%5B%5D=34&image_size%5B%5D=35&image_size%5B%5D=36&image_size%5B%5D=2048&image_size%5B%5D=4&image_size%5B%5D=14&include_states=true&formats=jpeg%2Clytro&include_tags=true&exclude_nude=true&page=1&rpp=50


// 热门
// https: //api.500px.com/v1/photos?rpp=50&feature=popular&image_size%5B%5D=1&image_size%5B%5D=2&image_size%5B%5D=32&image_size%5B%5D=31&image_size%5B%5D=33&image_size%5B%5D=34&image_size%5B%5D=35&image_size%5B%5D=36&image_size%5B%5D=2048&image_size%5B%5D=4&image_size%5B%5D=14&sort=&include_states=true&include_licensing=true&formats=jpeg%2Clytro&only=&exclude=&personalized_categories=&page=1&rpp=50

import { axios, cheerio } from '$render/utils.js'
import { register } from './register'

const { CancelToken } = axios

export default class Source500px {
    constructor() {
        this.source = null
        this.cookies = ''
        this.csrToken = ''
        this.htmlAddress = ''
        
        this.options = {
            name: '500px',
            label: '500px',
            home: 'https://500px.com/popular',
            search: true
        }
    }
    

    /**
     * 先获取页面取得cookie等信息
     * @param {*} data 
     */
    getHtmlPage(data) {
        return new Promise((resolve, reject) => {
            if (data.searchKey) {
                this.htmlAddress = `https://500px.com/search?submit=%E6%8F%90%E4%BA%A4&q=${data.searchKey}&type=photos`
            } else {
                this.htmlAddress = 'https://500px.com/popular'
            }
            axios.get(this.htmlAddress).then((result) => {
                this.cookies = result.headers['set-cookie']
                const $ = cheerio.load(result.data)
                this.csrToken = $('meta[name="csrf-token"]')[0].attribs.content
                resolve()
            }).catch((error) => {
                console.log('-------------------500px获取cookie出错')
                reject(error)
            })
        })
    }

    async getImage(data) {
        if (this.cookies === '') {
            await this.getHtmlPage(data)
        }
        return new Promise(async (resolve, reject) => {
            if (!data) {
                resolve([])
            }
            let baseUrl = 'https://api.500px.com/v1/photos'
            const params = {
                image_size: [100, 200, 400, 600, 1600, 2048, 2500, 3000, 4096, 4500, 5120, 5500, 6144, 7168],
                page: data.page,
                rpp: 50, // 单页条数
                formats: 'jpeg,lytro'
            }
            if (data.searchKey) {
                baseUrl = 'https://api.500px.com/v1/photos/search'
                params.type = 'photos'
                params.term = data.searchKey
                params.include_tags = true
                params.exclude_nude = true
            } else {
                baseUrl = 'https://api.500px.com/v1/photos'
                params.feature = 'popular'
                params.only = 'All photographers,Pulse'
                params.include_licensing = true
                params.include_states = true
            }
            this.source = CancelToken.source()
            axios.get(baseUrl, {
                params,
                responseType: 'json',
                headers: {
                    Accept: 'application/json',
                    Origin: 'https://500px.com',
                    Referer: this.htmlAddress,
                    'User-Agent': 'Mozilla/5.0 (Macintosh Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
                    'x-csrf-token': null,
                    cookie: this.cookies
                },
                cancelToken: this.source.token
            }).then((result) => {
                this.source = null
                const urls = []
                const { photos } = result.data
                photos.forEach((item) => {
                    const obj = {
                        width: item.width,
                        height: item.height,
                        url: '',
                        downloadUrl: '',
                    }
                    const { images } = item
                    let maxSize = 0
                    for (let i = 0; i < images.length; i++) {
                        if (images[i].size >= 200 && images[i].size <= 700) {
                            obj.url = images[i].https_url
                        }
                        const realSize = images[i].https_url.match(/m%3D(\d*)/)
                        if (realSize && realSize[1]){
                            if (parseInt(realSize[1], 10) > maxSize) {
                                obj.downloadUrl = images[i].https_url
                            }
                            maxSize = parseInt(realSize[1], 10)
                        }
                    }
                    urls.push(obj)
                })
                resolve(urls)
            }).catch((err) => {
                this.source = null
                console.log('------------请求失败500px:', baseUrl)
                reject()
            })
        })
    }

    cancelImage() {
        if (this.source) {
            this.source.cancel()
            this.source = null
        }
    }
}

register(Source500px)
