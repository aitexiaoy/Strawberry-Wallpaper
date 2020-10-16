/* eslint-disable class-methods-use-this */


import { axios } from '$render/utils.js'
import { register } from './register'

const paperApi = 'https://service.paper.meiyuan.in/api/v2/columns'


const { CancelToken } = axios

export default class SourcePaper {
    constructor() {
        this.source = null
        this.search = false
        // 搜索分类
        this.searchSelectLists = []
        this.options = {
            name: 'paper',
            label: 'paper',
            search: false
        }
    }

    getSearchSelectLists(){
        const returnResult = []
        return new Promise((resolve, reject) => {
            axios.get(paperApi).then((result) => {
                for (const item of result){
                    returnResult.push({
                        name: item.langs['zh-Hans-CN'],
                        value: item._id
                    })
                }
                this.searchSelectLists = [...returnResult]
                resolve(returnResult)
            }).catch(() => {
                resolve(returnResult)
            })
        })
    }
    
    getImage(data) {
        return new Promise((resolve, reject) => {
            if (!data || !data.searchKey) {
                resolve([])
                return
            }
            const baseUrl = `${paperApi}/flow/${data.searchKey}`
            this.source = CancelToken.this.source()
            axios({
                url: baseUrl,
                params: {
                    page: data.page + 1,
                    per_page: 50
                },
                cancelToken: this.source.token
            }).then((result) => {
                this.source = null
                const urls = []
                result.data.forEach((item) => {
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
                this.source = null
                console.log('------------请求失败paper:', baseUrl, data)
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


register(SourcePaper)
