/****
 * 常用工具函数合集
 * 2018-03-21
 */

//导入 localstorage 的操作
import localStorage from './local_storage.js';

//导入 cookie 的操作
import cookie from './cookie.js';
import {
  deepClone ,
  typeOf ,
  page_change ,
} from './fbFunction_fn.js'
export default {
  version: '0.0.1',
  install: function (Vue) {
    Vue.prototype.$deepClone = deepClone;
    Vue.prototype.$localStorage = localStorage;
    Vue.prototype.$cookie = cookie;
    Vue.prototype.$typeOf = typeOf;
    Vue.prototype.$pageChange = page_change;
  },
}
