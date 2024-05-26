import Vue from 'vue'
import Vuex from 'vuex'
import staticData from "./staticData";
import userData from "./userData";
import appointmentData from "./appointmentData";
import {post, get} from "../config/request";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    namespaced: true,
    modules: {
        staticDataModule: staticData,
        userDataModule: userData,
        appointmentModule: appointmentData,
    },
    state: {
        setupSteps: [],
        loader: true,
        showAppointmentForm: false,
        // showAddForm:false,
        setups: [],
        currentRoute: {},
        fullSideBar: false,
        sideBarOpen: true,
        clinic: [],
        logout_redirect_url:{
            clinic_admin:'',
            patient:'',
            receptionist: '',
            doctor:''
        },
        date_format:'D-MM-YYYY',
        footer_copyright_text:'',
        wordpress_logo: {
            status :false,
            logo:''
        }
    },
    mutations: {
        FETCH_SETUP_STEPS_STATUS(state, steps) {
            state.setupSteps = steps.setup_wizard_setup
        },
        TOGGLE_LOADER(state, payload) {
            state.loader = payload
        },
        TOGGLE_APPOINTMENT_FORM(state, payload) {
            state.showAppointmentForm = payload
        },
        TOGGLE_SIDEBAR(state, payload) {
            state.fullSideBar = payload
        },
        FETCH_CLINIC_DATA(state,payload){
            state.clinic = payload.data
        },
        LOGOUT_REDIRECT_URL(state,payload){
            state.logout_redirect_url = JSON.parse(JSON.stringify(payload.data))
        },
        FETCH_DATE_FORMAT(state,payload){
            state.date_format = payload.data
        },
        FETCH_FOOTER_COPYRIGHT_TEXT(state,payload){
            state.footer_copyright_text = payload.data
        },
        FETCH_WORDPRESS_LOGO(state,payload){
            state.wordpress_logo = {
                logo:payload.data.logo,
                status:payload.data.status
            }
        },
    },
    actions: {
        fetchSetupStepsStatus({ commit }, { self }) {
            get('setup_step_status', {}).then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    commit("FETCH_SETUP_STEPS_STATUS", response.data );
                }
            })
                .catch((error) => {
                    console.log(error);
                })
        },
        fetchSetupStepsConfig({ commit }, { self }) {
            get('setup_step_status', {}).then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    commit("FETCH_SETUP_STEPS_STATUS", response.data );
                }
            })
                .catch((error) => {
                    console.log(error);
                })
        },
        logout({ commit,state }, { self }) {
            post('logout', {}).then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    setTimeout(function(){
                        if(self.getUserRole() === 'administrator'){
                            location.reload();
                        }else{
                            if(state.logout_redirect_url[self.getUserRole()] !== ''){
                                window.location = state.logout_redirect_url[self.getUserRole()]
                            }else{
                                location.reload();
                            }
                        }
                    }, 1000);
                }
            }).catch((error) => {
                console.log(error);
            })
        },
        logout_redirect_url({commit},{data}){
            commit("LOGOUT_REDIRECT_URL", {data: data});
        },
        fetchAllClinic({commit},{}){
            get('get_static_data', {
                data_type: 'clinic_list',
            })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("FETCH_CLINIC_DATA", {data: response.data.data});
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage('Internal server error');
                })
        },
       

    },
    getters: {},
    strict: debug
})
