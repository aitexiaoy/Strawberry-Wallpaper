var new_urls=[];   //新的urls
var used_urls=[];   //已经使用过的url

const {get_image}=require('./pexels.js')

export const get_urls=function(data){
  return new Promise((resolve,reject)=>{
    get_image(data).then(urls=>{
      resolve(urls);
    })
  })
}
