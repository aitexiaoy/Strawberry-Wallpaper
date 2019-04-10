/*
 * @Description: 设置开机启动
 * @Author: yangpeng
 * @Date: 2019-02-19 10:51:01
 * @LastEditTime: 2019-04-09 09:48:22
 */

const AutoLaunch = require('auto-launch')

const minecraftAutoLauncher = new AutoLaunch({
    name: 'Strawberry Wallpaper',
})
 
export const openAutoStart = function (){
    return minecraftAutoLauncher.enable() // 设置开机自动启动
}

export const openDisStart = function (){
    return minecraftAutoLauncher.disable() // 禁止开机自动启动
}

export const openType = async function (){
    await minecraftAutoLauncher.isEnabled()
}
