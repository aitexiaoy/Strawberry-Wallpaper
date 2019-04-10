const state = {
    main: 0
}

const mutations = {
    // eslint-disable-next-line no-shadow
    DECREMENT_MAIN_COUNTER(state) {
        state.main--
    },
    // eslint-disable-next-line no-shadow
    INCREMENT_MAIN_COUNTER(state) {
        state.main++
    }
}

const actions = {
    someAsyncTask({ commit }) {
    // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions
}
