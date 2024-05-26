import Vue from 'vue'
import {post, get} from "../config/request";

export default {
    namespaced: true,
    state: {
        user: {},
        userDropDownData: {
            patients: [],
            doctors: []
        },
        clinic: {},
        setups: []
    },
    mutations: {
        FETCH_USER_DATA(state, payload) {
            state.user = payload
        },
        FETCH_DEFAULT_CLINIC(state, payload) {
            state.clinic = payload
        },
        FETCH_USER_DROPDOWN_DATA(state, payload) {
            if (payload.userType === window.vm.$data.doctorRoleName) {
                state.userDropDownData.doctors = payload.data;
            } else if (payload.userType === window.vm.$data.patientRoleName) {
                state.userDropDownData.patients = payload.data;
            }
        },
        HANDLE_ACTIVE_STEP(state, payload) {
            vm.$router.push({ name: payload.routeName });
        },
        FETCH_SETUP_CONFIG(state, payload) {
            state.setups = payload
        },
        HANDLE_NEXT_STEP(state, payload) {
            state.setups = state.setups.map((step) => {
                if (step.name === payload.name) {
                    step.completed = true;
                }
                return step;
            });
            vm.$router.push({ name: payload.nextStep });
        },
        HANDLE_PREV_STEP(state, payload) {
            vm.$router.push({ name: payload.prevStep });
        }
    },
    actions: {
        async fetchUserData({commit}, data) {
            await get('get_user', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("FETCH_USER_DATA", response.data.data);
                        if (response.data.data.step_config !== undefined) {
                            commit("FETCH_SETUP_CONFIG", response.data.data.step_config);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        async fetchDefaultClinic ({commit}, data) {
            await get('get_static_data', { data_type : 'default_clinic' })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        // default clinic data
                        commit("FETCH_DEFAULT_CLINIC", response.data.data[0]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        async updateSetupStep ({commit}, data) {
            await post('update_setup_step', data)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("HANDLE_NEXT_STEP", data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        fetchUserForDropdown ({commit}, data) {
            get('get_static_data', {
                data_type: 'users',
                user_type: data.userRoleName
            })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("FETCH_USER_DROPDOWN_DATA", {data: response.data.data, userType: data.userRoleName});
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage('Internal server error');
                })
        },
        async finishSetup ({commit}, data) {
            await post('setup_finish', data)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                    } else {
                        displayErrorMessage(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                    displayErrorMessage('Internal server error')
                })
        }
    },
    getters: {
    }
}
