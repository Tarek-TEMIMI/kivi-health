<template>
    <div class="row">
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="card shadow">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-6">
                            <h3 class="text-primary mb-0">{{formTranslation.dashboard.filter}}</h3>
                        </div>
                        <div class="col-md-6">
                            <button class="btn btn-sm btn-primary float-right" @click="handleResetFilter">
                                <i class="fa fa-redo-alt"></i> {{formTranslation.dashboard.reset}}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="form-control-label">{{formTranslation.common.date}}: <span>{{ selectedDate }}</span></label>
                                <vc-date-picker
                                    id="appointmentDate"
                                    title-position="left"
                                    v-model="filterData.date"
                                    @dayclick="handleDateChange"
                                    is-inline
                                    is-expanded  >
                                    <template v-slot="{ inputValue }">
                                        <input
                                            class="form-control date-picker"
                                            readonly
                                            :value="inputValue"
                                        />
                                    </template>
                                </vc-date-picker>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="kcCheckPermission('patient_appointment_status_change')" >
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="patient_id" class="form-control-label">{{formTranslation.common.patient}}</label>
                                <multi-select
                                    deselect-label=""
                                    select-label=""
                                    v-model="filterData.patient_id"
                                    @select="handleFilterChange"
                                    @remove="handleFilterChange"
                                    :tag-placeholder="this.formTranslation.appointments.tag_patient_plh" id="patient_id" 
                                    :placeholder="this.formTranslation.appointments.search_plh"
                                    label="label" track-by="id" :options="patients"
                                ></multi-select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-8 col-xl-9">
            <div class="card shadow">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-8 rmb-15">
                            <h3 class="text-primary ">{{formTranslation.dashboard.appointments}} <span class="cursor-pointer small ml-2" @click="handleFilterChange" v-b-tooltip.hover :title="formTranslation.common.refresh_list"><i class="fa fa-sync"></i></span></h3>
                            <span class="badge mr-2  cursor-pointer"  v-for="(status, index) in allStatus"
                                :class="(filterData.status !== undefined && filterData.status === status.value ? 'badge-primary ' : 'badge-outline-primary')"
                                v-if="status.value !== '-1' || displayLatest"
                                @click="handleStatusChange(status.value)"
                            :key="index" >{{ status.label }}</span>
                        </div>
                        <div class="col-md-4">
                            <div class="float-right">
                                <button class="btn btn-sm btn-primary" v-if="addAppointmentButton" @click="handleAppointmentForm({})" type="button" v-html="appBtnText"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12">
                            <b-collapse id="appointmentForm" :visible="showAppointmentForm && appointmentFormObj.id === undefined">
                                <AppointmentForm :appointmentData="appointmentFormObj" @appointmentSaved="handleAppointmentSave" />
                            </b-collapse>
                        </div>
                    </div>
                    <AppointmentCard :appointment-data="appointmentList" :appointmentDate="filterData.date" @reloadAppointment="handleFilterChange" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import AppointmentCard from "../../components/appointment/AppointmentCard";
import AppointmentForm from "../../components/appointment/AppointmentForm";

