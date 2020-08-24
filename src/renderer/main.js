import Vue from 'vue'

import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css'
import '../../static/iconfont/iconfont.css'
import './assets/css/base.less'
import './assets/css/theme.less'

import './components'
import vueFn from './assets/js/vue-fn'

const log = require('electron-log')


Vue.use(require('vue-electron'))

Vue.use(ElementUI)
Vue.use(vueFn)


Vue.prototype.$log = log

const mainVue = new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')

window.Vue = mainVue

window.addEventListener('error', (error) => {
    log.info('=====', error)
})
