
const axios = require('axios')
const { apiBaseUrl } = require('../utils/config.js')

const instance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 1000,
});

/**
 * 第一次的时候注册
 */
export const postRegister = data => new Promise((resolve, reject) => {
    instance({
        url: '/register',
        method: 'post',
        data
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
export const getStatisticActive = uid => instance.get('/statistic', {
    params: {
        uid
    }
})
