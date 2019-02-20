/**
 * 自定义全局组件管理入口文件
 * 部分组件基于elemnt ui中的工具函数
 */

import Vue from 'vue';

import fbloading from './fb_loading/fb-loading.js'
import imageMatch from './image_match/index.js'

const components = [
    // fbloading,
];

const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$fbloading=fbloading;
};

install(Vue);
Vue.use(imageMatch);

export default {
  version: '0.0.1',
}
