import path from 'path'

// eslint-disable-next-line no-undef
const fileBasePath = file => path.resolve(__static, `${file}`)

const allPower = require('electron').remote.require(fileBasePath('power.js'))


export default allPower

export const { axios } = allPower

export const { cheerio } = allPower

export const { got } = allPower

export const { userConfig } = allPower

export const { utils } = allPower

export const { mail } = allPower

export const { getSystemInfo } = allPower

export const { autoOpen } = allPower

export const { wallpaper } = allPower
