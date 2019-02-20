/***
 * pexels网站 https://www.pexels.com
 */


/**
 * 
https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?cs=srgb&dl=beach-clear-green-735621.jpg&fm=jpg

https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?cs=srgb&dl=beach-clear-green-735621.jpg&fm=jpg

https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260

https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800

https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260 1x, 

https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260 2x


https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940 1x, 

https://images.pexels.com/photos/735621/pexels-photo-735621.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940 2x

*/

// const downloadUrl = require('../file/file.js').downloadUrl

const {
  axios_get
} = require('../units/axios.js');

let url = '?dark=true&format=js&page=0&seed=2019-02-15+08%3A17%3A15++0000';



 export const get_image=function(data){
   

  // axios_get('https://www.pexels.com/?dark=true&format=js&page=0&seed=2019-02-15+08%3A17%3A15++0000',{
  //   headers: {
  //     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  //     'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
  //     // 'Host': 'www.dianping.com',
  //     'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
  //     'Cache-Control': 'max-age=0',
  //     'Connection': 'keep-alive'
  // },
  // })

  return new Promise((resolve,reject)=>{
    if(!data){
      resolve([]);
    }
    let base_url='https://www.pexels.com/'
    if(data.searchKey){
      base_url=`https://www.pexels.com/search/${data.searchKey}/`
    }
    axios_get({
      url:base_url,
      params:{
        // dark:true,
        format:'js',
        page:data.page,
        // seed:'2019-02-15 08:17:15  0000'
      },
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
        // 'Host': 'www.dianping.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive'
    },
    }).then(result => {
        let urls=[];
    
      //匹配图片（g表示匹配所有结果i表示区分大小写）
      var imgReg = /<img.*?(?:>|\/>)/gi;
      //匹配拥有srcset属性的
      var srcReg = /srcset=\\.*?\\/i;
      var arr = result.match(imgReg);
      if(!arr){
        resolve([]);
        return
      }
      for (var i = 0; i < arr.length; i++) {
        // console.log(arr[i]);
        var src = arr[i].match(srcReg);
        //获取图片地址
        if(src){
            //把图片地址提取出来
            let aa=/\\.*?\?/i;
            let result=src[0].match(aa);
            result=result[0].replace(/\"/g,'').replace(/\\/g,'').replace(/\?/,'');

            let widthReg=/data-image-width=\\.*?\\/i;
            let heightReg=/data-image-height=\\.*?\\/i;
            let urlReg=/data-large-src=\\.*?\\/i;
            let width=arr[i].match(widthReg);
            let height=arr[i].match(heightReg);
            let url=arr[i].match(urlReg);
            let obj={
              width:width[0]?width[0].replace(/data-image-width=/g,'').replace(/\"/g,'').replace(/\\/g,''):'',
              height: height[0]?height[0].replace(/data-image-height=/g,'').replace(/\"/g,'').replace(/\\/g,''):'',
              url:url[0]?url[0].replace(/data-large-src=/g,'').replace(/\"/g,'').replace(/\\/g,''):'',
              downloadUrl:result,
            }
            urls.push(obj);
        }
        //当然你也可以替换src属性
      }
      resolve(urls);
      // downloadUrl(urls);
    })
  })

}

get_image();
