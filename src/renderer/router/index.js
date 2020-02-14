import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const wallpaper = () => import('../page/wallpaper')
const content = () => import('../page/content')
const about = () => import('../page/about')
const suggestion = () => import('../page/suggestion')
const fullWindow = () => import('../page/full-window')
const notice = () => import('../page/notice')

export default new Router({
    routes: [
        {
            path: '/',
            component: wallpaper,
            redirect: '/main',
            children: [
                {
                    path: '/main',
                    name: 'mainContent',
                    component: content
                },
                {
                    path: '/about',
                    name: 'about',
                    component: about
                },
                {
                    path: '/suggestion',
                    name: 'suggestion',
                    component: suggestion
                },
                {
                    path: '/notice',
                    name: 'notice',
                    component: notice
                }
            ]
        },
        
        {
            path: '/full',
            name: 'full',
            component: fullWindow
        }
        
    ]
})
