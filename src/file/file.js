/***
 * 下载图片并存到指定文件夹
 */
var fs = require('fs')
var path = require('path')
const axios = require('axios');

const os = require('os');

var webp = require('webp-converter');

const request = require("request");



const hostdir = path.resolve(os.homedir() + '/Downloads/wallpaper');


export function mkdirSync(dirname) {
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


// /** 从指定连接下图片 */
// export const downloadPic =async function (src,mainWindow) {
//   return new Promise((resolve, reject) => {
//     //创建文件夹
//     mkdirSync(hostdir);
//     var dstpath=hostdir + '/' + (new Date()).getTime() + '_' + ((new Date()).getMilliseconds())+'-'+(parseInt(Math.random()*100000));
//     var isWebp=false;
//     if(src.match('webp=true')){
//       dstpath = dstpath + '.webp';
//       isWebp=true;
//     }
//     else{
//       dstpath = dstpath + '.jpg';
//       isWebp=false;
//     }
//     axios.get(src, {
//       responseType: "arraybuffer",
//       headers: {
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//         'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
//         // 'Host': 'www.dianping.com',
//         'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
//         'Cache-Control': 'max-age=0',
//         'Connection': 'keep-alive'
//     },
//     transformResponse: [function (data) {
//       // 对 data 进行任意转换处理
//       console.log('--------------------data:')
//       console.log(data);
//       return data;
//     }],
//     // `onDownloadProgress` 允许为下载处理进度事件
//     onDownloadProgress: function (progressEvent) {
//       // 对原生进度事件的处理
//       console.log('--------------------下载图片进度:')
//       console.log(progressEvent);
//       if(mainWindow){
//         mainWindow.webContents.send('datainfo', {
//           type: 'updaterProgress',
//           data: progressObj.percent
//         })
//       }
//     },
//     }).then(result => {
//       if (result.status == 200) {
//         result = result.data;
//       } else {
//         resolve();
//         return;
//       }
//       var writeStream = fs.createWriteStream(dstpath, {
//         // autoClose: true
//       })

//       writeStream.on('finish', function () {
//         console.log('文件写入成功:' + dstpath);

//         if(isWebp){
//           webp.dwebp(dstpath,dstpath.replace('webp','jpg'),"-o",function(status,error)
//           {
//              //if conversion successful status will be '100'
//             //if conversion fails status will be '101'
//             console.log(status,error);
//             fs.unlink(dstpath,(err) => {
//               if (err) throw err;
//               console.log('文件已删除');
//             });
//             resolve(dstpath.replace('webp','jpg'))
//           });
//         }
//         else{
//           resolve(dstpath);
//         }
//       })
//       writeStream.on('error', function (error) {
//         console.log('文件写入失败:' + dstpath);
//         console.log(error);
//         resolve();
//       })

//       writeStream.once("close", function () {
//         console.log("流关闭了~~~");
//       });

//       writeStream.write(result, 'binary',function(){
//         writeStream.end();
//       });
//     }).catch(error=>{
//       console.log(error);
//       resolve();
//     })
//   })
// }




/** 从指定连接下图片 */
export const downloadPic = async function (src, mainWindow) {
  return new Promise((resolve, reject) => {
    //创建文件夹
    mkdirSync(hostdir);
    var dstpath = hostdir + '/' + (new Date()).getTime() + '_' + ((new Date()).getMilliseconds()) + '-' + (parseInt(Math.random() * 100000));
    var isWebp = false;
    if (src.match('webp=true')) {
      dstpath = dstpath + '.webp';
      isWebp = true;
    } else {
      dstpath = dstpath + '.jpg';
      isWebp = false;
    }

    let receivedBytes = 0;
    let totalBytes = 0;

    var writeStream = fs.createWriteStream(dstpath, {
      autoClose: true
    });
    var readStream = request({
      url: src,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
        // 'Host': 'www.dianping.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive'
      }
    })
    readStream.pipe(writeStream);
    readStream.on('response', (data) => {
      // 更新总文件字节大小
      totalBytes = parseInt(data.headers['content-length'], 10);
    });

    readStream.on('data', (chunk) => {
      // 更新下载的文件块字节大小
      receivedBytes += chunk.length;
      console.log((receivedBytes / totalBytes) * 100);
      mainWindow.webContents.send('datainfo', {
        type: 'updaterProgress',
        data: parseFloat(((receivedBytes / totalBytes) * 100))
      })
    });

    readStream.on('finish', function () {
      console.log('文件下载成功');
    });
    readStream.on('error', function (err) {
      console.log("错误信息:" + err);
      reject();
    })
    writeStream.on("finish", function () {
      console.log("文件写入成功");
      writeStream.end();
      if (isWebp) {
        webp.dwebp(dstpath, dstpath.replace('webp', 'jpg'), "-o", function (status, error) {
          //if conversion successful status will be '100'
          //if conversion fails status will be '101'
          console.log(status, error);
          fs.unlink(dstpath, (err) => {
            if (err) throw err;
            console.log('文件已删除');
          });
          resolve(dstpath.replace('webp', 'jpg'))
        });
      } else {
        resolve(dstpath);
      }
    });
  })
}


// module.exports.downloadPic=downloadPic;
// downloadPic('https://drscdn.500px.org/photo/296097989/m%3D4096/v2?webp=true&sig=5d2e79b4d23c12db748593a3bfab28988e3f2cf91cde79d21e9ec4cbe3cf22d2')
