const elog = require("electron-log");
elog.transports.file.level = "debug";


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  }

export const log=elog;

const os = require('os');
export const base_url=process.env.NODE_ENV === 'development' ?`http://localhost:9080` :`file://${__dirname}/index.html`

export const osType=os.type();
export function isMac(){
    return osType==='Darwin'
}

export function isWin(){
    return osType==='Windows_NT'
}

export function isDev(){
    return process.env.NODE_ENV === 'development'
}