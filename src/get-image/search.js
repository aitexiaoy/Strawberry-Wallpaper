var new_urls=[];   //新的urls
var used_urls=[];   //已经使用过的url

const getImagePexels=require('./pexels.js').get_image

export const get_urls=function(data){
  return new Promise((resolve,reject)=>{
    getImagePexels(data).then(urls=>{
      resolve(urls);
    })
  })
}
