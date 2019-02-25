const axios = require('axios');

// export const axios_after = function () {
//   return new Promise((resolve, reject) => {

//   })
// }

/*** axios get请求 */
export const axios_get = function (url, option) {
  option = option || {};
  if (url&&typeof url=='string') {
    option = {
      ...option,
      ...{
        url: url,
        method: 'get'
      }
    }
  }else{
    option=url;
  }
  return new Promise((resolve, reject) => {
    axios.request(option).then(async result => {
      if (result.status == 200) {
        resolve(result.data);
      } else {
        reject();
      }
    }).catch((error) => {
      console.log('error', error);
      reject();
    })
  })
}


