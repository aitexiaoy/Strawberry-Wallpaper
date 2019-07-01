import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const content = () => import('../page/content.vue')
const about = () => import('../page/about.vue')
const suggestion = () => import('../page/suggestion.vue')
const mian = () => import('../page/main.vue')

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main',
            redirect: '/content',
            component: mian,
            children: [
                {
                    path: '/content',
                    component: content
                },
                {
                    path: '/about',
                    component: about
                },
                {
                    path: '/suggestion',
                    component: suggestion
                }
            ]
        },
        
    ]
})
