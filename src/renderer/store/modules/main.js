const { defaultConfig } = require('../../../utils/config')

const state = {
    config: { ...defaultConfig },
    osInfo: {
        username: '', // 用户名
        version: '', // 软件版本
        uid: '', // 软件唯一ID,
    }
}

const mutations = {
    changeOsInfoStore(statea, data){
        statea.osInfo = data
    },

    changeConfigStore(statea, data){
        statea.config = data
    },
}

// 因为使用了vuex-electron 所以需要采用actions
const actions = {
    changeOsInfoStore(store, data) {
        store.commit('changeOsInfoStore', data)
    },
    changeConfigStore(store, data) {
        store.commit('changeConfigStore', data)
    },
}

export default {
    state,
    mutations,
    actions
}
