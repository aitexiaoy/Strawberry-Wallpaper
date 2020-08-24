
import elog from 'electron-log'
import os from 'os'

export { version } from '../../package'

export const isDev = process.env.NODE_ENV === 'development'
export const isPro = process.env.NODE_ENV === 'production'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (isPro) {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}


elog.transports.file.level = 'debug'
export const log = elog

export const baseUrl = isDev ? 'http://localhost:9080' : `file://${__dirname}/index.html`

const OSTYPES = {
    Darwin: 'mac',
    Windows_NT: 'win'
}

export const osType = OSTYPES[os.type()] || 'win'
export const isMac = osType === 'mac'
export const isWin = osType === 'win'
