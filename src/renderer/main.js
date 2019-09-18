import Vue from 'vue'

import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css'
import '../../static/iconfont/iconfont.css'
import './assets/css/base.css'

import vueModules from './components'
import vueFn from './assets/js/vue-fn'

Vue.use(require('vue-electron'))

Vue.use(ElementUI)
Vue.use(vueModules)
Vue.use(vueFn)

const mainVue = new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')

global.Vue = mainVue
