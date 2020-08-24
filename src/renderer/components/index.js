import Vue from 'vue'
import loading from './loading'
import imageMatch from './image-match'
import pageHeader from './page-header'
import Icon from './icon'
import Progress from './progress'
import Secondary from './secondary'

const components = [
    pageHeader,
    Icon,
    Progress,
    Secondary
]

const install = function (V) {
    components.forEach((component) => {
        V.component(component.name, component)
    })
    Vue.prototype.$swLoading = loading
    Vue.use(imageMatch)
}

install(Vue)
