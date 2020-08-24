
const os = require('os')
const elog = require('electron-log')
const fse = require('fs-extra')


const isDev = process.env.NODE_ENV === 'development'
const isPro = process.env.NODE_ENV === 'production'

const { version } = require('../../package.json')

elog.transports.file.level = 'debug'
const log = elog

if (isPro) {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}


const OSTYPES = {
    Darwin: 'mac',
    Windows_NT: 'win'
}

const baseUrl = isDev ? 'http://localhost:9080' : `file://${__dirname}/index.html`


const osType = OSTYPES[os.type()] || 'win'
const isMac = osType === 'mac'
const isWin = osType === 'win'

/**
 * 删除指定目录
 * @param {String} filePath 
 */
async function deletePath(filePath){
    try {
        await fse.remove(filePath)
    } catch (error) {
        log.error(error)
    }
}

module.exports = {
    isDev,
    isPro,
    version,
    log,
    osType,
    isMac,
    isWin,
    baseUrl,
    deletePath
}
