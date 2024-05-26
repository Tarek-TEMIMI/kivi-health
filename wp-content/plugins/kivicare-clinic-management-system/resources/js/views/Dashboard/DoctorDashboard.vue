<template>
    <b-row>
        <b-col sm="12">
            <div class="row">
                <div :class="'col-xl-' + totalCardEnable + (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')"
                    v-if="kcCheckPermission('dashboard_total_patient')">
                    <router-link :to="{ name: 'patient' }">
                        <div class="card card-stats shadow p-0">
                            <!-- Card body -->
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <h5 class="card-title text-uppercase text-muted mb-0">
                                            {{ formTranslation.dashboard.total_patients }} </h5>
                                        <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                                            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                        </span>
                                        <span v-else class="h2 font-weight-bold mb-0">{{ dashboardData.patient_count
                                        }}</span>
                                    </div>
                                    <div class="col-auto">
                                        <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                                            <i class="fas fa-user-injured"></i>
                                        </div>
                                    </div>
                                </div>
                                <p class="mt-3 mb-0 text-sm">
                                    <span class="text-nowrap">{{ formTranslation.dashboard.total_visited_patients }}</span>
                                </p>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div :class="'col-xl-' + totalCardEnable + (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')"
                    v-if="kcCheckPermission('dashboard_total_appointment')">
                    <router-link :to="{ name: 'appointment-list.index' }">
                        <div class="card card-stats shadow p-0">
                            <!-- Card body -->
                            <div class="card-body">

                                <div class="row">
                                    <div class="col">
                                        <h5 class="card-title text-uppercase text-muted mb-0">
                                            {{ formTranslation.dashboard.total_appointments }}</h5>
                                        <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                                            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                        </span>
                                        <span v-else class="h2 font-weight-bold mb-0">{{
                                            dashboardData.appointment_count
                                        }}</span>
                                    </div>
                                    <div class="col-auto">
                                        <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                                            <i class="fas fa-calendar-check"></i>
                                        </div>
                                    </div>
                                </div>
                                <p class="mt-3 mb-0 text-sm">
                                    <span class="text-nowrap">{{ formTranslation.dashboard.total_appointments }}</span>
                                </p>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div :class="'col-xl-' + totalCardEnable + (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')"
                    v-if="kcCheckPermission('dashboard_total_today_appointment')">
                    <router-link :to="{ name: 'appointment-list.index' }">
                        <div class="card card-stats shadow p-0">
                            <!-- Card body -->
                            <div class="card-body">

                                <div class="row">
                                    <div class="col">
                                        <h5 class="card-title text-uppercase text-muted mb-0">
                                            {{ formTranslation.dashboard.total_today_appointments }}</h5>
                                        <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                                            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                        </span>
                                        <span v-else class="h2 font-weight-bold mb-0">{{
                                            dashboardData.today_count
                                        }}</span>
                                    </div>
                                    <div class="col-auto">
                                        <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                                            <i class="fas fa-calendar-check"></i>
                                        </div>
                                    </div>
                                </div>
                                <p class="mt-3 mb-0 text-sm">
                                    <span class="text-nowrap">{{ formTranslation.dashboard.total_today_appointments }}</span>
                                </p>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div :class="'col-xl-' + totalCardEnable + (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')"
                    v-if="kcCheckPermission('dashboard_total_service')">
                    <router-link :to="{ name: 'service' }">
                        <div class="card card-stats shadow p-0">
                            <!-- Card body -->
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <h5 class="card-title text-uppercase text-muted mb-0">
                                            {{ formTranslation.dashboard.total_service }}</h5>
                                        <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                                            <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                        </span>
                                        <span v-else class="h2 font-weight-bold mb-0"> {{ dashboardData.service }}</span>
                                    </div>
                                    <div class="col-auto">
                                        <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                                            <i class="fas fa-money-check-alt"></i>
                                        </div>
                                    </div>
                                </div>
                                <p class="mt-3 mb-0 text-sm">
                                    <span class="text-nowrap">{{ formTranslation.dashboard.total_service }}</span>
                                </p>
                            </div>
                        </div>
                    </router-link>
                </div>
                <b-col v-if="  userData.telemedConfigOn && userData.is_enable_doctor_zoom_telemed == 'off'" sm="12">
                    <b-alert show variant="warning" class="d-flex align-items-center justify-content-between">
                        <p class="m-0 w-100">
                            <b> {{ formTranslation.zoom_telemed.deprecated_notice }} </b>
                            <button @click="$router.push('setting/telemed')" class="btn btn-primary btn-sm float-right">
                                {{ formTranslation.zoom_telemed.deprecated_notice_btn }}
                            </button>
                        </p>
                    </b-alert>
                </b-col>
            </div>
            <appointment-calender @reloadAppointment="init" v-if="reloadCalender"></appointment-calender>
        </b-col>
    </b-row>
</template>

<script>

import AppointmentList from "../../components/appointment/AppointmentList";
import { get, post } from "../../config/request";
import VueApexCharts from 'vue-apexcharts'

export default {
    components: {
        AppointmentList,
        apexcharts: VueApexCharts
    },
    data: () => {
        return {
            isLoading: false,
            dashboardData: {},
            isAppointmentReload: false,
            appointmentRequest: {},
            reloadCalender: true,
            isdataLoading: true,
            totalCardEnable: 0
        }
    },
    mounted() {

        this.init();
        if (this.kcCheckPermission('dashboard_total_patient')) {
            this.totalCardEnable++;
        }
        if (this.kcCheckPermission('dashboard_total_appointment')) {
            this.totalCardEnable++;
        }
        if (this.kcCheckPermission('dashboard_total_today_appointment')) {
            this.totalCardEnable++;
        }
        if (this.kcCheckPermission('dashboard_total_service')) {
            this.totalCardEnable++;
        }
        if (this.totalCardEnable > 0) {
            this.totalCardEnable = 12 / this.totalCardEnable;
        }
    },
    methods: {
        init: function () {
            this.getDashboardData();
            this.dashboardData = this.defaultDashboardData();
            this.appointmentRequest = this.defaultAppointmentRequest();
            this.reloadCalender = false;
            this.$nextTick(() => {
                // Add the component back in
                this.reloadCalender = true;
            });
        },
        defaultDashboardData: function () {
            return {
                appointment_count: 0,
                doctor_count: 0,
                patient_count: 0,
                today_count: 0,
                revenue: 0,
                change_log: true,
                telemed_log: false
            }
        },
        getDashboardData: function () {
            get('get_dashboard', {})
                .then((response) => {
                    this.isdataLoading = false;
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.dashboardData = response.data.data
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                })
        },
        defaultAppointmentRequest: function () {
            return {
                date: new Date()
            }
        },
        iUnderstand: function (type) {
            post('set_change_log', { log_type: type })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        console.log();
                        if (type === 'version_read_change') {
                            this.dashboardData.change_log = true
                        } else if (type === 'telemed_read_load') {
                            this.dashboardData.telemed_log = true
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                })
        },
        appointmentReload: function () {
            this.isLoading = false
        }
    },
    computed: {
        userData() {
            return this.$store.state.userDataModule.user;
        },
    }
}
</script>
<style lang='scss'></style>