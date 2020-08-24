/* eslint-disable max-len */

import { axios } from '$render/utils.js'
import { register } from './register'


const BASEPARAMS = {
    size: 50,
    from: 0,
    sort: 'promo-date-time:desc',
    q: '((ubernode-type:image) AND (routes:1446))',
    _source_include: 'promo-date-time,master-image,nid,title,topics,missions,collections,other-tags,ubernode-type,primary-tag,secondary-tag,cardfeed-title,type,collection-asset-link,link-or-attachment,pr-leader-sentence,image-feature-caption,attachments,uri'
}

const BASEURL = 'https://www.nasa.gov/api/2/ubernode/_search'

const PUBLICURL = 'https://www.nasa.gov/sites/default/files/styles/image_card_4x3_ratio/public/'
const DOWNLOADPUBLICURL = 'https://www.nasa.gov/sites/default/files/'


const { CancelToken } = axios


export class SourceNasa {
    constructor() {
        this.source = null
        this.search = false
        this.options = {
            name: 'nasa',
            label: 'NASA',
            home: 'https://www.nasa.gov/multimedia/imagegallery/iotd.html',
            search: false
        }
    }

    getImage(data) {
        return new Promise((resolve, reject) => {
            if (!data) {
                resolve([])
                return
            }
            const baseUrl = BASEURL
            this.source = CancelToken.source()
            axios.get(baseUrl, {
                params: {
                    ...BASEPARAMS,
                    from: (data.page * BASEPARAMS.size)
                },
                cancelToken: this.source.token
            }).then((result) => {
                this.source = null
    
                const { hits: { hits } } = result.data
                const urls = []
    
                hits.forEach((item) => {
                    const { _source: { 'master-image': imageData } } = item
                    const { width, height, uri } = imageData
                    const obj = {
                        width,
                        height,
                        url: uri.replace('public://', PUBLICURL),
                        downloadUrl: uri.replace('public://', DOWNLOADPUBLICURL),
                    }
                    urls.push(obj)
                })
                resolve(urls)
            }).catch((error) => {
                this.source = null
                console.log('------------请求失败nasa:', error)
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


register(SourceNasa)
