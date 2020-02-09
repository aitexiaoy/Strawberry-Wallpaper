const elog = require('electron-log')

elog.transports.file.level = 'debug'


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
    // eslint-disable-next-line no-underscore-dangle
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

export const log = elog

const os = require('os')

export const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : `file://${__dirname}/index.html`

const OSTYPES = {
    Darwin: 'mac',
    Windows_NT: 'win'
}

export const osType = OSTYPES[os.type()] || 'win'
export function isMac() {
    return osType === 'mac'
}

export function isWin() {
    return osType === 'win'
}

export function isDev() {
    return process.env.NODE_ENV === 'development'
}

export const imageSourceType = [{
    name: 'pexels',
    value: 'pexels',
    home: 'https://www.pexels.com/',
    search: true,
},
{
    name: '500px',
    value: '500px',
    home: 'https://500px.com/popular',
    search: true
},
{
    name: 'paper',
    value: 'paper',
    search: false
},
{
    name: 'unsplash',
    value: 'unsplash',
    home: 'https://unsplash.com/',
    search: true
},
{
    name: 'wallhaven',
    value: 'wallhaven',
    home: 'https://wallhaven.cc/latest/',
    search: true
},
{
    name: 'NASA',
    value: 'nasa',
    home: 'https://www.nasa.gov/multimedia/imagegallery/iotd.html',
    search: false,
},
{
    name: '电影',
    value: 'themoviedb',
    home: 'https://www.themoviedb.org/',
    search: true,
    isSupportChinaSearch: true // 是否支持中文搜索
}
]

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
