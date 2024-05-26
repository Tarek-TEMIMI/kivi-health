import {post, get} from "../config/request";

export default {
    namespaced: true,
    state: {
        appointmentList: [],
        timeSlots: [],
        filterDate: "",
        page:0,
        totalrows:0,
        file_upload_status:'off',
        description_status:'off',
        patient_detail_info_status:'off',
        appointment_encounter_data:{
            total_appointment :'',
            total_encounters : '',
            upcoming_appointment :'',
            upcoming_encounters:'',
        }
    },
    mutations: {
        FETCH_APPOINTMENT_DATA(state, payload) {
            state.appointmentList = payload
        },
        FETCH_APPOINTMENT_SLOTS(state, payload) {
            state.timeSlots = payload
        },
        RESET_TIME_SLOT(state) {
            state.timeSlots = []
        },
        SET_FILTER_DATE(state, payload) {
            state.filterDate = payload
        },
        SET_APPOINTMENT_TOTAL_ROW(state, payload) {
            state.totalrows = payload
        },
        FILE_UPLOAD_STATUS(state, payload) {
            state.file_upload_status = payload.data
        },
        DESCRIPTION_STATUS(state, payload) {
            state.description_status = payload.data
        },
        PATIENT_INFO_STATUS(state, payload) {
            state.patient_detail_info_status = payload.data
        },
        DELETE_APPOINTMENT_DATA(state, payload) {
            state.appointmentList.splice(payload.id, 1);
        },
        APPOINTMENT_ENCOUNTER_COUNT(state, payload) {
            state.appointment_encounter_data = payload;
        },
    },
    actions: {
        fetchAppointmentData({commit}, data) {
            get('get_appointment_queue', data)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("FETCH_APPOINTMENT_DATA", response.data.data);
                        commit("SET_APPOINTMENT_TOTAL_ROW", response.data.total_rows);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
        async fetchAppointmentSlots({commit}, data) {
            if(data.date !== undefined && data.date === 'Invalid date'){
                return
            }
            commit("RESET_TIME_SLOT");
            await get('get_appointment_slots', data)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("FETCH_APPOINTMENT_SLOTS", response.data.data);
                        if (response.data.data.length === 0) {
                            // displayErrorMessage("Doctor is not available for this date")
                        }
                    } else {
                        displayErrorMessage(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage('Internal server error')
                })
        },
        setFilterDate({ commit }, data ) {
            commit("SET_FILTER_DATE", moment(data.date).format('YYYY-MM-DD') );
        },
        fetchAppointmentEncounterCount({commit}, data) {
            console.log(data)
            get('patient_profile_view_details', data)
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        commit("APPOINTMENT_ENCOUNTER_COUNT", response.data.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        },
    },
    getters: {}
}
