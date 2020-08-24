/* eslint-disable class-methods-use-this */
/** *
 * pexels网站 https://unsplash.com/t/wallpapers
 * 
 * 
 * 获取壁纸
 * https://unsplash.com/napi/collections/1065976/photos?
 * page=6
 * per_page=10
 * order_by=latest
 * share_key=a4a197fc196734b74c9d87e48cc86838
 * 
 * 主图片
 * https://unsplash.com/napi/photos?page=3&per_page=12
 * 
 * 
 * 
 * 搜索
 * https://unsplash.com/napi/search?query=cat&xp=&per_page=20
 * 
 */
import { axios } from '$render/utils.js'
import { register } from './register'

const { CancelToken } = axios

export class SourceUnsplash {
    constructor() {
        this.source = null
        this.options = {
            name: 'unsplash',
            label: 'unsplash',
            home: 'https://unsplash.com/',
            search: true
        }
    }

    getImage(data) {
        return new Promise((resolve, reject) => {
            if (!data) {
                resolve([])
            }
            let baseUrl = 'https://unsplash.com/napi/collections/1065976/photos'
            let searchFalg = false
            let params = {
                page: data.page,
                order_by: 'latest',
                per_page: 50,
                share_key: 'a4a197fc196734b74c9d87e48cc86838'
            }
            if (data.searchKey) {
                baseUrl = 'https://unsplash.com/napi/search/photos'
                searchFalg = true
                params = {
                    query: data.searchKey,
                    xp: '',
                    per_page: 50,
                    page: data.page,
                }
            }
            this.source = CancelToken.source()
            axios.get(baseUrl, {
                params,
                cancelToken: this.source.token
            }).then((result) => {
                this.source = null
                const urls = []
                let newRes = result.data
                if (searchFalg){
                    newRes = result.data.results
                }
                newRes.forEach((item) => {
                    const obj = {
                        width: item.width,
                        height: item.height,
                        url: item.urls.small,
                        downloadUrl: item.urls.full,
                    }
                    urls.push(obj)
                })
                resolve(urls)
            }).catch(() => {
                this.source = null
                console.log('------------请求失败unsplash:', baseUrl)
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

register(SourceUnsplash)
