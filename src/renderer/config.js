import os from 'os'
import path from 'path'

// 定义接口请求的基地址
export const apiBaseUrl = 'http://strawberry.wangkaibo.com'

// 默认配置
export const defaultConfig = {
    imageSource: '500px', // 图片来源
    isOpenStatr: false, // 开机启动
    wallpaperAutoUp: false, // 壁纸自动更新
    updataTime: 3600, // 自动更新时间
    timingWipeData: true, // 定时清空已下载图库
    downloadImagePath: `${os.homedir()}${['Downloads', 'wallpaper'].join(path.sep)} `, // 下载图片保存目录
    wallpaperScale: 'auto', // 壁纸填充方式
    autoClearnDownloadFilesTime: 999999, // 自动清空下载文件夹

    autoSetAllScreens: true, // 自动设置壁纸到所有桌面

    wallpaperSizeWidth: 1600, // 筛选的宽
    wallpaperSizeHeight: 1080, // 筛选的高
    wallpaperSizeDirection: ['heng', 'su'], // 筛选方向 'heng', 'su'
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

export const wallpaperScaleOptions = [
    {
        name: '自动',
        value: 'auto',
    },
    {
        name: '适合于屏幕',
        value: 'fit',
    },
    {
        name: '拉伸以充满屏幕',
        value: 'stretch',
    },
    {
        name: '居中',
        value: 'center',
    },
    {
        name: '平铺',
        value: 'fill',
    },
]
