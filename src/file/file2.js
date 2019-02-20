/***
 * 下载图片并存到指定文件夹
 */
var fs = require('fs')
var path = require('path')
const axios = require('axios');

const os=require('os');
const hostdir = path.resolve(os.homedir() + '/Downloads/wallpaper');


// const hostdir = path.resolve(__dirname, '../../download/pola');

export const mkdirSync=function(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
  return false
}




/** 从指定连接下图片 */
export const downloadPic =function (src,callback) {
    //创建文件夹
    mkdirSync(hostdir);
    
    const dstpath = hostdir + '/' + (new Date()).getTime() + '_' + ((new Date()).getMilliseconds())+'-'+(parseInt(Math.random()*100000)) + '.jpg';
    axios.get(src, {
      responseType: "arraybuffer",
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
        // 'Host': 'www.dianping.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive'
    },
    // `onDownloadProgress` 允许为下载处理进度事件
    onDownloadProgress: function (progressEvent) {
      // 对原生进度事件的处理
      console.log('--------------------下载图片进度:')
      console.log(progressEvent);
    },
    }).then(result => {
      if (result.status == 200) {
        result = result.data;
      } else {
        return;
      }
      var writeStream = fs.createWriteStream(dstpath, {
        // autoClose: true
      })

      writeStream.on('finish', function () {
        console.log('文件写入成功:' + dstpath);
        callback(dstpath);
      })
      writeStream.on('error', function (error) {
        console.log('文件写入失败:' + dstpath);
        console.log(error);
      })

      writeStream.once("close", function () {
        console.log("流关闭了~~~");
      });

      writeStream.write(result, 'binary',function(){
        writeStream.end();
      });
    }).catch(error=>{
      console.log(error);
    })
}
