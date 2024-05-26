<template>
    <b-row>
        <b-col v-if="!isEmailSMTPWorking" lg="" sm="12"  > 
            <ModalPopup
            v-if="openTestEmailModal"
            modalId="send-test-email"
            modalSize="lg"
            :openModal="openTestEmailModal"
            :modalTitle="formTranslation.common.send_email"
            @closeModal="openTestEmailModal = false"
            > 

            <div class="form-group">
                    <label for="email" class="form-control-label"> {{formTranslation.common.email}}</label>
                    <input class="form-control" id="email" v-model="testEmail.recieverDetails" :placeholder="formTranslation.notification.plh_enter_email">
                    <div v-if="testSubmitted && (!$v.testEmail.recieverDetails.required )" class="invalid-feedback"> {{formTranslation.notification.test_sender_email_required}}. </div>
                </div>
                <div class="form-group">
                    <label for="email_content" class="form-control-label"> {{formTranslation.notification.test_content}} </label>
                    <textarea class="form-control" id="email_content" v-model="testEmail.content"></textarea>
                    <div v-if="testSubmitted && (!$v.testEmail.content.required)" class="invalid-feedback"> {{formTranslation.notification.test_content_required}}. </div>
                </div>
        <div class="d-flex justify-content-end">
            <button class="btn btn-outline-primary" @click="openTestEmailModal=false">
              {{formTranslation.common.cancel}}
            </button>
            <button class="btn btn-primary" @click="sendTestEmail">
              Test
            </button>
          </div>
        </ModalPopup>
            <b-alert show variant="warning" class="d-flex align-items-center justify-content-between">
                <p class="m-0"> <b> {{ formTranslation.common.smtp_setup_msg }} </b>
                    <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/email-sms-and-whatsapp/" target="_blank"><i class="fa fa-question-circle"></i></a>
                </p>
                <button class="btn btn-sm  btn-secondary float-right" type="button" @click="openTestEmailModal = true"><i class="fas fa-paper-plane"></i> {{formTranslation.widgets.send_test_email}}</button>
            </b-alert>
        </b-col>
        <b-col v-if="(userData.addOns.kiviPro == true && versionData.kivi_pro_version < '2.5.1') || (userData.addOns.telemed == true && versionData.kivi_telemed_version < '2.1.0') || (userData.addOns.googlemeet == true && versionData.kivi_googlemeet_version < '1.0.6')" sm="12" >
            <b-alert show variant="warning" class="d-flex align-items-center justify-content-between">
                <p class="m-0"> <b> The latest kivicare lite plugin requires : </b>
                    <b v-if="(userData.addOns.kiviPro == true && versionData.kivi_pro_version < '2.5.1')"> Kivicare Pro Version 2.5.1</b>
                    <b v-if="(userData.addOns.telemed == true && versionData.kivi_telemed_version < '2.1.0')"> - KiviCare Zoom Telemed Version 2.1.0</b>
                    <b v-if="(userData.addOns.googlemeet == true && versionData.kivi_googlemeet_version < '1.0.6')"> - KiviCare Google Meet Telemed Version 1.0.6</b>
                </p>
            </b-alert>
        </b-col>
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
                                      <h5 class="card-title text-uppercase text-muted mb-0"> {{formTranslation.dashboard.total_doctors}} </h5>
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
                                <span class="text-nowrap">{{formTranslation.dashboard.total_generated_revenue}}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="row mt-4">
                <div class="col-xl-8 mb-5 mb-xl-0">
                    <div class="card p-0 shadow">
                        <div class="card-header bg-transparent">
                            <div class="row align-items-center">
                                <div class="col-md-4 col-lg-4 rmb-15">
                                    <h6 class="text-uppercase text-muted ls-1 mb-1">{{formTranslation.dashboard.latest_appointments}}</h6>
                                    <h2 class="mb-0 text-capitalize">{{formTranslation.dashboard.today_appointment_list}}</h2>
                                </div>
                                <div class="col-md-8 col-lg-8 ">
                                    <div class="d-flex justify-content-end align-items-center">
                                    <router-link :to="{ name: 'appointment-list.index' }"
                                                 class="btn btn-sm btn-primary text-capitalize  ml-2"><i
                                        class="fas fa-eye"></i> {{formTranslation.dashboard.all_upcoming_appointment}}
                                    </router-link>
                                    <button class="btn btn-sm btn-primary text-capitalize "
                                            @click="isLoading = true" ><i class="fas fa-sync"></i> {{formTranslation.dashboard.reload}}
                                    </button>
                                      <module-data-export :module_data="csvAppointmentData" :module_name="formTranslation.appointments.appointments"  module_type="appointment" v-if="kcCheckPermission('appointment_export')"> </module-data-export>
                                 </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" style="overflow: auto">
                            <div class="chart">
                                <appointment-list ref="appointment_list" :isLoading="isLoading" @isReloadTrue="appointmentReload" @csvData="csvLoadAppointmentData" @refreshDashboard="getDashboardData"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4">
                    <div class="card p-0 shadow">
                        <div class="card-header bg-transparent">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h6 class="text-uppercase text-muted ls-1 mb-1">{{chartFilterType === 'weekly' ? formTranslation.dashboard.weekly_appointments  : formTranslation.dashboard.monthly_appointments}}</h6>
                                    <h2 class="mb-0 text-capitalize">{{ chartFilterType === 'weekly' ? formTranslation.dashboard.weekly_total_appointments : formTranslation.dashboard.monthly_total_appointments}}</h2>
                                </div>
                            </div>
                            <div class="row">
                              <div class="col-8 rmb-15">
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
import {required} from "vuelidate/lib/validators";
import VueApexCharts from 'vue-apexcharts'
import ModalPopup from "../../components/Modal/Index";

