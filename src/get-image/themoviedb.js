/* eslint-disable max-len */

import userConfig from '../../.user-config'

const { themoviedbAppKey } = userConfig
const APIKEY = themoviedbAppKey
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


const axios = require('axios')

const { CancelToken } = axios
let source = null


const { axiosGet } = require('../utils/axios')

const getImages = function (movieId, type){
    return new Promise((resolve) => {
        axiosGet({
            url: `https://api.themoviedb.org/3/${type}/${movieId}/images`,
            params: {
                api_key: APIKEY
            },
        }).then((result) => {
            const { backdrops } = result
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

export const getImage = function (data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            resolve([])
            return
        }
        source = CancelToken.source()
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
        axiosGet({ url, params, cancelToken: source.token }).then(async (result) => {
            const { results } = result
            let urls = []
            await Promise.all(results.map(async (item) => {
                const { id, media_type: mediaType = 'movie' } = item
                const movieImages = await getImages(id, mediaType)
                urls = [...movieImages, ...urls]
                return Promise.resolve
            }))
            resolve(urls)
        }).catch((error) => {
            source = null
            console.log('------------请求失败tmdb:', error)
            reject()
        })
    })
}

export const cancelImage = function () {
    if (source) {
        source.cancel()
    }
}
