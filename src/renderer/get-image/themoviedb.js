/* eslint-disable class-methods-use-this */

import { axios } from '$render/utils.js'
import { register } from './register'


const APIKEY = ''
const MOVELISTAPI = 'https://api.themoviedb.org/3/discover/movie'
const ALLSEARCHAPI = 'https://api.themoviedb.org/3/search/multi'
const MOVELISTPARAMS = {
    api_key: APIKEY,
    language: 'zh-CN',
    sort_by: 'popularity.desc',
    include_adult: false,
    include_video: false,
    page: 1
}

const BASEIMAGEDOWNURL = 'https://image.tmdb.org/t/p/original'
const BASEIMAGEURL = 'https://image.tmdb.org/t/p/w500'

// const GETMOVEIMAGEURL='https://api.themoviedb.org/3/movie/${moveid}/images?api_key='

const { CancelToken } = axios

export default class SourceThemoviedb {
    constructor() {
        this.source = null
        this.options = {
            label: '电影',
            name: 'themoviedb',
            home: 'https://www.themoviedb.org/',
            search: true,
            isSupportChinaSearch: true // 是否支持中文搜索
        }
    }

    getImages(movieId, type){
        return new Promise((resolve) => {
            axios({
                url: `https://api.themoviedb.org/3/${type}/${movieId}/images`,
                params: {
                    api_key: APIKEY
                },
            }).then((result) => {
                const { backdrops } = result.data
                const urls = []
                backdrops.forEach((item) => {
                    const { width, height, file_path: filePath } = item
                    urls.push({
                        width,
                        height,
                        url: `${BASEIMAGEURL}${filePath}`,
                        downloadUrl: `${BASEIMAGEDOWNURL}${filePath}`,
                    })
                })
                resolve(urls)
            }).catch((err) => {
                resolve([])
            })
        })
    }
    
    getImage(data) {
        return new Promise((resolve, reject) => {
            if (!data) {
                resolve([])
                return
            }
            this.source = CancelToken.this.source()
            let url = MOVELISTAPI
            let params = {
                ...MOVELISTPARAMS,
                page: data.page + 1
            }
            if (data.searchKey){
                url = ALLSEARCHAPI
                params = {
                    api_key: APIKEY,
                    // language: 'zh-CN',
                    page: data.page + 1,
                    include_adult: false,
                    query: data.searchKey
                }
            }
            axios({ url, params, cancelToken: this.source.token }).then(async (result) => {
                const { results } = result.data
                let urls = []
                await Promise.all(results.map(async (item) => {
                    const { id, media_type: mediaType = 'movie' } = item
                    const movieImages = await this.getImages(id, mediaType)
                    urls = [...movieImages, ...urls]
                    return Promise.resolve
                }))
                resolve(urls)
            }).catch((error) => {
                this.source = null
                console.log('------------请求失败tmdb:', error)
                reject()
            })
        })
    }
    
    cancelImage() {
        if (this.source) {
            this.source.cancel()
        }
    }
}

register(SourceThemoviedb)