export default {
    components: { AppointmentCard, AppointmentForm },
    data: () => {
        return {
            filterData: {},
            appointmentFormObj: {},
            appBtnText: '<i class="fa fa-plus"></i> Add appointment',
            latestButton: true,
            addAppointmentButton: true,
            allStatus: [
                { label: "latest", value: "-1", hide: true },
                { label: "All", value: "all" },
                { label: "Completed", value: "3" },
                { label: "Cancelled", value: "0" },
            ],
            selectedDate: null,
            currentDate: null
        }
    },
    mounted() {
        this.$store.commit('TOGGLE_APPOINTMENT_FORM', false);
        this.init();
    },
    methods: {
        init: function () {
            this.filterData = this.defaultFilterData();
            this.$store.dispatch("userDataModule/fetchUserForDropdown", { userRoleName: this.patientRoleName })
            let filterData = Object.assign({}, this.filterData);
            filterData.date = moment(this.filterData.date).format('YYYY-MM-DD');
            this.$store.dispatch("appointmentModule/fetchAppointmentData", { filterData: filterData })
            //this.$store.dispatch("appointmentModule/setFilterDate", { date: this.filterData.date })
            this.$store.dispatch("staticDataModule/fetchStaticData", { type: "static_data_with_label", static_data_type: "appointment_types" });
        },
        defaultAppointmentData: function () {
            return {
                appointment_start_date: this.filterData.date,
                appointment_start_time: '',
                clinic_id: {},
                patient_id: {},
                doctor_id: {},
                visit_type: {},
                description: '',
                status: ""
            }
        },
        defaultFilterData: function () {
            return {
                date: new Date(),
                patient_id: {},
                status: "-1",
                appointmentType: ""
            }
        },
        handleResetFilter: function () {
            this.$store.commit('appointmentModule/RESET_TIME_SLOT');
            this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
            this.filterData = this.defaultFilterData();
            this.handleFilterChange();
        },
        handleFilterChange: function () {
            let filterData = Object.assign({}, this.filterData);
            filterData.date = moment(this.filterData.date).format('YYYY-MM-DD');

            setTimeout(() => {
                filterData.patient_id = this.filterData.patient_id;
                this.appointmentFormObj.patient_id = filterData.patient_id;
                this.$store.dispatch("appointmentModule/fetchAppointmentData", { filterData: filterData })
            },300)
        },
        handleStatusChange: function (status) {
            this.filterData.status = status;
            this.handleFilterChange();
        },
        getTimeSlot: function (data) {
            this.$store.dispatch("appointmentModule/fetchAppointmentSlots", data)
        },
        handleAppointmentForm: function (appointment) {
            if (!this.showAppointmentForm) {
                this.appBtnText = '<i class="fa fa-minus"></i> '+this.formTranslation.common.close_form_btn;
                this.$store.commit('TOGGLE_APPOINTMENT_FORM', true)

                this.$store.commit('appointmentModule/RESET_TIME_SLOT');

                if (appointment.id === undefined) {
                    let formObj = this.defaultAppointmentData();
                    formObj.clinic_id = {
                        id: this.clinic.id,
                        label: this.clinic.name
                    }

                    if (this.getUserRole() === 'doctor') {
                        formObj.doctor_id = {
                            id: this.doctor.ID,
                            label: this.doctor.display_name,
                            timeSlot: this.doctor.timeSlot,
                            enableTeleMed: this.doctor.enableTeleMed
                        }
                    } else if (this.getUserRole() === 'patient') {
                        formObj.patient_id = {
                            id: this.doctor.ID,
                            label: this.doctor.display_name
                        }
                    } else {
                        formObj.doctor_id = {}
                    }

                    formObj.appointment_start_date = moment(this.filterData.date).format('YYYY-MM-DD');

                    this.appointmentFormObj = formObj;
                } else {
                    this.appointmentFormObj = appointment;
                }
            } else {
                this.appBtnText = '<i class="fa fa-plus"></i> '+this.formTranslation.appointments.add_appointment_btn;
                this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
            }
        },
        handleAppointmentSave: function () {
            this.$store.commit('TOGGLE_APPOINTMENT_FORM', false);

            this.handleFilterChange();
        },
        handleDateChange: function (date) {
            this.$store.commit('appointmentModule/RESET_TIME_SLOT');
            //this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
            let filterData = Object.assign({}, this.filterData);
            filterData.date = date.id;

            if (moment(filterData.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
                filterData.status = "all";
            } else {
                filterData.status = "-1";
            }

            this.appointmentFormObj.appointment_start_date = filterData.date;
            if (this.appointmentFormObj.doctor_id !== undefined && this.appointmentFormObj.doctor_id.id !== undefined) {
                this.getTimeSlot({
                    date: moment(filterData.date).format('YYYY-MM-DD'),
                    appointment_id: this.appointmentFormObj.id !== undefined ? this.appointmentFormObj.id : "",
                    clinic_id: this.appointmentFormObj.clinic_id.id,
                    doctor_id: this.appointmentFormObj.doctor_id.id,
                    patient_id: this.appointmentFormObj.patient_id.id,
                })
            } else {
                this.$store.commit('appointmentModule/RESET_TIME_SLOT');
            }
            this.$store.dispatch("appointmentModule/fetchAppointmentData", { filterData: filterData })
        }
    },
    computed: {
        patients() {
            return this.$store.state.userDataModule.userDropDownData.patients
        },
        appointmentList() {
            return this.$store.state.appointmentModule.appointmentList
        },
        appointmentTypes() {
            return [];
        },
        clinic() {
            return this.$store.state.userDataModule.clinic;
        },
        doctor() {
            return this.$store.state.userDataModule.user;
        },
        displayLatest() {
            let status = moment(this.filterData.date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
            if (!status) {
                this.filterData.status = "all";
            } else {
                this.filterData.status = "-1";
            }
            return status;
        },
        showAppointmentForm() {
            return this.$store.state.showAppointmentForm;
        },
        date() {
              if(this.filterData.date != null) {
                this.selectedDate = moment(this.filterData.date).format('DD-MM-YYYY');
                this.currentDate = this.filterData.date;
              }
              if(this.selectedDate != null){
                this.currentDate = moment(this.currentDate).format('YYYY, MM, DD')
                this.filterData.date =  new Date( this.currentDate )
              }

            return this.filterData.date
        }
    },
    watch: {
        date(newVal) {
            if (moment(newVal).isAfter(moment()) || moment(newVal).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                this.addAppointmentButton = true
            } else {
                this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
                this.addAppointmentButton = false
            }
        },
        showAppointmentForm(newValue) {

            if (!newValue) {
                this.appBtnText = '<i class="fa fa-plus"></i> '+this.formTranslation.appointments.add_appointment_btn;
            } else {
                this.appBtnText = '<i class="fa fa-minus"></i> '+this.formTranslation.common.close_form_btn;
            }
        }
    }
}
</script>
