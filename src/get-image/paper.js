
import axios from 'axios'
import { axiosGet } from '../utils/axios'

const { CancelToken } = axios
let source = null

export const getPaperSetting = function (data){
    const returnResult = []
    return new Promise((resolve, reject) => {
        axiosGet({
            url: 'https://service.paper.meiyuan.in/api/v2/columns'
        }).then((result) => {
            for (const item of result){
                returnResult.push({
                    name: item.langs['zh-Hans-CN'],
                    value: item._id
                })
            }
            resolve(returnResult)
        }).catch(() => {
            resolve(returnResult)
        })
    })
}

export const getImage = function (data) {
    return new Promise((resolve, reject) => {
        if (!data || !data.searchKey) {
            resolve([])
            return
        }
        const baseUrl = `https://service.paper.meiyuan.in/api/v2/columns/flow/${data.searchKey}`
        source = CancelToken.source()
        axiosGet({
            url: baseUrl,
            params: {
                page: data.page + 1,
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
        }).catch((error) => {
            source = null
            console.log('------------请求失败paper:', baseUrl, data)
            reject()
        })
    })
}

export const cancelImage = function () {
    if (source) {
        source.cancel()
    }
}
