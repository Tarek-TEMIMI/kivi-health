<template>
  <div class="kivi-container kvp-wraper p-2">
    <div v-if="(userRole === 'kiviCare_patient' || userRole === '')  && !disableSelectedField" class="kivi-row p-2">
      <div v-if="isWidgetLoaded" class="kivi-col-sm-12">
        <div class="wrapper" >
          <div class="card-loader card-loader--tabs">
          </div>
        </div>
      </div>
      <div v-else class="kivi-col-sm-12">
        <div class="card book-appointment-widget">
          <div class="card-header kivi-header">
            <h3 class="my-0"> {{formTranslation.appointments.appointment_booking}} </h3>
          </div>
          <div class="card-body">
            <form id="appointmentDataForm" enctype="multipart/form-data" @submit.prevent="handleFormSubmit" :novalidate="true">
              <div class="kivi-row">
                <div class="kivi-col-md-12" v-if="user.addOns !== undefined && user.addOns.kiviPro == true && (clinic_id === 0 || clinic_id === '0')">
                  <div class="kivi-doctor-list align-items-center justify-content-between mb-2">
                    <h4 class="m-0"> {{formTranslation.widgets.clinics}} </h4>
                  </div>
                  <div v-if="clinicListLoader" class="text-center">
                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                  </div>
                  <div v-else>
                    <div class="kivi-row" v-if="clinicList.length > 0">
                      <div class="kivi-col-md-12">
                        <carousel
                            class="kc-doctor-slider" :paginationEnabled="false"
                            :per-page="perPage"
                            :navigationEnabled="true" navigationNextLabel='<i class="fa fa-angle-right"></i>'
                            navigationPrevLabel='<i class="fa fa-angle-left"></i>'>
                          <slide v-for="(doctor, index) in clinicList" :key="index">
                            <ClinicListCard :selectedId="selectedClinic" :details="doctor" @clinicClick="handleClinicClick" />
                          </slide>
                        </carousel>
                      </div>
                    </div>
                    <div class="kivi-row" v-else>
                      <div class="kivi-col-md-12 text-center">
                        <h5 class="kivi-text-primary my-0"> {{formTranslation.widgets.clinic_not_found}} </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="doctor_id === 0 || doctor_id === '0' || hideDoctor" class="kivi-col-md-12">
                  <div class="kivi-doctor-list align-items-center justify-content-between mb-2">
                    <h4 class="m-0">{{formTranslation.widgets.doctors}}</h4>
                    <div class="header-search">
                      <form>
                        <div class="form-group mb-0">
                          <input type="search" class="search-field form-control" :placeholder="doctorSearchText"
                                @keyup="searchDoctorByName" v-model="doctorSearch">
                        </div>
                      </form>
                    </div>
                  </div>
                  <div v-if="doctorListLoader" class="text-center">
                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                  </div>
                  <div v-else>
                    <div class="kivi-row" v-if="doctorsList.length > 0">
                      <div class="kivi-col-md-12">
                        <carousel
                            class="kc-doctor-slider" :paginationEnabled="false"
                            :per-page="perPage"
                            :navigationEnabled="true" navigationNextLabel='<i class="fa fa-angle-right"></i>'
                            navigationPrevLabel='<i class="fa fa-angle-left"></i>'>
                          <slide v-for="(doctor, index) in doctorsList" :key="index">
                            <DoctorDetailsCard :selectedId="doctorId" :details="doctor"  @doctorClick="handleDoctorClick" />
                          </slide>
                        </carousel>
                      </div>
                    </div>
                    <div class="kivi-row" v-else>
                      <div class="kivi-col-md-12 text-center">
                        <h5 class="kivi-text-primary my-0"> {{formTranslation.widgets.doc_not_found}} </h5>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="kivi-col-md-12 mt-lg-4 mt-sm-0">
                  <div v-if="doctorsList.length > 0" class="kivi-row">
                    <div class="kivi-col-lg-4">
                      <div class="form-group">
                        <h5 class="m-0 mb-4">{{formTranslation.common.date}} <span class="text-danger">*</span></h5>
                        <vc-date-picker
                          id="appointmentDate"
                          title-position="left"
                          v-model="appointmentData.appointment_start_date"
                          :disabled-dates='{ weekdays: DoctorWorkdays }'
                          @dayclick="handleDateChange"
                          is-inline
                          class="kivi-calender"
                          is-expanded
                          :min-date="minDate"
                          :max-date="maxDate"
                        >
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
                    <div class="kivi-col-lg-4 mt-lg-0 mt-2">
                      <div class="form-group">
                        <h5 class="m-0 mb-4">{{formTranslation.widgets.available_slots}} <span class="text-danger">*</span></h5>
                        <div v-if="((typeof timeSlots) === 'object' && timeSlots.length !== 0) || (timeSlots.length !== undefined && timeSlots.length > 0)"
                            class="animated widget_session_slots fadeIn form-control h-auto text-center">
                          <div v-for="(timeSlot, index) in timeSlots" class="form-group" :key="index">
                            <h6 class="m-0 mb-3">{{ ( JSON.stringify(timeSlot[0]).includes('AM') ?  formTranslation.widgets.morning  : formTranslation.widgets.evening ) }}  {{ formTranslation.widgets.session }} </h6>
                            <div class="d-inline" v-for="(slot, subIndex) in timeSlot" :key="subIndex">
                              <span
                                v-if="slot.available === true"
                                class="badge badge-custom-kivi m-2 cursor-pointer"
                                :class="(appointmentData.appointment_start_time === slot.time ? 'kivi-badge-active ' : 'badge-outline-kivi')"
                                @click="handleTimeChange(slot.time)"
                              >{{ slot.time }}</span>
                            </div>
                          </div>
                        </div>
                        <div v-else
                            class="text-center widget_session_slots fadeIn form-control h-auto d-flex align-items-center justify-content-center">
                          <b-spinner variant="primary" label="Spinning" v-if="slotLoading"></b-spinner>
                          <p class="kivi-text-primary mb-0 small" v-if="!slotLoading"><b> {{
                              appointmentSlotMessage
                            }} </b></p>
                        </div>
                        <div
                            v-if="(submitted || videoConsultationSubmitted)  && !$v.appointmentData.appointment_start_time.required"
                            class="invalid-feedback">{{formTranslation.appointments.time_slot_required}}
                        </div>
                      </div>
                    </div>
                    <div class="kivi-col-lg-4 mt-lg-0 mt-2">
                      <div class="kivi-row">
                        <div class="kivi-col-md-12">
                          <div>
                            <h5 class="m-0 mb-4"> {{formTranslation.common.service}} <span class="text-danger"> * </span></h5>
                            <multi-select
                              id="visit_type"
                              deselect-label=""
                              select-label=""
                              @select="appointmentTypeChangeSelect"
                              @remove="appointmentTypeChangeUnselect"
                              v-model="appointmentData.visit_type"
                              name="visit_type"
                              label="name" track-by="id"
                              :options="appointmentTypes"
                              placeholder=''
                              :loading="serviceMultiselectLoader"
                              :disabled="serviceMultiselectLoader"
                              :multiple="appointmentTypeMultiselect"
                            ></multi-select>
                            <div v-if="(submitted || videoConsultationSubmitted) && !$v.appointmentData.visit_type.required" class="invalid-feedback"> {{formTranslation.patient_bill.service_required}} </div>
                          </div>
                        </div>
                      </div>
                      <div class="kivi-row">
                        <div class="kivi-col-md-12">
                          <div class="form-group mb-4 mt-3">
                            <h5 class="m-0 mb-3"> {{formTranslation.widgets.service_detail}} </h5>
                            <div class=" text-center align-items-center appointment-widget-service-list d-flex align-items-center justify-content-center"  >
                              <div v-if="appointmentData.visit_type !== undefined && appointmentData.visit_type.length > 0">
                                <div v-for="(service, index) in appointmentData.visit_type" :key="index" >
                                  <span> <b> {{ service.name  }} </b> </span>
                                    <span> {{ ' - ' + service.charges }} </span>
                                </div>
                              </div>
                              <div v-else>
                                <p class="kivi-text-primary mb-0 small" v-if="!slotLoading"><b> {{formTranslation.widgets.no_service_detail_found}}. </b></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="kivi-row" v-show="!customFieldLoaderEnable">
                    <get-front-custom-fields
                        :key="componentKey"
                        v-if="showCustomField"
                        module_type="appointment_module"
                        :module_id="String((this.$route.params.id) !== undefined ? this.$route.params.id : 0)"
                        :doctor_id ="doctorId"
                        @bindCustomField="getCustomFieldsValues"
                        :fieldsValue="customFieldsData"
                        @requiredCustomField="getRequireFields"
                        @loader="customFieldLoader"
                    ></get-front-custom-fields>
                  </div>
                  <div v-if="customFieldLoaderEnable" class="text-center">
                    <b-spinner variant="primary" label="Spinning"></b-spinner>
                  </div>
                  <div class="kivi-row" v-if="user.appointmentMultiFile == true">
                    <div class="kivi-col-md-12">
                      <div class="form-group">
                        <h5 class="m-0 mb-3"> {{formTranslation.patient.add_medical_report}} </h5>
                        <input type="file" id="file_multi" name="file_multi[]" ref="file_multi" class="form-control" v-on:change="multiUploadProfile()" :multiple="user.addOns !== undefined && user.addOns.kiviPro == true"/>
                      </div>
                    </div>
                  </div>
                  <div class="kivi-row align-items-end">
                    <div class="kivi-col-md-9 kivi-col-sm-12">
                      <div v-if="enableDisableAppointmentDescriptionStatus == 'on'" class="form-group m-0 appointment-widget-description">
                        <h5 class="m-0 mb-4" >{{formTranslation.appointments.description}}</h5>
                        <input :disabled="!doctorsList.length > 0" class="form-control"  v-model="appointmentData.description" >
                      </div>
                    </div>
                    <div class="kivi-col-md-3 kivi-col-sm-12 mt-3">
                      <button type="button" class="btn kivi-btn-primary float-right"
                      @click="handleFormSubmit" :disabled="!disabledButton && !doctorsList.length > 0"> 
                      {{ formTranslation.patient_dashboard_widget.book_now_btn }}
                      </button>
                    </div>
                  </div>
                  <ModalPopup
                  v-if="authModel"
                  modalId="appointment_auth"
                  modalSize="lg"
                  :openModal="authModel"
                  :modalTitle="site_logo"
                  @closeModal="authModel = false"
                  >
                  <b-alert variant="success" ref="register-alert" show class="text-capitalize text-center"
                              v-if="isRegistered" dismissible>{{formTranslation.widgets.registration_success}}
                      </b-alert>
                      <AuthWidget :appointmentData="appointmentData" @loginSuccess="handleLoginSuccess" @registerSuccess="handleRegisterSuccess"/>
                </ModalPopup>
                  <ModalPopup
                  v-if="appointmentModel"
                  modalId="auth-modal-detail"
                  :modalSize="isAppointmentBooked ? 'md' : 'lg'"
                  :openModal="appointmentModel"
                  :modalTitle="modalTitle"
                  @closeModal="appointmentModel = false"
                  >
                  <AppointmentDetail 
                        v-if="!isAppointmentBooked" :appointment-data="appointmentData"
                        :user-data="userData" :prefix="prefix" :postfix="postfix" @bookAppointment="handleBookAppointment"
                        @cancelAppointment="handleCancelAppointment" :lazy="true"
                      />
                      <div v-else class="text-center p-2">
                        <div class="kivi-row">
                          <div class="kivi-col-sm-12 kivi-col-md-12 kivi-col-lg-12 pt-1">
                            <img :src="AppointmentImage" height="100px" width="100px">
                          </div>
                        </div>
                        <div class="kivi-row">
                          <div class="kivi-col-sm-12 kivi-col-md-12 kivi-col-lg-12 p-2">
                            <h4 class="apt-book-text"> {{ 'Appointment booked successfully' }}</h4>
                            <hr  v-if="user.addOns.kiviPro == true  && user.is_patient_enable == 'on'" />
                            <div v-if="user.addOns.kiviPro == true  && user.is_patient_enable == 'on'" class="social-area">
                              <h4 class="text-muted mt-5 font-weight-bold mb-2">{{formTranslation.common.add_to_calender}}</h4>
                            </div>
                            <div v-if="user.addOns.kiviPro == true && user.is_patient_enable == 'on'" class="cal-badge" >
                              <addToCalendar :calendar_content="appointmentData.calender_content">
                              </addToCalendar>
                            </div>
                          </div>
                        </div>
                      </div>
                </ModalPopup>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!disableSelectedField" style="text-align: center">
      <p>{{WidgetNotFoundText}}</p>
      <a :href="homePageUrl" target="_blank">
        <button type="button" class="btn btn-sm  kivi-btn-primary">
          {{ HomePageButtonText }}
        </button>
      </a>
    </div>
    <div v-else style="text-align: center">
      <p>{{NoClinicText}}</p>
      <a :href="homePageUrl" target="_blank">
        <button type="button" class="btn btn-sm  kivi-btn-primary">
          {{ HomePageButtonText }}
        </button>
      </a>
    </div>
  </div>
