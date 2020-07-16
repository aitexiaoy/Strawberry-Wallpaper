import os from 'os'
import { isWin } from './utils.js'

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

// 定义接口请求的基地址
export const apiBaseUrl = 'http://strawberry.wangkaibo.com'

// 默认配置
export const defaultConfig = {
    imageSource: '500px', // 图片来源
    isOpenStatr: false, // 开机启动
    wallpaperAutoUp: false, // 壁纸自动更新
    updataTime: 3600, // 自动更新时间
    timingWipeData: true, // 定时清空已下载图库
    downloadImagePath: `${os.homedir()}${isWin ? '\\Downloads\\wallpaper' : '/Downloads/wallpaper'} `,
    wallpaperScale: 'auto', // 壁纸填充方式
    autoClearnDownloadFilesTime: 7, // 自动清空下载文件夹

    autoSetAllScreens: true, // 自动设置壁纸到所有桌面

    wallpaperSizeWidth: 1600, // 筛选的宽
    wallpaperSizeHeight: 1080, // 筛选的高
    wallpaperSizeDirection: [], // 筛选方向 'heng', 'su'
}

// 定义提示信息
export const infoShowText = {
    loading: '美好的事情即将发生...',
    noData: '暂时没有得到想要的内容...',
    netError: '&nbsp &nbsp &nbsp &nbsp网络暂时发生了错误，请求不到数据了。可能原因是网络没有正常连接，请确保网络已连接。'
    + '也可能是所选择图库相关接口已修改，请在设置->意见反馈中联系作者，或者在设置中换个图库试试。非常感谢你的支持。',
    null: '',
    noMatchFilter: '请求到了内容但不满足筛选条件，请更换筛选条件...'
}


// 定义存储最近搜索的最大长度
export const searchKeyMax = 8
// 定义默认搜索关键词
export const defaultSearchList = ['cat', 'dog', '沙漠', '自然', '食物']
