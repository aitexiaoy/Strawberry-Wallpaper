

import axios from 'axios'

// 定义接口请求的基地址
export const apiBaseUrl = 'http://strawberry.wangkaibo.com'

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

export const apiGetNotices = () => new Promise((resolve) => {
    instance.get('/notice', {
        params: {
            is_test: 1
        }
    }).then((res) => {
        const { data: result } = res
        if (result.code === 0){
            resolve(result.data || [])
        }
        else {
            resolve([])
        }
    }).catch(() => { resolve([]) })
}) 
