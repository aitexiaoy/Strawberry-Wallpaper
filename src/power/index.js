
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
    cheerio: require('cheerio'),
    got: require('got'),
    axios,
    autoOpen: require('./auto-open'),
    mail: require('./mail'),
    userConfig: require('../../.user-config'),
    download: require('./download'),
    wallpaper: require('./wallpaper'),
    getSystemInfo: require('./system-info'),
    utils: require('./utils')
}

module.exports = modules
