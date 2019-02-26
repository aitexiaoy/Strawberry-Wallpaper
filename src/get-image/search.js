
var new_urls=[];   //新的urls
var used_urls=[];   //已经使用过的url

const get_image_pexels=require('./pexels.js').get_image

const get_image_500px=require('./500px.js').get_image

export const get_urls=function(data){
  return new Promise((resolve,reject)=>{
    if(data.imageSource=='pexels'){
      get_image_pexels(data).then(urls=>{
        resolve(urls);
      }).catch(error=>{
        reject(error)
      })
    }
    else if(data.imageSource=='500px'){
      get_image_500px(data).then(urls=>{
        resolve(urls)
      }).catch(error=>{
        reject(error)
      })
    }
  })
}
