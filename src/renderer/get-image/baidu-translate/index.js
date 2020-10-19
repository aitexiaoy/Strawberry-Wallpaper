import { userConfig, axios } from '$render/utils'
import swMd5 from './baidu-md5'


/**
 * 百度翻译接口，将用户搜索的中文转成英文
 */
export default function (val){
    return new Promise((resolve, reject) => {
        const { baiDuTranslationAppId, baiDuTranslationAppKey } = userConfig
        if (val === ''){
            resolve('')
            return
        }
        // 如果包含数字就直接返回搜索值
        if (!Number.isNaN(Number(val))){
            resolve(val)
            return
        }
        const appid = baiDuTranslationAppId
        const key = baiDuTranslationAppKey
        const salt = (new Date()).getTime()
        const query = val
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        const from = 'zh'
        const to = 'en'
        const str1 = appid + query + salt + key
        const sign = swMd5(str1)
    
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
                resolve(val)
            }
        }).catch(() => {
            resolve(val)
        })
    }) 
} 
