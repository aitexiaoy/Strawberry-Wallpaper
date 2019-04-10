/**
 * paper
 * 接口地址
 * https://api.unsplash.com/photos?client_id=1c0018090c0878f9556fba12d4b8ba060866de2733de1cc8486c720bf7c9a04e&order_by=latest&page=1&per_page=20
 * 
 * url:https://api.unsplash.com/photos
 * 参数：
 *      client_id:1c0018090c0878f9556fba12d4b8ba060866de2733de1cc8486c720bf7c9a04e
 *      order_by:latest|popular   最新|最热
 *      page:1
 *      per_page:20
 *  
 */


const axios = require('axios')

const { CancelToken } = axios
let source = null

const { axiosGet } = require('../utils/axios.js')

export const getImage = function (data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            resolve([])
        }
        const baseUrl = 'https://api.unsplash.com/photos/'
        source = CancelToken.source()
        axiosGet({
            url: baseUrl,
            params: {
                page: data.page,
                client_id: '1c0018090c0878f9556fba12d4b8ba060866de2733de1cc8486c720bf7c9a04e',
                order_by: data.searchKey || 'latest',
                per_page: 50
            },
            cancelToken: source.token
        }).then((result) => {
            source = null
            const urls = []
            result.forEach((item) => {
                const obj = {
                    width: item.width,
                    height: item.height,
                    url: item.urls.small,
                    downloadUrl: item.urls.raw,
                }
                urls.push(obj)
            })
            resolve(urls)
        }).catch((err) => {
            source = null
            console.log(err)
            reject()
        })
    })
}

export const cancelImage = function () {
    if (source) {
        source.cancel()
    }
}
