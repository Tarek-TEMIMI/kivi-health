import { post, get } from "../config/request";

export default {
    namespaced: true,
    state: {
        static_data: {
            specialization : [],
        },
        langTranslateData: [],
        staticDataLoader:true
    },
    mutations: {
        FETCH_STATIC_DATA(state, payload) {
            state.static_data[payload.dataType] = payload.static_data
        },
        FETCH_STATIC_DATA_LOADER(state, payload) {
            state.static_data_loader = payload.static_data
        },
        ADD_OPTION_STATIC_DATA(state, payload) {
            if (state.static_data[payload.dataType] !== undefined) {
                state.static_data[payload.dataType].push(payload.option);
            }
        },
        LANG_RESPONSE (state, payload) {
            state.langTranslateData = payload ;
        }
    },
    actions: {
        fetchStaticData({ commit }, data) {
            commit("FETCH_STATIC_DATA_LOADER", true);
            get('get_static_data', {
                data_type: data.type,
                static_data_type: data.static_data_type
            })
                .then((response) => {
                    commit("FETCH_STATIC_DATA_LOADER", false);
                    if (response.data.status !== undefined && response.data.status === true) {
                        if (data.static_data_type !== undefined && data.static_data_type !== '') {
                            commit("FETCH_STATIC_DATA", {dataType: data.static_data_type,static_data: response.data.data});
                        } else {
                            commit("FETCH_STATIC_DATA", {dataType: data.type,static_data: response.data.data});
                        }
                    }
                })
                .catch((error) => {
                    commit("FETCH_STATIC_DATA_LOADER", false);
                    console.log(error);
                })
        },
        fetchLangTranslateData ({ commit }, data) {
            commit("LANG_RESPONSE", window.__kivicarelang);
        },
        refreshDashboardLocale({commit},{}){
            get('refresh_dashboard_locale')
                .then((response) => {
                    if (response.data.success !== undefined && response.data.success === true) {
                        commit("LANG_RESPONSE", response.data.data);
                        window.__kivicarelang = response.data.data
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
     
    },
    getters: {
        specialization: state => state.static_data.specialization
    },
}
