<template>
  <b-row>
    <b-col sm="12">
        <appointment-calender @reloadAppointment="init" v-if="reloadCalender"></appointment-calender>
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
      reloadCalender: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      this.getDashboardData();
      this.dashboardData = this.defaultDashboardData();
      this.appointmentRequest = this.defaultAppointmentRequest();
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
        revenue: 0,
        change_log: true,
        telemed_log: false
      }
    },
    getDashboardData: function () {
      get('get_dashboard', {})
          .then((response) => {
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
    }
  }
}
</script>
