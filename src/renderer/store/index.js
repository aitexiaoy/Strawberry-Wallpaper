import Vue from 'vue'
import Vuex, { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import localStorage from '$render/assets/js/local-storage'
import { defaultConfig, defaultSearchList } from '$render/config'

const userConfigStoreText = 'userConfig'

const storeSearchKeyList = localStorage.getStore('searchKeyList') 
const storeSearchKey = localStorage.getStore('searchKey')
let userConfig = localStorage.getStore(userConfigStoreText)

// 防止之前有设置bug，导致数据类型不对
if (userConfig){
    Object.keys(userConfig).forEach((key) => {
        if (Object.prototype.toString.call(userConfig[key]) !== Object.prototype.toString.call(defaultConfig[key])){
            userConfig[key] = defaultConfig[key]
        }
    })
} else {
    userConfig = { ...defaultConfig }
}

const state = {
    // 用户设置
    config: { ...userConfig },

    // 当前活跃的壁纸源
    // activeImageSource: null,

    // 搜索的select列表
    searchSelectLists: [],

    // 储存最近搜索的8次关键字
    searchKeyList: storeSearchKeyList || [...defaultSearchList], 

    // 搜索关键词
    searchKey: storeSearchKey || '',

    // 是否是正在设置壁纸
    isSetting: false,

    // 当前设置壁纸的信息
    currentWallpaperBkColor: '#ffffff',
    currentWallpaperIndex: 0,

    // 进度条的主颜色
    progressColor: '',
    // 进度条进度，下载进度
    progressValue: 0,
    // 状态🐔
    pageStatus: '', // refresh|getData 刷新数据

}

const mutations = {
    storeSetConfig(store, payload = {}) {
        store.config = { ...store.config, ...payload }
        localStorage.setStore(userConfigStoreText, store.config)
    },

    storeSetSearchSelectLists(store, payload){
        store.searchSelectLists = payload
    },

    storeSetSearchKeyList(store, payload = []) {
        store.searchKeyList = [...payload]
        localStorage.setStore('searchKeyList', store.searchKeyList)
    },

    storeSetSearchKey(store, payload = ''){
        store.searchKey = payload
        localStorage.setStore('searchKey', store.searchKey)
    },

    storeSetIsSetting(store, payload = false){
        store.isSetting = payload
    },

    storeSetCurrentWallpaperBkColor(store, payload = '#fff'){
        store.currentWallpaperBkColor = payload
    },

    storeSetCurrentWallpaperIndex(store, payload = 0){
        store.currentWallpaperIndex = payload
    },

    storeSetProgressColor(store, payload = '#fff'){
        store.progressColor = payload
    },

    storeSetProgressValue(store, payload = 0){
        store.progressValue = payload
    },

    storeSetPageStatus(store, payload = ''){
        store.pageStatus = payload
    }
}

// 因为使用了vuex-electron 所以需要采用actions
const actions = {
    storeActionConfig({ commit }, payload){
        commit('storeSetConfig', payload)
    },
}

const getters = {
    
}


Vue.use(Vuex)


// 全局注册
Vue.mixin({
    computed: {
        ...mapState(Object.keys(state)),
        ...mapGetters(Object.keys(getters)),
    },
    methods: {
        ...mapMutations(Object.keys(mutations)),
        ...mapActions(Object.keys(actions)),
    },
})

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    // plugins: [
    //     createPersistedState(),
    //     createSharedMutations()
    // ],
})
