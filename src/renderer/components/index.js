import Vue from 'vue'
import loading from './loading'
import imageMatch from './image-match'
import pageHeader from './page-header'

const components = [
    pageHeader
]

const install = function (V) {
    components.forEach((component) => {
        V.component(component.name, component)
    })
    Vue.prototype.$swLoading = loading
    Vue.use(imageMatch)
}

install(Vue)
export default {
    pageHeader
}
