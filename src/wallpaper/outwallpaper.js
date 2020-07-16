

import wallpaper from 'wallpaper'
import { isMac } from '../utils/utils.js'


export const setCurrentWallpaper = function (file, options = { screen: 'all', scale: 'auto' }) {
    wallpaper.set(file, options)
}

export const changeWallpaperScale = async function (options = { screen: 'all', scale: 'auto' }){
    if (isMac){
        const screens = await wallpaper.screens()
        screens.forEach((i, index) => {
            wallpaper.get({ screen: index }).then((file) => {
                setCurrentWallpaper(file, { screen: index, scale: options.scale })
            })
        })
    }
    else {
        const file = await wallpaper.get()
        setCurrentWallpaper(file, options)
    }
}
