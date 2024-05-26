import Vue from 'vue'
import Vuex from 'vuex'
import {post, get} from "../config/request";

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        user: {},
        loader: true,
        langTranslateData: [],
    },
    mutations: {
        FETCH_USER_DATA(state, payload) {
            state.user = payload
        },
        WIDGET_LOADER(state, payload) {
            state.loader = payload
        },
        LANG_RESPONSE (state, payload) {
            state.langTranslateData = payload ;
        },
    },
    actions: {
        async getUserData({commit}, data) {
            await get('get_user', {}, true)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("FETCH_USER_DATA", response.data.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        fetchLangTranslateData ({ commit }, data) {
            commit("LANG_RESPONSE", window.__kivicarelang);
        },
    },
    getters: {},
})
