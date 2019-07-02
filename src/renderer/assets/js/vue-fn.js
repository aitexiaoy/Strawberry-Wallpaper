/*
 * @Description: 函数注册
 * @Author: --
 * @Date: 2019-01-21 18:29:06
 * @LastEditTime: 2019-04-09 20:57:19
 */

import axios from 'axios'

const { ipcRenderer } = require('electron')
const localStorage = require('./local-storage')
const { deepClone, typeOf } = require('./common-fn')

export default {
    version: '0.0.1',
    install(Vue) {
        Vue.prototype.$deepClone = deepClone
        Vue.prototype.$localStorage = localStorage
        Vue.prototype.$typeOf = typeOf
        Vue.prototype.$ipcRenderer = ipcRenderer;
        Vue.prototype.$http = axios
    },
}
