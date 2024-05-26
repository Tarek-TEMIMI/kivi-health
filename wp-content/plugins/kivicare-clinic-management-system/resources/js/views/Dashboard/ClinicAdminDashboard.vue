<template>
  <b-row>
    <b-col sm="12">
      <div class="row">
        <div :class="'col-xl-'+totalCardEnable+ (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')" v-if="kcCheckPermission('dashboard_total_patient')">
          <router-link :to="{ name: 'patient'}">
            <div class="card card-stats shadow p-0">
              <!-- Card body -->
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0"> {{formTranslation.dashboard.total_patients}} </h5>
                    <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                      <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    </span>
                    <span v-else class="h2 font-weight-bold mb-0">{{ dashboardData.patient_count }}</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-gradient-red text-white rounded-circle shadow">
                      <i class="fas fa-user-injured"></i>
                    </div>
                  </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                  <span class="text-nowrap">{{formTranslation.dashboard.total_visited_patients}}</span>
                </p>
              </div>
            </div>
          </router-link>
        </div>
        <div :class="'col-xl-'+totalCardEnable+ (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')" v-if="kcCheckPermission('dashboard_total_doctor')">
          <router-link :to="{ name: 'doctor'}">
            <div class="card card-stats shadow p-0">
              <!-- Card body -->
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">{{formTranslation.dashboard.total_doctors}}</h5>
                    <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                      <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    </span>
                    <span v-else class="h2 font-weight-bold mb-0">{{ dashboardData.doctor_count }}</span>
                  </div>
                  <div class="col-auto">
                    <div
                        class="icon icon-shape bg-gradient-orange text-white rounded-circle shadow">
                      <i class="fas fa-user-md"></i>
                    </div>
                  </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                  <span class="text-nowrap">{{formTranslation.dashboard.total_clinic_doctors}}</span>
                </p>
              </div>
            </div>
          </router-link>
        </div>
        <div :class="'col-xl-'+totalCardEnable+ (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')" v-if="kcCheckPermission('dashboard_total_appointment')">
          <router-link :to="{ name: 'appointment-list.index'}">
            <div class="card card-stats shadow p-0">
              <!-- Card body -->
              <div class="card-body">

                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0">{{formTranslation.dashboard.total_appointments}}</h5>
                    <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                      <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    </span>
                    <span v-else class="h2 font-weight-bold mb-0">{{dashboardData.appointment_count }}</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-gradient-green text-white rounded-circle shadow">
                      <i class="fas fa-calendar-check"></i>
                    </div>
                  </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                  <span class="text-nowrap">{{formTranslation.dashboard.total_clinic_appointments}}</span>
                </p>
              </div>
            </div>
          </router-link>
        </div>
        <div :class="'col-xl-'+totalCardEnable+ (totalCardEnable > 1 ? ' col-md-6' : ' col-md-12')" v-if="kcCheckPermission('dashboard_total_revenue')">
          <div class="card card-stats shadow p-0">
            <!-- Card body -->
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">{{formTranslation.dashboard.total_revenue}}</h5>
                  <span v-if="isdataLoading" class="h2 font-weight-bold mb-0">
                      <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    </span>
                  <span v-else class="h2 font-weight-bold mb-0"> {{ dashboardData.revenue }}</span>
                </div>
                <div class="col-auto">
                  <div class="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                    <i class="fas fa-money-check-alt"></i>
                  </div>
                </div>
              </div>
              <p class="mt-3 mb-0 text-sm">
                <span class="text-nowrap">{{formTranslation.dashboard.total_clinic_revenue}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-7">
            <div class="card p-0 shadow">
                <div class="card-header bg-transparent">
                    <div class="row align-items-center">
                        <div class="col-8">
                          <h6 class="text-uppercase text-muted ls-1 mb-1">{{formTranslation.dashboard.latest_appointments}}</h6>
                          <h2 class="mb-0 text-capitalize">{{formTranslation.dashboard.today_appointment_list}}</h2>
                        </div>
                        <div class="col-4">
                          <div class="d-flex justify-content-end align-items-center">
                            <module-data-export :module_data="csvAppointmentData" :module_name="formTranslation.appointments.appointments"  module_type="appointment" v-if="kcCheckPermission('appointment_export')"> </module-data-export>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                  <appointment-list :isLoading="isLoading" @isReloadTrue="appointmentReload" @csvData="csvLoadAppointmentData" @refreshDashboard="getDashboardData"/>
                </div>
            </div>
        </div>
        <div class="col-xl-5">
          <div class="card p-0 shadow">
            <div class="card-header bg-transparent">
              <div class="row align-items-center">
                <div class="col">
                  <h6 class="text-uppercase text-muted ls-1 mb-1">{{chartFilterType === 'weekly' ? formTranslation.dashboard.weekly_appointments  : formTranslation.dashboard.monthly_appointments}}</h6>
                  <h2 class="mb-0 text-capitalize">{{ chartFilterType === 'weekly' ? formTranslation.dashboard.weekly_total_appointments : formTranslation.dashboard.monthly_total_appointments}}</h2>
                </div>
              </div>
              <div class="row">
                <div class="col rmb-15">
                                  <span
                                      class="badge mr-2  cursor-pointer" v-for="(status, index) in filterType"
                                      :class="( chartFilterType === status.value ? 'badge-primary p-2 ' : 'badge-outline-primary')"
                                      :style="( chartFilterType === status.value ? 'font-size: 0.8rem;' : '')"
                                      @click="chartFilterChange(status.value)"
                                      :key="index">{{ status.label }}
                                  </span>
                </div>
              </div>
            </div>
            <div class="card-body">
              <weekly-appointment-chart :chartFilterType="chartFilterType"/>
            </div>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>

import AppointmentList from "../../components/appointment/AppointmentList";
import {get, post} from "../../config/request";
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
      isdataLoading:true,
      csvLoader:true,
      csvAppointmentData:[],
      chartFilterType:'weekly',
      filterType: [
        {label: 'Weekly', value: "weekly"},
        {label: 'Monthly', value: "monthly"},
      ],
      totalCardEnable:0
    }
  },
  mounted() {
    this.init();
    this.filterType = this.filterType.map( (item) => {
      item.label = this.formTranslation.common[item.value];
      return item;
    })
    if(this.kcCheckPermission('dashboard_total_patient')){
      this.totalCardEnable++;
    }
    if(this.kcCheckPermission('dashboard_total_doctor')){
      this.totalCardEnable++;
    }
    if(this.kcCheckPermission('dashboard_total_appointment')){
      this.totalCardEnable++;
    }
    if(this.kcCheckPermission('dashboard_total_revenue')){
      this.totalCardEnable++;
    }
    if(this.totalCardEnable > 0){
      this.totalCardEnable = 12/this.totalCardEnable;
    }
  },
  methods: {
    init: function () {
      this.getDashboardData();
      this.dashboardData = this.defaultDashboardData();
      this.appointmentRequest = this.defaultAppointmentRequest();
    },
    chartFilterChange(value){
      this.chartFilterType = value;
    },
    defaultDashboardData: function () {
      return {
        appointment_count: 0,
        doctor_count: 0,
        patient_count: 0,
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
          this.isLoading = true
    },
    defaultAppointmentRequest: function () {
      return {
        date: new Date()
      }
    },
    iUnderstand: function (type) {
      post('set_change_log' , { log_type: type })
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              console.log();
              if(type === 'version_read_change') {
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
    },
    csvLoadAppointmentData(data) {
      this.csvAppointmentData = this.formatJsonAppointmentData(data)
      this.csvLoader = false;
    },
  },
  computed:{
    userData() {
      return this.$store.state.userDataModule.user;
    },
  }
}
</script>
