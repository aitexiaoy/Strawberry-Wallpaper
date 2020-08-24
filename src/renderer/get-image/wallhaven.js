/** *
 * https://wallhaven.cc
 * 
 * 
 * 获取壁纸
 * https://wallhaven.cc/latest?
 * page=2
 * 
 * 
 * 搜索
 * https://wallhaven.cc/search?q=cat&categories=111&purity=100&sorting=date_added&order=desc
 * page=2
 * 
 */

import { axios, cheerio } from '$render/utils.js'
import { register } from './register'


const { CancelToken } = axios

export default class SourceWallham {
    constructor() {
        this.source = null
        this.options = {
            name: 'wallhaven',
            label: 'wallhaven',
            home: 'https://wallhaven.cc/latest',
            search: true
        }
    }

    getImage(data) {
        return new Promise((resolve, reject) => {
            if (!data) {
                resolve([])
            }
            let baseUrl = 'https://wallhaven.cc/latest'
            let params = {}
            if (data.page > 0){
                params.page = data.page + 1
            }
            if (data.searchKey) {
                baseUrl = 'https://wallhaven.cc/search'
                params = {
                    ...params,
                    q: data.searchKey,
                    categories: 111,
                    purity: 100,
                    sorting: 'date_added',
                    order: 'desc'
                }
            }
            this.source = CancelToken.source()

            axios.get(baseUrl, {
                params,
                cancelToken: this.source.token
            }).then((result) => {
                this.source = null
                const urls = []
                const $ = cheerio.load(result.data)
                
                $('figure').each((index, node) => {
                    const wallpaperId = node.attribs['data-wallpaper-id']
                    const url = $(node).find('img').attr('data-src')
                    const isPng = Boolean($(node).find('.png').length)
                    const [width, height] = $(node).find('.wall-res').html().split('x')
                    const downloadUrl = `https://w.wallhaven.cc/full/${wallpaperId.slice(0, 2)}/wallhaven-${wallpaperId}.${isPng ? 'png' : 'jpg'}`
                    const obj = {
                        width: width.trim(),
                        height: height.trim(),
                        url,
                        downloadUrl,
                    }
                    urls.push(obj)
                })
                resolve(urls)
            }).catch(() => {
                this.source = null
                console.log('------------请求失败wallhaven:', baseUrl)
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

register(SourceWallham)
