
const axios = require('axios')

const onFulfilled = (response) => {
    const { data, status } = response
    if (status === 200) {
        return response
    }
    throw new Error('请求失败')
}

axios.interceptors.response.use(onFulfilled)

const modules = {
    cheerio: require('cheerio'), // 解析dom
    got: require('got'), // got库
    axios, // axios库
    autoOpen: require('./auto-open'), // 开机自动启动
    mail: require('./mail'),
    userConfig: require('../../.user-config'), // 用户配置
    download: require('./download'), // 下载文件
    wallpaper: require('./wallpaper'), // 壁纸
    getSystemInfo: require('./system-info'),
    utils: require('./utils') // 工具库
}

module.exports = modules
