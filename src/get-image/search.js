import { apiTranslation } from '../api/api'
import { imageSourceType } from '../utils/utils'

import * as pexels from './pexels'
import * as fiveHundred from './500px'
import * as paper from './paper'
import * as unsplash from './unsplash'
import * as wallhaven from './wallhaven'
import * as nasa from './nasa'
import * as themoviedb from './themoviedb'

let type = ''

const cancelFn = {
    pexels: pexels.cancelImage,
    '500px': fiveHundred.cancelImage,
    paper: paper.cancelImage,
    unsplash: unsplash.cancelImage,
    wallhaven: unsplash.cancelImage,
    nasa: nasa.cancelImage,
    themoviedb: themoviedb.cancelImage
}

const getUrl = {
    pexels: pexels.getImage,
    '500px': fiveHundred.getImage,
    paper: paper.getImage,
    unsplash: unsplash.getImage,
    wallhaven: wallhaven.getImage,
    nasa: nasa.getImage,
    themoviedb: themoviedb.getImage
}

export const getUrls = function (data) {
    return new Promise(async (resolve, reject) => {
        type = data.imageSource
        const currentImageSource = imageSourceType.find(i => i.value === type)
        data.searchKey = currentImageSource.isSupportChinaSearch ? data.searchKey : await apiTranslation(data.searchKey)
        getUrl[type](data).then((urls) => {
            resolve(urls)
        }).catch((error) => {
            reject(error)
        }).finally(() => {
            type = ''
        })
    })
}

export const cancelUrls = function () {
    if (type !== '') {
        cancelFn[type]()
    }
}
