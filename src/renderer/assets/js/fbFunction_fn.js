/****
 * 常用工具函数合集
 * 2018-03-21
 */
/**
 * 深度克隆一个对象
 * @param {*} obj
 */
//深度克隆
export const deepClone = function (obj, cache = []) {
  // 判断原对象是否存在
  // if (obj) {
  //     var newObj = JSON.parse(JSON.stringify(obj));
  //     return newObj;
  // }
  // just return if obj is immutable value
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

  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], cache)
  })

  return copy
}

/*******
 * 判断类型
 */

export const typeOf = (obj) => {
  const toString = Object.prototype.toString;
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
  };
  return map[toString.call(obj)];
}


/**
 *
 * @param {总数据} total_data
 * @param {当前页数，从0开始} page_no
 * @param {page_size} page_size
 */
export const page_change = (total_data, page_no, page_size, filter_data) => {
  let _temp_total_data = [];
  if (filter_data) {
    let total = Object.keys(filter_data).length;
    _temp_total_data = total_data.filter(item => {
      let aa = 0;
      for (let index in filter_data) {
        if (filter_data[index] === '') {
          aa++;
          continue;
        }
        if (typeof item[index] != 'undefined') {
          if (item[index] === filter_data[index]) {
            aa++;
          } else if (typeOf(item[index].toString()) === 'string' && item[index].toString().match(filter_data[index].toString())) {
            aa++;
          }
        }
      }
      if (aa == total) {
        return true;
      }
    })
  } else {
    _temp_total_data = total_data.slice(0);
  }
  let start = page_no * page_size;
  let end = Math.min((page_no + 1) * page_size, _temp_total_data.length);
  let re_data = {
    total: _temp_total_data.length,
    data: _temp_total_data.slice(start, end)
  };
  return re_data;
}
