
const qs = require('qs')
const axios = require('axios')
const { apiBaseUrl } = require('../utils/config.js')

const instance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 1000,
  
})

/**
 * 第一次的时候注册
 */
export const postRegister = data => new Promise((resolve, reject) => {
    console.log(qs.stringify(data))
    instance({
        url: '/register',
        method: 'post',
        data: qs.stringify(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

    }).then((res) => {
        const { data: result } = res
        if (result.code === 0){
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
export const apiStatisticActive = uid => instance.post('/active', qs.stringify({
    uid
}), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
