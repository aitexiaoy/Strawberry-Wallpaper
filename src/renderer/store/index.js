import Vue from 'vue'
import Vuex, { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import localStorage from '$render/assets/js/local-storage'
import { defaultConfig, defaultSearchList } from '$render/config'

console.log('========defaultConfig', defaultConfig)

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

console.log('========userConfig', userConfig)


const state = {
    // 用户设置
    config: { ...userConfig },
    // 当前活跃的壁纸源
    activeImageSource: null,

    // 储存最近搜索的10次关键字
    searchKeyList: storeSearchKeyList || [...defaultSearchList], 

    // 搜索关键词
    searchKey: storeSearchKey || '',

    // 是否是正在设置壁纸
    isSetting: false,

    // 进度条进度，下载进度
    downloadProgress: 0,

    // 当前设置壁纸的信息
    currentWallpaperBkColor: '#ffffff',
    currentWallpaperIndex: 0,

    // 显示
    infoShow: '',

}

const mutations = {
    storeActionConfig(store, payload = {}) {
        store.config = { ...store.config, ...payload }
        console.log('=========', store.config)
        localStorage.setStore(userConfigStoreText, store.config)
    },

    storeActionActiveImageSource(store, payload) {
        store.activeImageSource = payload
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

    storeSetDownloadProgress(store, payload = 0){
        store.downloadProgress = payload
    },

    storeSetCurrentWallpaperBkColor(store, payload = '#fff'){
        store.currentWallpaperBkColor = payload
    },

    storeSetCurrentWallpaperIndex(store, payload = 0){
        store.currentWallpaperIndex = payload
    },

    storeSetInfoShow(store, payload = ''){
        store.infoShow = payload
    }
}

// 因为使用了vuex-electron 所以需要采用actions
const actions = {
    storeActionConfig({ commit }, payload){
        commit('storeActionConfig', payload)
    },

    storeActionActiveImageSource({ commit }, payload){
        commit('storeActionActiveImageSource', payload)
    }
}

const getters = {
    
}


Vue.use(Vuex)


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
