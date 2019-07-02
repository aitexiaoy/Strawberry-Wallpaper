const elog = require('electron-log');

elog.transports.file.level = 'debug';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
    // eslint-disable-next-line no-underscore-dangle
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

export const log = elog;

const os = require('os');

export const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : `file://${__dirname}/index.html`

const OSTYPES = {
    Darwin: 'mac',
    Windows_NT: 'win'
}

export const osType = OSTYPES[os.type()] || 'win';
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
    search: true
},
{
    name: '500px',
    value: '500px',
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
    search: true
},
]
