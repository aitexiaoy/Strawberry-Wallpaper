/*
 * @Description: 常用工具函数合集
 * @Author: --
 * @Date: 2019-02-14 09:06:39
 * @LastEditTime: 2019-04-09 10:16:30
 */

/**
 * 深度克隆一个对象
 * @param {*} obj 
 * @param {*} cache 
 */
export const deepClone = function (obj, cache = []) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    const hit = cache.find(c => c.original === obj)
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    cache.push({
        original: obj,
        copy
    })

    Object.keys(obj).forEach((key) => {
        copy[key] = deepClone(obj[key], cache)
    })

    return copy
}

/**
  * 判断类型
  * @param {*} obj 
  */
export const typeOf = (obj) => {
    const { toString } = Object.prototype
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    return map[toString.call(obj)]
}
