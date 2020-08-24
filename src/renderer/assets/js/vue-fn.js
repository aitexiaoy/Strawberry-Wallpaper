/*
 * @Description: 函数注册
 * @Author: --
 * @Date: 2019-01-21 18:29:06
 * @LastEditTime: 2019-04-09 20:57:19
 */

import { ipcRenderer } from 'electron'
import { deepClone, typeOf } from './common-fn'
import localStorage from './local-storage'

export default {
    version: '0.0.1',
    install(Vue) {
        Vue.prototype.$deepClone = deepClone
        Vue.prototype.$localStorage = localStorage
        Vue.prototype.$typeOf = typeOf
        Vue.prototype.$ipcRenderer = ipcRenderer
    },
}
