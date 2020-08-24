/* eslint-disable no-undef */
import electron from 'electron'
import path from 'path'

const { nativeImage } = electron


/**
 * 创建一个图标
 * @param {String} ad 图标地址
 * @param {Number} size 图标尺寸 
 */
export function Icon(ad, size){
    const img = nativeImage.createFromPath(path.resolve(__static, ad))
    if (size){
        return img.resize({ width: size, height: size })
    }
    return img
}
