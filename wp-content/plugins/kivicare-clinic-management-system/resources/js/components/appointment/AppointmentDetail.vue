<template>
  <div class="container">
    <div>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 text-center mb-2">
          <img :src="appointmentConfirmationImage" class="mx-auto d-block">
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h4 class="text-primary text-center border-bottom pt-2 mt-2 pb-2 mb-2"> {{ formTranslation.widgets.appointment_info }} </h4>
        </div>
      </div>
      <div class="row mt-4 mb-4">
        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
          <div> <i class="far fa-calendar-plus"></i> {{ formTranslation.common.date }} : <span class="iq-font-weight"> <b> {{
            appointmentData.appointment_start_date }} </b> </span></div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
          <div> <i class="far fa-clock mr-2"></i> {{ formTranslation.common.time }} : <span class="iq-font-weight"> <b> {{
            appointmentData.appointment_start_time }} </b> </span></div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
          <div class="text-capitalize"> <i class="far fa-list-alt"></i> {{ formTranslation.common.service }} : <span
              class="iq-font-weight"> <b> {{ appointmentData.visit_type | visitFilter }} </b> </span></div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
          <div> <i class="fa fa-user-md mr-2"></i> {{ formTranslation.common.doctor }}: <span class="iq-font-weight"> <b> {{
            formTranslation.widgets.dr_prefix }}{{ appointmentData.doctor_id.label }} </b> </span></div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
          <div class="text-capitalize"> <i class="fas fa-money-check"></i> {{ formTranslation.service.charges }} : <span
              class="iq-font-weight"> <b>{{ appointmentData.visit_type | visitCharge({ prefix, postfix, tax: appointmentData.tax }) }}</b> </span>
          </div>
        </div>
      </div>
      <div v-if="onAppointmentPatientInfo == 'on'" class="row">
        <div class="col">
          <h4 class="text-primary border-bottom pb-2"> {{ formTranslation.widgets.patient_info }} </h4>
        </div>
      </div>
      <div v-if="onAppointmentPatientInfo == 'on'" class="row mt-4 mb-4">
        <div class="col-sm-12 col-md-6 col-lg-6 mb-2">
          <div class="d-block mb-2"><i class="fas fa-user-injured mr-2"></i> {{ formTranslation.patient.patient_name }} : <span
              class="iq-font-weight"> <b> {{ userData.display_name }} </b> </span></div>
          <div><i class="far fa-envelope mr-2"></i> {{ formTranslation.common.email }} : <span class="iq-font-weight"> <b> {{
            userData.user_email }} </b> </span></div>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-6" v-if="appointmentData.description !== ''">
          <div><i class="fas fa-notes-medical mr-2"></i> {{ formTranslation.appointments.description }} : <span
              class="iq-font-weight"> <b> {{ appointmentData.description }} </b> </span></div>
        </div>
      </div>
      <div class="row" v-if="Object.keys(user.all_payment_method).length > 0">
        <div class="col">
          <h4 class="text-primary text-center border-bottom pb-2 mb-2"> {{ formTranslation.settings.payment }} </h4>
        </div>
      </div>
      <div class="row m-1" v-if="Object.keys(user.all_payment_method).length > 0">
        <b-form-group label="" v-slot="{ ariaDescribedby }">
          <b-form-radio-group id="radio-group-1" v-model="appointmentData.payment_mode" :options="user.all_payment_method"
            :aria-describedby="ariaDescribedby" name="radio-options"></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 text-center">
          <button v-if="!loading" class="btn btn-primary float-right " @click="handleSubmit">
            &nbsp; {{ formTranslation.appointments.save_appointment }}
          </button>
          <button v-else class="btn btn-primary float-right" type="button" disabled>
            {{ formTranslation.common.loading }}
          </button>
          <button class="btn btn-primary cancel-btn mr-1 float-right" type="button" @click="handleCancel">
            {{ formTranslation.common.cancel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['appointmentData', 'userData', 'prefix', 'postfix'],
  data: () => {
    return {
      appointmentBtnHtml: 'Confirm booking',
      loading: false,
      AppointmentImage: '',
      appointmentConfirmationImage: '',
      timer: '',
      overlaySpinner: false
    }
  },
  mounted() {
    this.init();
    let img = 'icon-12.png';
    if (this.appointmentData.enableTeleMed) {
      img = 'icon-123.png'
    }
    this.appointmentConfirmationImage = window.request_data.kiviCarePluginURL + 'assets/images/' + img;
  },
  methods: {
    init: function () {
    },
    handleSubmit: function () {
      let _this = this;
      this.loading = true;
      this.$emit('bookAppointment')
    },
    handleCancel: function () {
      this.$emit('cancelAppointment', {});
    },
    // appointmentEndTimeFormat: function (end) {
    //   if (window.request_data !== undefined && window.request_data.appointment_time_format == 'on') {
    //     if (typeof end != "undefined" && end != null && end !== '') {
    //       return moment(end, ["h:mm A"]).format("HH:mm");
    //     }
    //   }
    //   return end;
    // },
    // appointmentFormatDate(date) {
    //   return moment(date).format('YYYY-MM-DD')
    // }
  },
  computed: {
    onAppointmentPatientInfo() {
      return window.request_data.patient_detail_info_status
    },
    user() {
      if (this.$store.state.userDataModule !== undefined && this.$store.state.userDataModule.user !== undefined) {
        return this.$store.state.userDataModule.user;
      } else {
        return [];
      }
    },
  },
  filters: {
    visitFilter(value) {

      if (value === undefined) return;

      if (value.length > 0) {

        if (value.length === 1) {
          return value[0].name
        }

        let service = value.map(x => {
          return x.name
        });

        if (service.length >= 2) {
          return service.join(", ");
        }

      }
    },
    visitCharge(value, {tax=0,prefix,postfix}) {
      if (value === undefined) return;
      if (value.length > 0) {

        // if (value.length === 1) {
        //   return value[0].charges
        // }

        let serviceCharge = value.reduce(function (sum, current) {
          return sum + parseInt(current.service_base_price);
        }, 0);

        let total_charges = serviceCharge + tax;

        return prefix + total_charges + postfix;

      }
    }
  }
}
</script>