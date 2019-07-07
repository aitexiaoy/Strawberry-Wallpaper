

import userConfig from '../../.user-config.js'

const axios = require('axios')

const { baiDuTranslationAppId, baiDuTranslationAppKey } = userConfig
const { MD5: swMd5 } = require('./baidu-md5')
const { apiBaseUrl } = require('../utils/config')

const instance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 1000,
  
})

/**
 * 第一次的时候注册
 */
export const postRegister = data => new Promise((resolve, reject) => {
    instance({
        url: '/register',
        method: 'post',
        data,
    }).then((res) => {
        const { data: result } = res
        if (result.code === 0 || result.code === 400){
            resolve()
        }
        else {
            reject()
        }
    }).catch((error) => {
        reject(error)
    })
})
/**
 * 统计用户的使用情况
 */
export const apiStatisticActive = data => instance.post('/active', data)

/**
 * 百度翻译接口，将用户搜索的中文转成英文
 */
export const apiTranslation = val => new Promise((resolve, reject) => {
    if (val === ''){
        resolve('')
        return
    }
    // 如果包含数字就直接返回搜索值
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(Number(val))){
        resolve(val)
        return
    }
    const appid = baiDuTranslationAppId;
    const key = baiDuTranslationAppKey;
    const salt = (new Date()).getTime();
    const query = val;
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    const from = 'zh';
    const to = 'en';
    const str1 = appid + query + salt + key;
    const sign = swMd5(str1);

    axios({
        url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
        method: 'get',
        params: {
            q: val,
            appid,
            salt,
            from,
            to,
            sign
        }
    }).then((result) => {
        const { trans_result: transResult } = result.data
        if (transResult && transResult.length > 0){
            const { dst = '' } = transResult[0]
            resolve(dst.toLocaleLowerCase())
        }
        else {
            resolve('')
        }
    }).catch(() => {
        resolve('')
    })
}) 
