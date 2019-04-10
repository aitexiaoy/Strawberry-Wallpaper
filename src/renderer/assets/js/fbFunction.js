/*
 * @Description: 函数注册
 * @Author: yangpeng
 * @Date: 2019-01-21 18:29:06
 * @LastEditTime: 2019-04-09 20:57:19
 */

const localStorage = require('./local_storage')
const cookie = require('./cookie')
const { deepClone, typeOf } = require('./fbFunction_fn.js')

export default {
    version: '0.0.1',
    install(Vue) {
        Vue.prototype.$deepClone = deepClone
        Vue.prototype.$localStorage = localStorage
        Vue.prototype.$cookie = cookie
        Vue.prototype.$typeOf = typeOf
    },
}
