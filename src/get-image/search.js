import { apiTranslation } from '../api/api'
import { imageSourceType } from '../utils/utils'

let type = ''

const pexels = require('./pexels')
const fiveHundred = require('./500px')
const paper = require('./paper')
const unsplash = require('./unsplash')
const wallhaven = require('./wallhaven')
const nasa = require('./nasa')
const themoviedb = require('./themoviedb')

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