export default {
    components: {
        AppointmentList,
        apexcharts: VueApexCharts,
        ModalPopup
    },
    data: () => {
        return {
            isLoading: false,
            dashboardData: {},
            isAppointmentReload: false,
            appointmentRequest: {},
            isEmailSMTPWorking: true,
            testSubmitted: false,
            testEmail: {
                recieverDetails: '',
                content: 'Welcome to Kivicare, This is test mail.'
            },
            notificationType:'email',
            isLocoTranslationUpdated: false,
            isdataLoading: true,
            csvLoader:true,
            csvAppointmentData:[],
            chartFilterType:'weekly',
            filterType: [
              {label: 'Weekly', value: "weekly"},
              {label: 'Monthly', value: "monthly"},
            ],
            versionData: {
                kivi_pro_version: 0,
                kivi_telemed_version: 0,
                kivi_googlemeet_version: 0
            },
            request_status:'off',
            openTestEmailModal:false,
            totalCardEnable:0
        }
    },
    validations: {
        testEmail: {
            recieverDetails: { required },
            content: { required }
        }
    },
    mounted() {
        this.init();
        this.filterType = this.filterType.map( (item) => {
            item.label = this.formTranslation.common[item.value];
            return item;
        });
        this.getModule();
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
    computed: {
      userData() {
        return this.$store.state.userDataModule.user;
      },
    },
    methods: {
      chartFilterChange(value){
        this.chartFilterType = value;
      },
      csvLoadAppointmentData(data) {
        this.csvAppointmentData = this.formatJsonAppointmentData(data)
        this.csvLoader = false;
      },
        getWoocoomerceStatus: function() {
            const user = this.$store.state.userDataModule.user;
            if (user.roles !== undefined) { 
                return user.woocommercePayment;
            } else{
                return '';
            }
        },
        init: function () {
            this.getDashboardData();
            this.dashboardData = this.defaultDashboardData();
            this.appointmentRequest = this.defaultAppointmentRequest();
            this.getVersionData();
            // this.getUnderstandLocoTranslation();
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
                        this.isdataLoading = false
                        this.dashboardData = response.data.data
                        this.isEmailSMTPWorking = response.data.data.is_email_working
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                })
        },
        getVersionData: function () {
            get('get_version_data', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.versionData.kivi_pro_version = response.data.data.kivi_pro_version
                        this.versionData.kivi_telemed_version = response.data.data.kivi_telemed_version
                        this.versionData.kivi_googlemeet_version = response.data.data.kivi_googlemeet_version
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
                        if(type === 'version_read_change') {
                            this.dashboardData.change_log = true ;
                        } else if (type === 'telemed_read_load') {
                            this.dashboardData.telemed_log = false ;
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                })
        },
        iUnderstandLocoTranslation: function (type) {
            post('i_understnad_loco_translate' , { log_type: type })
            .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                    this.isLocoTranslationUpdated = false ;
                    location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.widgets.record_not_found);
            })
        },
        getUnderstandLocoTranslation: function (type) {
            this.isLocoTranslationUpdated = window.request_data.understand_loco_translate
        },
        appointmentReload: function () {
            this.isLoading = false
        },
        sendTestEmail: function () {

            this.testSubmitted = true;

            // stop here if form is invalid
            this.$v.$touch();

            if (this.$v.testEmail.$invalid) {
                return;
            }
            this.testEmail.type = this.notificationType
            post('send_test_notification', this.testEmail)
                .then((response) => {
                this.testSubmitted = false ;
                if (response.data.status !== undefined && response.data.status === true) {
                    displayMessage(response.data.message);
                    this.isEmailSMTPWorking = true;
                } else {
                    displayErrorMessage(response.data.message);
                }
            })
            .catch((error) => {
                this.testSubmitted = false ;
                displayErrorMessage(this.formTranslation.common.server_error);
            })
        },
        getModule:function (){
          if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
            this.request_status = window.request_data.link_show_hide;
          }
        }
    }
}
</script>
