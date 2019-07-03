const axios = require('axios');

/** * axios get请求 */
// eslint-disable-next-line import/prefer-default-export
export const axiosGet = function (url, option) {
    option = option || {};
    if (url && typeof url === 'string') {
        option = {
            ...option,
            ...{
                url,
                method: 'get',
            },
        };
    } else {
        option = url;
    }
    return new Promise((resolve, reject) => {
        axios.request(option).then(async (result) => {
            if (result.status === 200) {
                resolve(result.data);
            } else {
                reject();
            }
        }).catch((error) => {
            console.log('axiosGet请求出错');
            reject(error);
        });
    });
};
