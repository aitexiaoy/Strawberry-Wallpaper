import {
  Loading
} from 'element-ui';
var loadings = [];


const fbloading = {
  open: function (el, text) {
    if (!el) {
      return;
    }
    this.close(el);

    let currentloading = Loading.service({
      target: el,
      fullscreen: false,
      spinner:'el-icon-loading',
      // spinner: 'iconfont icon-jiazai',
      text: text || '',
    })
    currentloading._el = el;
    loadings.push(currentloading);
  },
  close: function (el) {
    if (!el) {
      while (loadings.length != 0) {
        let currentloading = loadings.shift();
        if (currentloading != null) {
          currentloading.close();
          currentloading = null;
        }
      }
    } else {
      for (let index = 0; index < loadings.length; index++) {
        if (loadings[index]._el == el) {
          if (loadings[index] != null) {
            loadings[index].close();
            loadings[index] = null;
            loadings.splice(index, 1);
            return;
          }
        }
      }
    }

  }
}
export default fbloading
