import { isWin } from './utils.js'

const os = require('os')
/**
 * 浏览器请求头
 */
export const browserHeader = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
    'Cache-Control': 'max-age=0',
    Connection: 'keep-alive'
}

export const apiBaseUrl = 'http://strawberry.wangkaibo.com'

export const defaultConfig = {
    imageSource: '500px', // 图片来源
    isOpenStatr: false, // 开机启动
    wallpaperAutoUp: false, // 壁纸自动更新
    updataTime: 3600, // 自动更新时间
    timingWipeData: true, // 定时清空已下载图库
    downloadImagePath: `${os.homedir()}${isWin() ? '\\Downloads\\wallpaper' : '/Downloads/wallpaper'} `,
    wallpaperScale: 'auto', // 壁纸填充方式
    autoClearnDownloadFilesTime: 7, // 自动清空下载文件夹

    autoSetAllScreens: true, // 自动设置壁纸到所有桌面

    wallpaperSizeWidth: 1600, // 筛选的宽
    wallpaperSizeHeight: 1080, // 筛选的高
    wallpaperSizeDirection: [], // 筛选方向 'heng', 'su'
}
