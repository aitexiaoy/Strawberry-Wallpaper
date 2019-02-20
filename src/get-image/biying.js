/**必应的每日壁纸图片 */
const axios=require('axios');
const downloadUrl = require('../file/file.js').downloadUrl;
async function getPage(url) {
    return new Promise((resolve, reject) => {
      axios.request({
        url: url,
        method: 'get', // 默认是 get
      }).then(async result => {
        if (result.status == 200) {
          result = result.data.images;
        } else {
          return;
        }
        try {
          let urls = [];
          for (let index = 0; index < result.length; index++) {
            let path ='https://cn.bing.com'+result[index].url;
            console.log(path);
            urls.push(path);
          }
          
          await downloadUrl(urls);
          resolve();
        } catch (error) {
          console.log(error);
          resolve();
        }
      }).catch(error => {
        console.log(error);
        resolve();
      })
    })
  
  }

  async function getPageUrl() {
    getPage('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc=1550218434235&pid=hp&FORM=BEHPTB&video=1')
  }

  getPageUrl();