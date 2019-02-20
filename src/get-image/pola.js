/***
 * 获取到图片路径
 */
const axios = require('axios');

const downloadUrl = require('../file/file.js').downloadUrl

var ProgressBar = require('progress');


var urls = [];

async function getPage(url) {
  return new Promise((resolve, reject) => {

    axios.request({
      url: url,

      // `method` 是创建请求时使用的方法
      method: 'get', // 默认是 get
      // `onDownloadProgress` 允许为下载处理进度事件
      onDownloadProgress: function (progressEvent) {
        // 对原生进度事件的处理
        console.log('--------------------下载图片进度:')
        console.log(progressEvent)
      },
    }).then(async result => {

      if (result.status == 200) {
        result = result.data.data;
      } else {
        return;
      }
      try {
        let urls = [];
        for (let index = 0; index < result.length; index++) {
          let path = result[index].full_res;
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
  for (let index = 131; index > 80; index--) {
    console.log('---------------00000');
    await getPage(`http://www.polaxiong.com/collections/get_entries_by_collection_id/${index}`)
    console.log('--------------2222');
  }
  return


  var bar = new ProgressBar('progress: [:bar] :current/:total :elapseds :percent', {
    complete: '=',
    incomplete: '-',
    width: 50,
    total: 100
  });
  var timer = setInterval(function () {
    bar.tick(1);
    if (bar.complete) {
      console.log('complete');
      clearInterval(timer);
    }
  }, 50);

  axios.get('http://ppe.oss-cn-shenzhen.aliyuncs.com/collections/115/3/full_res.jpg', {
    responseType: "arraybuffer",
    // `onDownloadProgress` 允许为下载处理进度事件
    onDownloadProgress: function (progressEvent) {
      // 对原生进度事件的处理
      console.log('--------------------下载图片进度:')
      console.log(progressEvent);
    },
  }).then(result=>{
    console.log('0000');
  })
}
getPageUrl();
