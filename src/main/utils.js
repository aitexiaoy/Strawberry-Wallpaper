
const electron = require('electron')
const path = require('path')

const { nativeImage } = electron


/**
 * 创建一个图标
 * @param {String} ad 图标地址
 * @param {Number} size 图标尺寸 
 */
function Icon(ad, size){
    const img = nativeImage.createFromPath(path.resolve(__static, ad))
    if (size){
        return img.resize({ width: size, height: size })
    }
    return img
}

module.exports = {
    Icon
}
