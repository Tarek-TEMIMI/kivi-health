<template>
  <div class="kivi-container">
    <input type="hidden" value="" id="payment_status_child" />
    <div class="page-loader-section" v-if="overlaySpinner" style="height:unset">
      <loader></loader>
    </div>
    <div>
      <div class="kivi-row">
        <div class="kivi-col-sm-12 kivi-col-md-12 kivi-col-lg-12 text-center mb-2">
          <img :src="appointmentConfirmationImage" class="mx-auto d-block">
        </div>
      </div>
      <div class="kivi-row">
        <div class="kivi-col">
          <h4 class="kivi-text-primary kivi-boder-bottom pb-2 mb-2"> {{formTranslation.widgets.appointment_info}} </h4>
        </div>
        <hr/>
      </div>
      <div class="kivi-row mt-4 mb-4">
        <div class="kivi-col-sm-12 kivi-col-md-6 kivi-col-lg-6 mb-2">
          <div> <i class="far fa-calendar-plus"></i> {{formTranslation.common.date}} : <span class="iq-font-weight"> <b> {{ appointmentData.appointment_start_date }} </b> </span></div>
        </div>
        <div class="kivi-col-sm-12 kivi-col-md-6 kivi-col-lg-6 mb-2">
          <div> <i class="far fa-clock mr-2"></i>  {{formTranslation.common.time}} : <span class="iq-font-weight"> <b> {{ appointmentData.appointment_start_time }} </b> </span></div>
        </div>
        <div class="kivi-col-sm-12 kivi-col-md-6 kivi-col-lg-6 mb-2">
          <div class="text-capitalize"> <i class="far fa-list-alt"></i> {{formTranslation.common.service}} : <span class="iq-font-weight"> <b> {{ appointmentData.visit_type | visitFilter }} </b> </span></div>
        </div>
        <div class="kivi-col-sm-12 kivi-col-md-6 kivi-col-lg-6 mb-2">
          <div> <i class="fa fa-user-md mr-2"></i> {{formTranslation.common.doctor}}: <span class="iq-font-weight"> <b> {{ formTranslation.widgets.dr_prefix }}{{ appointmentData.doctor_id.label }} </b> </span></div>
        </div>
        <div class="kivi-col-sm-12 kivi-col-md-6 kivi-col-lg-6 mb-2">
          <div class="text-capitalize"> <i class="fas fa-money-check"></i> {{formTranslation.service.charges}} : <span class="iq-font-weight"> <b> {{ appointmentData.visit_type | visitCharge }} </b> </span></div>
        </div>
      </div>
      <div v-if="onAppointmentPatientInfo == 'on'" class="kivi-row">
        <div class="kivi-col">
          <h4 class="kivi-text-primary kivi-boder-bottom pb-2"> {{formTranslation.widgets.patient_info}} </h4>
        </div>
        <hr/>
      </div>
      <div v-if="onAppointmentPatientInfo == 'on'" class="kivi-row mt-4 mb-4">
        <div class="kivi-col-sm-12 kivi-col-md-6 kivi-col-lg-6 mb-2">
          <div class="d-block mb-2"><i class="fas fa-user-injured mr-2"></i> {{formTranslation.patient.patient_name}} : <span class="iq-font-weight"> <b> {{ userData.data.display_name }} </b> </span></div>
          <div><i class="far fa-envelope mr-2"></i>  {{formTranslation.common.email}} : <span class="iq-font-weight"> <b> {{ userData.data.user_email }} </b> </span></div>
        </div>
        <div class="kivi-col-sm-12 kivi-col-md-6 kivi-col-lg-6" v-if="appointmentData.description !== ''">
          <div><i class="fas fa-notes-medical mr-2"></i> {{formTranslation.appointments.description}} : <span class="iq-font-weight"> <b> {{ appointmentData.description }} </b> </span></div>
        </div>
      </div>
      <div class="kivi-row" v-if="Object.keys(user.all_payment_method).length > 0">
        <div class="kivi-col">
          <h4 class="kivi-text-primary kivi-boder-bottom pb-2 mb-2"> {{formTranslation.settings.payment}} </h4>
        </div>
      </div>
      <div class="kivi-row m-1" v-if="Object.keys(user.all_payment_method).length > 0">
        <b-form-group label="" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
              id="radio-group-1"
              v-model="appointmentData.payment_mode"
              :options="user.all_payment_method"
              :aria-describedby="ariaDescribedby"
              name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <hr/>
      <div class="kivi-row">
        <div class="kivi-col-sm-12 kivi-col-md-12 kivi-col-lg-12 text-center">
          <button v-if="!loading" class="btn kivi-btn-primary float-right my-4 ml-2" @click="handleSubmit">
            <i class="fa fa-save"></i>&nbsp; {{formTranslation.appointments.save_appointment}}
          </button>
          <button v-else class="btn kivi-btn-primary float-right my-4 ml-2" type="button" disabled>
            <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
          </button>
          <button class="btn kivi-btn-primary cancel-btn my-4 float-right" type="button" @click="handleCancel"> {{formTranslation.common.cancel}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {post,get} from "../../../config/request";
import loader from "../../Partials/Loader"
export default {
  components:{
    loader
  },
  props: ['appointmentData', 'userData' ,'prefix' ,'postfix'],
  data: () => {
    return {
      appointmentBtnHtml: 'Confirm booking',
      loading: false,
      AppointmentImage: '',
      appointmentConfirmationImage: '',
      childWindow:'',
      ajaxResponseData:{},
      timer:'',
      overlaySpinner:false
    }
  },
  mounted() {
    this.init();
    let img = 'icon-12.png';
    if (this.appointmentData.enableTeleMed) {
      img = 'icon-123.png'
    }
    this.appointmentConfirmationImage = window.request_data.kiviCarePluginURL + 'assets/images/' + img;
    if(Object.keys(this.user.all_payment_method).length > 0){
      this.appointmentData.payment_mode = Object.keys(this.user.all_payment_method)[0]
    }
  },
  methods: {
    init: function () {
    },
    handleSubmit: function () {
      let _this = this;
      this.loading = true;
      post('save_appointment', this.appointmentData)
        .then((res) => {
          console.log('res ====>', res);
          this.loading = false;
          this.ajaxResponseData = res.data;
          if (res.data.status !== undefined && res.data.status === true) {
            let checkWoocommerceCart = res.data ;
            if (checkWoocommerceCart.woocommerce_cart_data !== undefined) {
              if(checkWoocommerceCart.woocommerce_cart_data.woocommerce_redirect !== undefined) {
                if(this.appointmentData.payment_mode === 'paymentPaypal'){
                  this.childWindow = kiviOpenPaymentWindow(checkWoocommerceCart.woocommerce_cart_data.woocommerce_redirect)
                  this.overlaySpinner = true;
                  this.timer = setInterval(this.checkChildWindow, 500);
                  return;
                }else{
                  location.href = checkWoocommerceCart.woocommerce_cart_data.woocommerce_redirect ;
                }
              }
            }else{
              if(this.appointmentData.payment_mode === 'paymentRazorpay'){
                if(res.data.checkout_detail){
                  kivicareCreateRazorpayCheckoutPage(res.data.checkout_detail)
                  this.overlaySpinner = true;
                  this.timer = setInterval(this.checkChildWindow, 500);
                }else{
                  displayErrorMessage(res.data.message);
                }
                this.overlaySpinner = true;
                this.timer = setInterval(this.checkChildWindow, 500);
              }else if(this.appointmentFormObj.payment_mode === 'paymentStripepay'){
                if(response.data.checkout_detail){
                  kiviOpenPaymentWindow(response.data.checkout_detail.payment_url)
                  this.overlaySpinner = true;
                  this.timer = setInterval(this.checkChildWindow, 500);
                }else{
                  displayErrorMessage(response.data.message);
                }
              }else{
                this.$emit('bookAppointment', res.data);
              }
            }
            
          } else {
            let message = res.data.message !== undefined ? res.data.message : 'Internal server error';
            displayErrorMessage(message)
          }
        })
        .catch((error) => {
          this.loading = false;
          if (error.response) {
            if (error.response.data !== undefined && error.response.status === 401) {
              displayErrorMessage(error.response.data.message);
            }
          } else {
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          }
        })
    },
    handleCancel: function () {
      this.$emit('cancelAppointment', {});
    },
    // appointmentEndTimeFormat: function (end){
    //   if(window.request_data !== undefined && window.request_data.appointment_time_format == 'on' ){
    //     if(typeof end != "undefined" && end != null && end !== '') {
    //       return  moment(end, ["h:mm A"]).format("HH:mm");
    //     }
    //   }
    //   return end;
    // },
    checkChildWindow(){
      let ele = document.getElementById('payment_status_child');
      if(ele !== null && ele.value !== ''){
        clearInterval(this.timer);
        if(ele.value === 'failed'){
          displayErrorMessage(this.formTranslation.common.payment_transaction_failed);
          ele.value = '';
        }else if(ele.value === 'approved'){
          ele.value = '';
          this.$emit('bookAppointment', this.ajaxResponseData);
        }else{
          ele.value = '';
        }
        this.overlaySpinner = false;
      }
    }
  },
  computed: {
    formTranslation: function () {
      return this.$store.state.langTranslateData ;
    },
    onAppointmentPatientInfo(){
      return window.request_data.patient_detail_info_status
    },
    user() {
      return this.$store.state.user;
    },
  },
  filters: {
    visitFilter(value) {

      if(value === undefined) return ;

      if (value.length > 0) {

        if(value.length === 1) {
          return value[0].name
        }

        let service  = value.map(x => {
          return x.name
        });

        if(service.length >= 2) {
          return service.join(", ");
        }

      }
    },
    visitCharge(value){
      if(value === undefined) return ;
      if (value.length > 0) {

        if(value.length === 1) {
          return value[0].charges
        }

        let serviceCharge = value.reduce(function(sum, current) {
          return sum + parseInt(current.charges);
        }, 0);

        return serviceCharge;

      }
    }
  }
}
</script>