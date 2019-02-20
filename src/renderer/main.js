import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'static/iconfont/iconfont.css'

//在渲染器进程 (网页) 中。
const {ipcRenderer} = require('electron')

Vue.prototype.$ipcRenderer=ipcRenderer;

import FBmodules from './components/index.js'
//自定义全局方法库
import fbFunction from './assets/js/fbFunction.js'


Vue.use(ElementUI);
//使用自定义组件库
Vue.use(FBmodules);
Vue.use(fbFunction);

/* eslint-disable no-new */
const mainVue=new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

global.Vue=mainVue;
