
var new_urls=[];   //新的urls
var used_urls=[];   //已经使用过的url

var type='';

const get_image_pexels=require('./pexels.js').get_image
const cancel_image_pexels=require('./pexels.js').cancel_image

const get_image_500px=require('./500px.js').get_image
const cancel_image_500px=require('./500px.js').cancel_image


var cancel_fn={
  'pexels':cancel_image_pexels,
  '500px':cancel_image_500px
}

export const get_urls=function(data){
  return new Promise((resolve,reject)=>{
    if(data.imageSource=='pexels'){
      type='pexels';
      get_image_pexels(data).then(urls=>{
        resolve(urls);
      }).catch(error=>{
        reject(error)
      }).finally(_=>{
        type='';
      })
    }
    else if(data.imageSource=='500px'){
      type='500px';
      get_image_500px(data).then(urls=>{
        resolve(urls)
      }).catch(error=>{
        reject(error)
      }).finally(_=>{
        type='';
      })
    }
  })
}

export const cancel_urls=function(){
  if(type!=''){
    cancel_fn[type]();
  }
}
