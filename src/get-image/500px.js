/***
 * pexels网站 https://500px.com/
 */

// // 搜索
// https: //api.500px.com/v1/photos/search?type=photos&term=cat&image_size%5B%5D=1&image_size%5B%5D=2&image_size%5B%5D=32&image_size%5B%5D=31&image_size%5B%5D=33&image_size%5B%5D=34&image_size%5B%5D=35&image_size%5B%5D=36&image_size%5B%5D=2048&image_size%5B%5D=4&image_size%5B%5D=14&include_states=true&formats=jpeg%2Clytro&include_tags=true&exclude_nude=true&page=1&rpp=50


//   //热门
//   https: //api.500px.com/v1/photos?rpp=50&feature=popular&image_size%5B%5D=1&image_size%5B%5D=2&image_size%5B%5D=32&image_size%5B%5D=31&image_size%5B%5D=33&image_size%5B%5D=34&image_size%5B%5D=35&image_size%5B%5D=36&image_size%5B%5D=2048&image_size%5B%5D=4&image_size%5B%5D=14&sort=&include_states=true&include_licensing=true&formats=jpeg%2Clytro&only=&exclude=&personalized_categories=&page=1&rpp=50


const axios = require('axios');
const cheerio = require('cheerio')

const {
  axios_get
} = require('../utils/axios.js');

var CancelToken = axios.CancelToken;
var source = null;

// https://500px.com/search?submit=%E6%8F%90%E4%BA%A4&q=dog&type=photos
var cookies = '';
var csr_token = '';

var htmlAddress = '';

//先获取页面
function get_htmlpage(data) {
  return new Promise((resolve, reject) => {

    if (data.searchKey) {
      htmlAddress = `https://500px.com/search?submit=%E6%8F%90%E4%BA%A4&q=${data.searchKey}&type=photos`;
    } else {
      htmlAddress = 'https://500px.com/popular';
    }

    axios.get(htmlAddress).then((result) => {
      cookies = result.headers['set-cookie'];
      var $ = cheerio.load(result.data);
      csr_token = $('meta[name="csrf-token"]')[0].attribs.content;
      resolve();
    }).catch(error => {
      console.log(error);
      reject()
    })
  })
}

export const get_image = async function (data) {
  if (cookies == '') {
    await get_htmlpage(data);
  }
  return new Promise(async (resolve, reject) => {
    if (!data) {
      resolve([]);
    }
    let base_url = 'https://api.500px.com/v1/photos';
    let params = {
      image_size: [100, 200, 400, 600, 2048, 4096, 5120, 6144, 7168],
      page: data.page,
      rpp: 50, //单页条数
      formats: "jpeg"
    };
    if (data.searchKey) {
      base_url = `https://api.500px.com/v1/photos/search`;
      params.type = 'photos';
      params.term = data.searchKey;
      params.include_tags = true;
      params.exclude_nude = true;
    } else {
      base_url = 'https://api.500px.com/v1/photos';
      params.feature = 'popular';
      params.include_licensing = true;
      params.include_states = true;

    }
    source = CancelToken.source();
    axios_get({
      url: base_url,
      params: params,
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Origin': 'https://500px.com',
        'Referer': htmlAddress,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
        'X-CSRF-Token': csr_token,
        'cookie': cookies
      },
      cancelToken: source.token
    }).then(result => {
      source = null;
      let urls = [];
      let photos = result.photos;
      photos.forEach(item => {
        let obj = {
          width: item.width,
          height: item.height,
          url: '',
          downloadUrl: result,
        }
        let images = item.images;
        let max_size = 0;
        for (let i = 0; i < images.length; i++) {
          if (images[i].size >= 200 && images[i].size <= 700) {
            // console.log(images[i].size)
            // console.log(images[i].https_url)
            obj.url = images[i].https_url;
          }
          if (images[i].size > max_size) {
            obj.downloadUrl = images[i].https_url;
          }
          max_size = images[i].size
        }
        obj.height = parseInt(max_size / obj.width * obj.height);
        obj.width = max_size;
        urls.push(obj);
      })
      // console.log(urls);
      resolve(urls);
    }).catch(error => {
      source = null;
      console.log(error);
    })
  })
}

export const cancel_image = function () {
  if (source) {
    source.cancel();
  }
}
// get_image({page:1,searchKey:''});