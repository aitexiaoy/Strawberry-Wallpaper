import Vue from 'vue'
import Router from 'vue-router'

import wallpaper from '../page/wallpaper'
import content from '../page/content'
import about from '../page/about'
import suggestion from '../page/suggestion'
import fullWindow from '../page/full-window'
import notice from '../page/notice'

Vue.use(Router)

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
