import Vue from 'vue'
import Router from 'vue-router'

import wallpaper from '$render/page/wallpaper/index'
import content from '$render/page/main/index'
import about from '$render/page/about/index'
import suggestion from '$render/page/suggestion/index'
import fullWindow from '$render/page/full-window/index'
import setting from '$render/page/setting/index'
import notice from '$render/page/notice/index'

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
                },
                {
                    path: '/setting',
                    name: 'setting',
                    component: setting
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