</template>

<script>

import {
  get, post
} from "../../../config/request";
import {Carousel, Slide} from 'vue-carousel';
import DoctorDetailsCard from "./DoctorDetailsCard";
import {required} from "vuelidate/lib/validators";
import {validateForm} from "../../../config/helper";
import AuthWidget from "../AuthWidget";
import AppointmentDetail from "./AppointmentDetail";
import ClinicListCard from './ClinicListCard'
import addToCalendar  from "../../appointment/addToCalendar";
import ModalPopup from "../../Modal/Index";

export default {
  components: {
    DoctorDetailsCard,
    AuthWidget,
    AppointmentDetail,
    Carousel,
    Slide,
    ClinicListCard,
    addToCalendar,
    ModalPopup
  },
  validations: {
    appointmentData: {
      appointment_start_date: {required},
      appointment_start_time: {required},
      visit_type: {required},
      doctor_id: {required},
      status: {required}
    },
  },
  props: {
    user_id: {
      type: [String, Number],
      default() {
        return 0;
      }
    },
    doctor_id: {
      type: [String, Number],
      default() {
        return 0;
      }
    },
    clinic_id: {
      type: [String, Number],
      default() {
        return 0;
      }
    },
  },
  data: () => {
    return {
      drDescription:'',
      Workdays:[1,2,3,4,5,6,7],
      pre_seleceted_doc : false,
      pre_seleceted_clinic : false,
      doctorIds:0,
      clinicIds:0,
      logoURL:'',
      isWidgetLoaded: true,
      userRole : window.request_data.current_user_role,
      doctorListLoader: true,
      clinicListLoader: true,
      doctorsList: [],
      clinicList: [],
      appointmentData: {},
      timeSlots: [],
      appointmentTypes: [],
      submitted: false,
      videoConsultationSubmitted: false,
      loading: false,
      videoLoading: false,
      buttonText: 'Book Appointment',
      videoConsulButtonText: 'Video consultation',
      authModel: false,
      loggedIn: false,
      isRegistered: false,
      appointmentModel: false,
      slotLoading: false,
      doctorSearch: '',
      tempDoctorList: [],
      appointmentSlotMessage: 'Please select doctor to get appointments.',
      userData: {},
      isAppointmentBooked: false,
      AppointmentImage: '',
      modalTitle: 'Summary',
      perPage: 3,
      isDoctorTelemedOn: false,
      showCustomField:false,
      componentKey: 0,
      appointmentCalData:{},
      selectedClinic:1,
      DoctorWorkdays:[],
      restrictAppointment:{
        pre_book: "0",
        post_book: "365",
      },
      minDate:new Date(),
      maxDate:new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      site_logo:'<img src="'+window.request_data.site_logo+'" class="navbar-brand-img ml-2 auth_image" alt="get" />',
      disableSelectedField:false,
      medicalReport:[],
      disabledButton:true,
      previousDate:'',
      prefix:'',
      postfix:'',
      NoClinicText:'',
      WidgetNotFoundText:'Admin can not view the widget. Only patients can view the widget. Please open this page in incognito mode or use another browser without an admin login.',
      HomePageButtonText:'Back To Home Page',
      homePageUrl:window.request_data.homePage,
      appointmentSuccessModal:false,
      doctorSearchText:'',
      hideDoctor:false,
      serviceMultiselectLoader:true,
      customFieldLoaderEnable:false,
      appointmentTypeMultiselect:true
    }
  },
  beforeMount() {
    this.getDynamicTranslation();
  },
  mounted() {
    this.getLoginUserDetail();
    this.init();
    this.logoURL = window.request_data.kiviCarePluginURL + 'assets/images/logo-banner.png';
    this.getRestrictAppointmentDay();

    if(this.clinic_id != 0 && this.doctor_id != 0){
      if(window.request_data.proActive){
        this.selectedClinic = this.clinic_id;
        this.appointmentData.clinic_id.id = this.clinic_id
        this.appointmentData.props_clinic_id = this.clinic_id
        this.appointmentData.props_doctor_id = this.doctor_id;
        if(typeof this.doctor_id == 'string' && this.doctor_id.includes(',')){
          this.hideDoctor = true;
          this.getDoctors();
        }else{
          this.getDoctors();
        }
      }else{
        if(parseInt(window.request_data.default_clinic_id) !== parseInt(this.clinic_id)){
          this.disableSelectedField = true;
        }else{
          this.appointmentData.props_doctor_id = this.doctor_id;
          if(typeof this.doctor_id == 'string' && this.doctor_id.includes(',')){
            this.hideDoctor = true;
            this.getDoctors();
          }else{
            this.getDoctors();
          }
        }
      }
    }else if(this.clinic_id != 0){
      if(!window.request_data.proActive && parseInt(window.request_data.default_clinic_id) !== parseInt(this.clinic_id)){
        this.disableSelectedField = true;
      }else{
        this.appointmentData.props_clinic_id = this.clinic_id;
        this.getClinicData();
      }
    }
  },
  methods: {
    init: function () {
      this.NoClinicText = this.formTranslation.common.select_doctor_or_clinic_is_not_available !== undefined ? this.formTranslation.common.select_doctor_or_clinic_is_not_available : 'Select Doctor or Clinic is not Available'
      window.addEventListener('resize', () => {
        this.handleResizeWindow()
      })

      this.handleResizeWindow();
      this.appointmentData = this.defaultAppointment();
      this.getClinicData();
      if(!window.request_data.proActive){
        this.getDoctors();
      }

      this.AppointmentImage = window.request_data.kiviCarePluginURL + 'assets/images/check-circle.gif';

      // get('get_static_data', {
      //   data_type: 'static_data_with_label',
      //   static_data_type: 'appointment_types'
      // })
      //   .then((res) => {
      //     if (res.data.status !== undefined && res.data.status === true) {
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   })
      this.getLoginUserDetail();
      setTimeout(() => {
        this.WidgetNotFoundText = this.formTranslation.widgets.onlyForPatient
        this.HomePageButtonText = this.formTranslation.widgets.back_to_home
      },3000)
    },
    getRestrictAppointmentDay:function(){
      this.restrictAppointment = window.request_data.appointment_restrict;
      this.minDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0);
      this.previousDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0)
      this.appointmentData. appointment_start_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0),
      this.maxDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.post_book) || 365);
    },
    getDynamicTranslation: function () {
      this.$store.dispatch("fetchLangTranslateData", {
        filePath: window.request_data.kiviCarePluginURL,
        current: 'temp',
        module: ''
      });
    },
    getCustomFieldsValues: function (fieldsObj) {
        if(!fieldsObj || fieldsObj === undefined){
          return false;
        }
        this.appointmentData.custom_fields = fieldsObj;
    },
    getRequireFields: function (validateRequired) {
      this.requiredFields = validateRequired;
    },
    customFieldLoader(value){
      this.customFieldLoaderEnable =value
      console.log(value)
    },
    handleResizeWindow: function () {
      if (window.innerWidth < 1024) {
        this.perPage = 1
      } else if (window.innerWidth < 1200) {
        this.perPage = 2
      }
    },
    defaultAppointment: function () {
      return {
        id: "",
        appointment_start_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * parseInt(this.restrictAppointment.pre_book) || 0),
        appointment_start_time: "",
        visit_type: [],
        description: "",
        patient_id: {},
        doctor_id: {},
        clinic_id: {
          id:1,
          label:''
        },
        status: 1,
        enableTeleMed: false,
        custom_fields:{},
        payment_mode:"paymentOffline"
      }
    },
    getDoctors: function () {
      this.doctorListLoader = true;
      this.doctorsList = [];
      get('get_doctor_details', this.appointmentData, true)
        .then((res) => {
          this.isWidgetLoaded = false;
          this.doctorListLoader = false;
          if (res.data.status !== undefined && res.data.status === true) {
            if(this.formTranslation.doctor_session !== undefined && this.formTranslation.common){
              this.doctorSearchText = (this.formTranslation.doctor_session.plh_search) + ' ' + (this.formTranslation.common.doctors)
            }
            if (res.data.data.length > 0) {
              this.tempDoctorList = res.data.data;
              this.doctorsList = res.data.data;
              if(res.data.postfix !== undefined){
                this.postfix = res.data.postfix
              }
              if(res.data.prefix !== undefined){
                this.prefix = res.data.prefix
              }
              if (this.doctorsList.length !== undefined && this.doctorsList.length > 0) {
                this.handleDoctorClick(this.doctorsList[0]);
              }
            }else if(this.clinic_id != 0 && this.doctor_id != 0){
              this.disableSelectedField = true;
            }
          }
        })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);;
          })
    },
    getClinicData: function () {
      this.clinicListLoader = true;
      get('get_clinic_detail', this.appointmentData, true)
        .then((res) => {
          this.isWidgetLoaded = false;
          this.clinicListLoader = false;
          if (res.data.status !== undefined && res.data.status === true) {
            if (res.data.data.length > 0) {
              this.clinicList = res.data.data;
              if (this.clinicList.length !== undefined && this.clinicList.length > 0) {
                this.handleClinicClick(this.clinicList[0]);
                
              }
            }else if(this.clinic_id != 0){
              this.disableSelectedField = true;
            }
          }
        })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);;
          })
    },
    handleDoctorClick: function (doctor) {
      this.appointmentData.doctor_id = {
        id: doctor.id,
        label: doctor.display_name,
        timeSlot: doctor.timeSlot
      };

      const appointmentData = Object.assign({}, this.appointmentData);
      this.isDoctorTelemedOn = false

      if (doctor.enableTeleMed) {
        this.isDoctorTelemedOn = true
      }

      appointmentData.appointment_start_date = moment(appointmentData.appointment_start_date).format('YYYY-MM-DD');
      this.getTimeSlots(appointmentData);
      this.appointmentData.visit_type = [] ;
      this.getDoctorsServices(doctor.id);
      this.forceRerender();
      this.getDoctorActiveDays(appointmentData.clinic_id.id !== undefined && appointmentData.clinic_id.id !== "" ?
           appointmentData.clinic_id.id : 1,doctor.id);
    },
    getDoctorActiveDays:function (clinic_id,id){
      get('get_doctor_workdays', {
        clinic_id: clinic_id,
        doctor_id: id
      })
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.DoctorWorkdays = response.data.data;
            }
          })
          .catch((error) => {
            console.log(error);
          })
    },
    handleClinicClick: function (clinic) {
      this.selectedClinic = clinic.id;
      this.appointmentData.clinic_id.id = clinic.id
      this.getDoctors();
    },
    forceRerender() {
      this.componentKey += 1;
      this.customFieldLoaderEnable=true
      this.showCustomField = true
    },
    handleDateChange: function (date) {
      if(moment(date.id).format('YYYY-MM-DD') < moment(this.previousDate).format('YYYY-MM-DD')){
        this.slotLoading = false;
        this.appointmentSlotMessage = this.formTranslation.patient_dashboard_widget.slot_not_available_msg
        this.timeSlots = [];
        return;
      }
      const appointmentData = Object.assign({}, this.appointmentData);
      appointmentData.appointment_start_date = date.id;
      this.getTimeSlots(appointmentData);
    },
    handleLoginSuccess: function (data) {
      this.getLoginUserDetail();
      this.userData = data;
      this.authModel = false;
      this.loggedIn = true;
      this.handleFormSubmit();
    },
    handleRegisterSuccess: function (data) {
      this.isRegistered = true;
      this.handleFormSubmit();
    },
    getTimeSlots: function (appointmentData) {
      this.slotLoading = true;
      if (appointmentData.doctor_id.id !== undefined && appointmentData.doctor_id.id !== "") {
        this.timeSlots = [];
        const slotData = {
          clinic_id : appointmentData.clinic_id.id !== undefined && appointmentData.clinic_id.id !== "" ? appointmentData.clinic_id.id : 1 ,
          date: appointmentData.appointment_start_date,
          appointment_id: appointmentData.id !== undefined ? appointmentData.id : "",
          doctor_id: appointmentData.doctor_id.id,
          patient_id: this.patientId,
          service: appointmentData.visit_type,
        }
        get('get_time_slots', slotData)
            .then((res) => {
              this.slotLoading = false;
              if (res.data.status !== undefined && res.data.status === true) {
                this.timeSlots = res.data.data;
                if (this.timeSlots.length === 0) {
                  this.appointmentSlotMessage = this.formTranslation.widgets.slot_not_available_msg ;
                }else{
                  if(this.timeSlots[0].length > 0 && this.timeSlots[0][0].time !== undefined){
                    this.appointmentData.appointment_start_time = this.timeSlots[0][0].time
                  }
                }
              } else {
                this.timeSlots = [];
                this.appointmentSlotMessage = this.formTranslation.widgets.slot_not_available_msg ;
                let message = res.data.message !== undefined ? res.data.message : 'Internal server error';
              }
            })
            .catch((error) => {
              this.slotLoading = true;
              console.log(error)
            })
      } else {
        this.slotLoading = false;
        this.appointmentSlotMessage =  this.formTranslation.widgets.select_doctor_msg ;
      }
    },
    handleTimeChange: function (time) {
      this.appointmentData.appointment_start_time = time;
    },
    handleFormSubmit: function () {

      this.loading = true;
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.appointmentData.$invalid) {
        this.loading = false;
        return;
      }

      if (parseInt(this.user_id) === 0 && this.loggedIn === false) {
        this.authModel = true;
        this.loading = true;
        this.submitted = true;
        return;
      }

      this.appointmentData.appointment_start_date = moment(this.appointmentData.appointment_start_date).format('YYYY-MM-DD');

      if (validateForm("appointmentDataForm")) {
        this.appointmentData.enableTeleMed = false;
        this.loading = false;
        this.submitted = false;
        this.appointmentModel = true;
        this.modalTitle=this.formTranslation.widgets.summary
      }
    },
    handleBookAppointment: function (res) {
      this.timeSlots = [];
      this.isAppointmentBooked = true;
      if (this.user.addOns.kiviPro == true) {
        this.appointmentData = res.data
      } else {
        this.appointmentData = this.defaultAppointment();
      }
      this.appointmentSuccessModal = true;
      this.modalTitle = this.formTranslation.common.booking_successful;
    },
    handleCancelAppointment: function () {
      this.appointmentModel = false;
      this.appointmentData = this.defaultAppointment();
      this.timeSlots = [];
      this.handleDoctorClick(this.doctorsList[0]);
    },
    getLoginUserDetail: function () {
      get('login_user_detail', {})
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              if (response.data.data.ID !== undefined && response.data.data.ID !== 0) {
                this.userData = response.data.data;
              }
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    searchDoctorByName: function () {
      let searchResult = [];
      let _this = this;
      if (_this.doctorSearch !== '') {
        searchResult = this.tempDoctorList.filter((item) => {
            if(item.display_name.toLowerCase().includes(_this.doctorSearch.toLowerCase())
                || item.contact_no.toLowerCase().includes(_this.doctorSearch.toLowerCase())
                || item.full_address.toLowerCase().includes(_this.doctorSearch.toLowerCase())
                || item.dob.toLowerCase().includes(_this.doctorSearch.toLowerCase())
                || item.specialties_all.toLowerCase().includes(_this.doctorSearch.toLowerCase())) {
              return item;
            }
        });
        this.doctorsList = searchResult;
      } else {
        this.doctorsList = this.tempDoctorList;
      }
    },
    getDoctorsServices:  function (doctorId) {
      this.appointmentTypes = [] ;
      this.serviceMultiselectLoader = true;
      get('service_list', { limit: 0, doctor_id: doctorId })
          .then((response) => {
            this.serviceMultiselectLoader = false;
            this.appointmentTypes = response.data.data ;
            if(this.appointmentTypes !== undefined && this.appointmentTypes.length != undefined && this.appointmentTypes.length > 0) {
              if(this.appointmentData.visit_type.length == 0) {
                this.appointmentData.visit_type.push(this.appointmentTypes[0]);
                if(this.appointmentTypes[0].multiple !== undefined && this.appointmentTypes[0].multiple == 'no'){
                  this.appointmentTypeMultiselect = false;
                }
              }
            }
          })
          .catch((error) => {
            this.serviceMultiselectLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);;
          })
    },
    multiUploadProfile:function (){
      this.disabledButton = false;
      let form_id = document.getElementById('appointmentDataForm')
      this.medicalReport = this.$refs.file_multi.files;
      let formData = new FormData(form_id);
      formData.append("appointment_file", this.medicalReport);
      post('upload_multiple_report', formData)
        .then((response) => {
          if(response.data.status !== undefined && response.data.status === true){
            if(response.data.data.length > 0) {
              this.disabledButton = true;
              displayMessage(response.data.message);
              this.appointmentData.file = response.data.data;
            }
          }else{
            this.disabledButton = true;
            this.appointmentData.file = [];
            displayErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          this.disabledButton = true;
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);;
        })
    },
    appointmentTypeChangeSelect(selected){
      if(selected.multiple !== undefined && selected.multiple !== '' && selected.multiple == 'no'){
        this.appointmentData.visit_type = [];
        setTimeout(()=>{
          this.appointmentData.visit_type = [];
          this.appointmentData.visit_type.push(selected)
        },500)
        this.appointmentTypeMultiselect =false;
      }else{
        this.appointmentTypeMultiselect = true;
      }
    },
    appointmentTypeChangeUnselect(selected){
      if(selected.multiple !== undefined && selected.multiple !== '' && selected.multiple == 'no'){
        this.appointmentTypeMultiselect =true;
      }
    },
    // appointmentEndTimeFormat: function (end){
    //   if(window.request_data !== undefined && window.request_data.appointment_time_format == 'on' ){
    //     if(typeof end != "undefined" && end != null && end !== '') {
    //       return  moment(end, ["h:mm A"]).format("HH:mm");
    //     }
    //   }
    //   return end;
    // },
    refreshWindows:function(){
      this.appointmentModel = false;
      if(this.appointmentSuccessModal === true){
         // window.location.reload();
      }
    }
  },
  computed: {
    doctorId() {
      return this.appointmentData.doctor_id !== undefined && this.appointmentData.doctor_id.id !== undefined ? this.appointmentData.doctor_id.id : 0;
    },
    patientId() {
      return this.user_id;
    },
    user() {
      return this.$store.state.user;
    },
    customFieldsData() {
      return (this.appointmentData.custom_fields ? this.appointmentData.custom_fields : []);
    },
    formTranslation: function () {
      return this.$store.state.langTranslateData ;
    },
    enableDisableAppointmentDescriptionStatus(){
      return window.request_data.description_status
    }
  },
  watch: {
    authModel(newVal) {
      if (newVal) {
        this.loading = false;
      }
      if (!newVal) {
        this.isRegistered = false;
      }
    },
    appointmentModel: function (newValue) {
      if (!newValue) {
        this.isAppointmentBooked = false;
      }
    }
  }
}
</script>
<style scoped>
.auth_image{
  height: 3rem;
  widows: 9rem;
}
</style>
