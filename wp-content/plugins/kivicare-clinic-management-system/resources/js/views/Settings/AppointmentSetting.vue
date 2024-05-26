<template>
  <div>
    <div class="page-loader-section" v-if="formLoader">
      <loader-component-2></loader-component-2>
    </div>
    <div>
      <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="8" md="8" lg="8">
              <h2 class="mb-0">{{ formTranslation.appointments.restrict_appointment_detail }} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#appointment-setting" target="_blank"><i class="fa fa-question-circle"></i></a></h2> 
            </b-col>
          </b-row>
        </template>
        <form
            id="patient form"
            name="patient form"
            @submit.prevent="handleSubmit"
            :novalidate="true"
            enctype="multipart/form-data"
        >
          <div class="row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-4 ">
                  <div class="form-group">
                    <label for="post_appointment" class="form-control-label"
                    > {{formTranslation.appointments.post_appointment}}
                    <span
                      class="text-danger">*</span>
                    </label>
                    <b-input-group size="md">
                      <b-form-input
                          id="post_appointment"
                          :class="{ ' is-invalid': submitted && $v.restrictAppointment.post_book.$error }"
                          v-model="restrictAppointment.post_book"
                          required="required" name="price" type="number"
                          min="0"
                          max="100000000000"
                          :disabled="isDisable"
                      ></b-form-input>
                    </b-input-group>
                    <div v-if="submitted && !$v.restrictAppointment.post_book.required"
                         class="invalid-feedback">{{formTranslation.appointments.post_appointment_required}}
                    </div>
                    <div v-else-if="submitted && (!$v.restrictAppointment.post_book.minValue || !$v.restrictAppointment.post_book.maxValue )"
                         class="invalid-feedback">{{formTranslation.appointments.post_appointment_length}}
                    </div>
                    <div v-if="prevValCheck" class="invalid-feedback">
                      {{formTranslation.appointments.post_day_must_be_greater_then_pre_day}}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="pre_appointment" class="form-control-label"
                    >{{formTranslation.appointments.pre_appointment}}
                    <span
                      class="text-danger">*</span>
                    </label>
                    <b-input-group size="md">
                      <b-form-input
                          id="pre_appointment"
                          :class="{ ' is-invalid': submitted && $v.restrictAppointment.pre_book.$error }"
                          v-model="restrictAppointment.pre_book"
                          required="required" name="price" type="number"
                          min="0"
                          max="100000000000"
                          :disabled="isDisable"
                      ></b-form-input>
                    </b-input-group>
                    <div v-if="submitted && !$v.restrictAppointment.pre_book.required"
                         class="invalid-feedback">{{formTranslation.appointments.pre_appointment_required}}
                    </div>
                    <div v-else-if="submitted && (!$v.restrictAppointment.pre_book.minValue || !$v.restrictAppointment.pre_book.maxValue )"
                         class="invalid-feedback">{{formTranslation.appointments.pre_appointment_length}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="col-md-12">
              <p> {{formTranslation.appointments.pre_post_note}} </p>
            </div>
          </div>
          <b-row class="mt-2 ml-4">
            <b-col sm="12" md="12" lg="12">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="checkbox-same-day-booking-only"
                    v-model="restrictAppointment.only_same_day_book"
                    name="checkbox-same-day-booking-only"
                    value="on"
                    unchecked-value="off"
                    @change="onOnlySameDayBookChange"
                    switch
                >
                  <b> {{formTranslation.appointments.same_day_booking_only_lbl}} </b>
                </b-form-checkbox>
              </div>
            </b-col>
          </b-row>
          <div class="row" >
            <div class="col-md-12" >
              <div class="d-flex justify-content-end">
                <button type="submit" :disabled="restrictAppointmentLoading"  class="btn btn-primary">
                  <i :class="restrictAppointmentLoading ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i> {{ restrictAppointmentLoading ? formTranslation.common.loading : formTranslation.common.save }}
                </button>
              </div>
            </div>
          </div>
        </form>
      </b-card>
      <b-card class="card-body" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0"> {{formTranslation.appointments.multi_file_upload}}  </h2>
            </b-col>
          </b-row>
        </template>
        <b-row class="mt-2 ml-2">
          <b-col sm="12" md="12" lg="12">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-1"
                  v-model="status"
                  name="checkbox-1"
                  value="on"
                  unchecked-value="off"
                  @change="onFileUploadStatusChange"
                  switch
              >
                <b> {{formTranslation.appointments.appointment_multi_file_upload}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>
      </b-card>
      <b-card class="card-body" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0"> {{formTranslation.appointments.appointment_daily_reminder}}</h2>
            </b-col>
          </b-row>
        </template>
        <b-row class="mt-2 ml-3">
          <b-col sm="12" md="4" lg="4">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-2"
                  v-model="reminder.status"
                  value="on"
                  name="checkbox-2"
                  unchecked-value="off"
                  switch
              >
                <b> {{formTranslation.appointments.appointment_email_reminder}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col sm="12" md="4" lg="4" v-if="userData.addOns.kiviPro == true">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-3"
                  v-model="reminder.sms_status"
                  value="on"
                  name="checkbox-2"
                  unchecked-value="off"
                  switch
              >
                <b> {{formTranslation.appointments.appointment_sms_reminder}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col sm="12" md="4" lg="4" v-if="userData.addOns.kiviPro == true && userData.pro_version >= '1.2.0'">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-4"
                  v-model="reminder.whatapp_status"
                  value="on"
                  name="checkbox-2"
                  unchecked-value="off"
                  switch
              >
                <b> {{formTranslation.appointments.appointment_whatsapp_reminder}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>
        <!-- <b-row class="mt-2 ml-2" v-if="userData.addOns.kiviPro == true">
          <b-col sm="12" md="4" lg="4">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-3"
                  v-model="reminder.sms_status"
                  value="on"
                  name="checkbox-2"
                  unchecked-value="off"
                  switch
              >
                <b> {{formTranslation.appointments.appointment_sms_reminder}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col sm="12" md="4" lg="4">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-4"
                  v-model="reminder.whatapp_status"
                  value="on"
                  name="checkbox-2"
                  unchecked-value="off"
                  switch
              >
                <b> {{formTranslation.appointments.appointment_whatsapp_reminder}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row> -->
        <!-- <b-row class="mt-2 ml-2" v-if="userData.addOns.kiviPro == true">
          <b-col sm="12" md="4" lg="4">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-4"
                  v-model="reminder.whatapp_status"
                  value="on"
                  name="checkbox-2"
                  unchecked-value="off"
                  switch
              >
                <b> {{formTranslation.appointments.appointment_whatsapp_reminder}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row> -->
        <b-row class="mt-2" v-if="reminder.status == 'on' || reminder.whatapp_status =='on' || reminder.sms_status =='on' ">
          <b-col sm="2" md="2" lg="2">
            <div class="form-group">
              <label> <b> {{ formTranslation.appointments.notice_of_appointment_reminder }} </b> </label>
              <b-select  class="form-control text-capitalize" name="option" v-model="reminder.time" >
                <option v-bind:key="i.id" v-for="i in 48" :value=" i < 10 ? '0'+i : i " > {{   i < 10 ? '0'+i+':00' : i+':00'}}</option>
              </b-select>
            </div>
          </b-col>
          <b-col sm="8" md="8" lg="8">
            <div class="form-group m-2">
              <p>
                <b>
                  <!-- {{ formTranslation.appointments.notice_of_appointment_reminder }} -->
                </b>
              </p>
            </div>
          </b-col>
        </b-row>
        <!-- <b-row>
          <b-col sm="12" md="12" lg="12">
            <p>
              {{formTranslation.appointments.appointment_reminder_info}}
            </p>
          </b-col>
        </b-row> -->
        <div class="row" >
          <div class="col-md-12" >
            <div class="d-flex justify-content-end">
              <button v-if="!loading" @click="appointmentReminder" class="btn btn-primary">
                <i class="fa fa-save"></i> {{ formTranslation.common.save }}
              </button>
              <button v-else class="btn btn-primary" type="submit" disabled>
                <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
              </button>
            </div>
          </div>
        </div>
      </b-card>
      <b-card class="card-body" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0"> {{formTranslation.appointments.appointment_time_format + ' ' + formTranslation.common.deprecated}} 
                <a href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#appointment-setting" target="_blank"><i class="fa fa-question-circle"></i></a>
              </h2>
            </b-col>
          </b-row>
        </template>
        <b-row class="mt-2 ml-2">
          <b-col sm="12" md="12" lg="12">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-timeformat"
                  name="checkbox-timeformat"
                  value="on"
                  unchecked-value="off"
                  @change="onAppointmentTimeFormat"
                  switch
                  :disabled="true"
              >
                <b> {{formTranslation.appointments.appointment_time_24_format}} </b>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>
      </b-card>
      <b-card class="card-body" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0">{{formTranslation.appointments.appointment_description_notes}}</h2>
            </b-col>
          </b-row>
        </template>
        <b-row class="mt-2 ml-2">
          <b-col sm="6" md="6" lg="6">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-appointment-description"
                  v-model="onAppointmentDescription"
                  name="checkbox-appointment-description"
                  value="on"
                  unchecked-value="off"
                  @change="onAppointmentDescriptionChange"
                  switch
              >
                <b>{{formTranslation.appointments.appointment_description}}</b>
              </b-form-checkbox>
            </div>
          </b-col>
          <b-col sm="6" md="6" lg="6">
            <div class="form-group">
              <b-form-checkbox
                  size="md"
                  id="checkbox-appointment-patient_info"
                  v-model="onAppointmentPatientInfo"
                  name="checkbox-appointment-patient_info"
                  value='on'
                  unchecked-value='off'
                  @change="onAppointmentPatientInfoChange"
                  switch
              >
                <b>{{formTranslation.appointments.show_patient_information}}</b>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>
      </b-card>
      <!-- <b-card class="card-body" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0">{{formTranslation.appointments.appointment_cancellation_buffer}}</h2>
            </b-col>
          </b-row>
        </template>
        <b-row class="mt-2 ml-2">

          <div>
            <div class="col-md-12">
              <p> {{formTranslation.appointments.appointment_cancellation_buffer_note}} </p>
            </div>
          </div>
          <b-row class="mt-2 ml-4">
            <b-col sm="12" md="12" lg="12">
              <div class="form-group">
                <b-form-checkbox
                    size="md"
                    id="checkbox-cancellation-buffer"
                    v-model="cancellation_buffer.status"
                    name="checkbox-cancellation-buffer"
                    value="on"
                    unchecked-value="off"
                    @change="cancellationBufferStatus"
                    switch
                >
                  <b> {{formTranslation.appointments.enable_cancellation_buffer_lbl}} </b>
                </b-form-checkbox>
              </div>
            </b-col>
          </b-row>
        </b-row>
        <b-row class="mt-2" v-if="cancellation_buffer.status == 'on'">
          <b-col sm="2" md="2" lg="2">
            <div class="form-group">
              <label> <b> {{ formTranslation.appointments.notice_of_cancellation_buffer }} </b> </label>
              <b-select class="form-control text-capitalize" name="option" v-model="cancellation_buffer.time">
                <option v-for="(value, key) in intervalOptions" :key="key" :value="value">
                  {{ value.label }}
                </option>
              </b-select>
            </div>
          </b-col>
        </b-row>
        <div class="row" >
          <div class="col-md-12" >
            <div class="d-flex justify-content-end">
              <button v-if="!loading" @click="appointmentCancellationBuffer" class="btn btn-primary">
                <i class="fa fa-save"></i> {{ formTranslation.common.save }}
              </button>
              <button v-else class="btn btn-primary" type="submit" disabled>
                <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
              </button>
            </div>
          </div>
        </div>
      </b-card> -->
    </div>
  </div>
</template>
<script>
import { post, get } from "../../config/request";
import {maxLength, maxValue, minLength, minValue, required} from "vuelidate/lib/validators";
export default {
  name: "UniqueIdSetting",
  components: {
  },
  data: () => {
    return {
      onAppointmentDescription:"on",
      onAppointmentPatientInfo: "on",
      restrictAppointment:{},
      restrictAppointmentLoading: false,
      loading: false,
      cancellation_buffer_loading: false,
      submitted: false,
      status: 'off',
      onAppointmentTimeFormatStatus:'off',
      reminder:{
        time:'24',
        status:'off',
        sms_status:'off',
        whatapp_status:'off'
      },
      storePrevios: {
        pre_book: '',
        post_book: ''
      },
      formLoader:true,
      request_status:'off',
      isDisable: false,
      isCancellationBufferDisable: false,
      cancellation_buffer: {
        status:'off',
        time: '' // This will hold the selected time value
      },
      intervalOptions: [
        { value: '0.25', label: '15 minutes' },
        { value: '0.50', label: '30 minutes' },
        { value: '0.75', label: '45 minutes' },
        { value: '1', label: '1 hour' },
        { value: '2', label: '2 hours' },
        { value: '3', label: '3 hours' },
        { value: '4', label: '4 hours' },
        { value: '5', label: '5 hours' },
        { value: '6', label: '6 hours' },
        { value: '12', label: '12 hours' },
        { value: '24', label: '1 day' },
        { value: '48', label: '2 days' },
        { value: '72', label: '3 days' },
        { value: '96', label: '5 days' },
        { value: '144', label: '6 days' },
        { value: '168', label: '1 week' },
        { value: '336', label: '2 weeks' },
        { value: '504', label: '3 weeks' },
        { value: '672', label: '4 weeks' },
        { value: '840', label: '5 weeks' },
        { value: '1008', label: '6 weeks' },
        { value: '1176', label: '7 weeks' },
        { value: '1344', label: '8 weeks' }
      ]
    };
  },
  validations: {
    restrictAppointment:{
      pre_book: {
        required,
        minValue: minValue(0),
        maxValue:maxValue(365)
      },
      post_book: {
        required,
        minValue: minValue(0),
        maxValue:maxValue(365)
      },
    }
  },
  mounted() {
    if(!['administrator'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.onAppointmentTimeFormatStatus = window.request_data !== undefined && window.request_data.appointment_time_format === 'on' ? 'on' : 'off';
    this.restrictAppointment = this.defaultData();
    this.edit();
    this.editAppointmentReminder();
    this.editAppointmentCancellationBuffer();
    this.getFileUploadStatus();
    this.getAppointmentDescription();
    this.getAppointmentPatientInfo();
    this.getModule();
  },
  methods: {
    defaultData() {
      return {
        pre_book: "0",
        post_book: "365",
        only_same_day_book: "off",
      };
    },
    handleSubmit() {

      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.restrictAppointment.$invalid) {
        return;
      }

      let pre_book_message = ''; 
      let alert_message = 'Pre booking open before ' + this.restrictAppointment.post_book + ' days ' + pre_book_message   ;

      if(this.restrictAppointment.pre_book != 0) {
        pre_book_message = ' and close before ' + this.restrictAppointment.pre_book + ' days of booking date.'
      } else {
        alert_message += 'before appointment booking date.' ;
      }

      alert_message = 'Appointment pre booking open from ' + this.restrictAppointment.post_book + ' days ' + pre_book_message + ' before appointment booking date. ' ;

      // let alert_message = 'Appointment pre booking starts from ' + this.restrictAppointment.post_book + ' day and stop ' + this.restrictAppointment.pre_book + ' days before appointment booking date. </ br>' + this.formTranslation.appointments.pre_book_are_you_sure ;

      $.confirm({
          title: this.formTranslation.appointments.booking_restriction,
          content: alert_message,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                this.restrictAppointmentLoading = true;
                post("restrict_appointment_save",this.restrictAppointment)
                .then((response) => {
                  this.restrictAppointmentLoading = false;
                  if (
                      response.data.status !== undefined &&
                      response.data.status === true
                  ) {
                    this.submitted = false;
                    this.storePrevios = Object.assign({}, this.storePrevios, this.restrictAppointment);
                    displayMessage(response.data.message);
                  } else {
                    this.restrictAppointmentLoading = false;
                    this.submitted = false;
                    displayErrorMessage(response.data.message);
                  }
                })
                .catch((error) => {
                  this.submitted = false;
                  this.restrictAppointmentLoading = false;
                  console.log(error);
                  displayErrorMessage(this.formTranslation.common.internal_server_error);
                });
              }
            },
            cancel: {
              text:this.formTranslation.common.cancel
            }
          }
      });

    },
    getAppointmentDescription: function(){
      this.formLoader = true;
      get('get_appointment_description_status',{})
        .then((res) => {
          this.formLoader = false;
          this.onAppointmentDescription = ((res.data.data == 'on') ? 'on' : 'off') ; 
        })
    },
    getAppointmentPatientInfo: function(){
      this.formLoader = true;
      get('get_appointment_patient_info_status',{})
        .then((res) => {
          this.formLoader = false;
          this.onAppointmentPatientInfo = ((res.data.data == 'on') ? 'on' : 'off') ; 
        })
    },
    getFileUploadStatus:function (){
      this.formLoader = true;
      get('get_multifile_upload_status',{} )
          .then((response) => {
            this.status = response.data.data ;
            this.formLoader = false;
          })
          .catch((error) => {
            this.formLoader = false;
            console.log('error', error);
          })
    },
    onFileUploadStatusChange:function (value){
      get('change_multifile_upload_status', { status: value } )
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.$store.commit("appointmentModule/FILE_UPLOAD_STATUS",{data:value});
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log('error', error);
          })
    },
    onOnlySameDayBookChange:function (value){
      if(value == 'on'){
        this.isDisable = true;
      }else{
        this.isDisable = false;
      }
    },
    cancellationBufferStatus:function (value){
      if(value == 'on'){
        this.isCancellationBufferDisable = true;
      }else{
        this.isCancellationBufferDisable = false;
      }
    },
    edit() {
      this.formLoader = true;
      get("restrict_appointment_edit", {})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              setTimeout(() => {
                this.restrictAppointment = response.data.data;
                if(this.restrictAppointment.only_same_day_book === 'on'){
                  this.isDisable = true;
                }
                else{
                  this.isDisable = false;
                }
                this.storePrevios = Object.assign({}, this.storePrevios, response.data.data);
              }, 200);
              this.formLoader = false;
            }
          })
          .catch((error) => {
            this.formLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    appointmentReminder:function(){
      this.loading = true;
      post('appointment_reminder_notificatio_save', this.reminder )
          .then((response) => {
            this.loading = false;
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
              setTimeout(()=>{
                window.location.reload()
              },1000)
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.loading = false;
            console.log('error', error);
          })
    },
    appointmentCancellationBuffer:function(){
      this.cancellation_buffer_loading = true;
      post('appointment_cancellation_buffer_save', this.cancellation_buffer )
          .then((response) => {
            this.cancellation_buffer_loading = false;
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
            } else {
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            this.cancellation_buffer_loading = false;
            console.log('error', error);
          })
    },
    editAppointmentCancellationBuffer:function (){
      this.formLoader = true;
      get("get_appointment_cancellation_buffer", {})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.cancellation_buffer = response.data.data;
            }
            this.formLoader = false;
          })
          .catch((error) => {
            console.log(error);
            this.formLoader = false;
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    editAppointmentReminder:function (){
      this.formLoader = true;
      get("get_appointment_reminder_notification", {})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.reminder = response.data.data;
            }
            this.formLoader = false;
          })
          .catch((error) => {
            console.log(error);
            this.formLoader = false;
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    onAppointmentTimeFormat:function(){
      post("update_appointment_time_format", {timeFormat: this.onAppointmentTimeFormatStatus})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
              setTimeout(()=>{
                window.location.reload()
              },1000)
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    onAppointmentDescriptionChange:function(value){
      post("appointment_description_status_change", {status: this.onAppointmentDescription})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              this.$store.commit("appointmentModule/DESCRIPTION_STATUS",{data:value});
              displayMessage(response.data.message);
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    onAppointmentPatientInfoChange:function(value){
      post("appointment_patient_info_status_change", {status: this.onAppointmentPatientInfo})
          .then((response) => {
            if (
                response.data.status !== undefined &&
                response.data.status === true
            ) {
              displayMessage(response.data.message);
              this.$store.commit("appointmentModule/PATIENT_INFO_STATUS",{data:value});
            }else{
              displayErrorMessage(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          });
    },
    getModule:function (){
        if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
        }
    }
  },
  computed:{
    userData () {
      return this.$store.state.userDataModule.user;
    },
    prevValCheck () {
      if(parseInt(this.restrictAppointment.pre_book) > parseInt(this.restrictAppointment.post_book)
          || parseInt(this.restrictAppointment.pre_book) === parseInt(this.restrictAppointment.post_book)) {
        return true ;
      } else {
        return false ;
      }
    }
  }
};
</script>