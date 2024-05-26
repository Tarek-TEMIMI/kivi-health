<template>
  <div>
    <div class="row" v-if="getUserRole() == 'administrator' && clinicSessionNotice.status" >
      <div class="col-md-12">
        <b-alert show variant="warning" class="d-flex align-items-center justify-content-between">
          <p class="m-0"> <b> {{clinicSessionNotice.msg}}</b> </p>
          <router-link v-if="kcCheckPermission('doctor_session_list')" class="btn btn-sm btn-primary float-right text-white" :to="{ name: 'doctor-session.create'}"> <i class="fa fa-plus"></i> {{formTranslation.common.add_session}}</router-link>
          <!-- <button class="btn btn-sm  btn-secondary float-right" @click="iUnderstandLocoTranslation" type="button"> Got it ! </button> -->
        </b-alert>
      </div>
    </div>
    <div class="row" id="appointment-module">
      <div class="col-md-12 col-lg-12 col-xl-12" v-if="formTranslation.appointments !== undefined && formTranslation.appointments.add_appointment_btn !== undefined">
        <div class="card">
          <div class="row mt-2">
            <div class="col-md-12 p-2 pl-4 rtl-pr-4">
              <h3 class="text-primary ">{{formTranslation.common.filters}}</h3>
            </div>
          </div>
          <div class="row ml-3 mr-3 mb-3"> 
            <div class="col-md-3">
                <label for="appointmentDate" class="form-control-label">
                  {{formTranslation.appointments.select_date}} <span class="text-danger">*</span>
                </label>
                <vc-date-picker
                  id="appointmentDate"
                  title-position="left"
                  v-model="filterData.date"
                  @input="handleDateChange($event)"
                  @popover-did-disappear="disapperaed(filterData.date)"
                  :popover="{ visibility: 'click' }"
                  :model-config="modelConfig"
                  is-expanded
                  mode='range'
                >
                <template v-slot="{ inputValue}">
                  <div class="flex flex-col sm:flex-row justify-start items-center">
                    <div class="position-relative flex-grow">
                      <input
                        :value="inputValue"
                        :available-dates='filterData.date'
                        class="form-control"
                        :placeholder="formTranslation.appointments.plh_date"
                      />
                      <span class="datepicker_clear_btn" @click="handleResetFilter('date',filterData.date)">×</span>
                    </div>
                  </div>
                </template>
              </vc-date-picker>
            </div>
            <div  v-if="getUserRole() != 'patient'" class="col-md-3 kivi-pr">
              <div class="kivi-pr">
                <label for="patient_id" class="form-control-label">
                  {{formTranslation.appointments.select_patient}} <span class="text-danger">*</span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="filterData.patient_id"
                    @input="handleFilterChange"
                    @remove="handleFilterChange"
                    id="patient_id" 
                    :placeholder="formTranslation.appointments.tag_patient_plh"
                    label="label" track-by="id" :options="patients"
                ></multi-select>
                <span class="appointment_select_clear_btn"  @click="handleResetFilter('patient_id',filterData.patient_id)">×</span>
              </div>
            </div>
            <div class="col-md-3">
              <div class="kivi-pr">
                <label for="status" class="form-control-label">
                  {{formTranslation.appointments.select_status}} <span class="text-danger">*</span>
                </label>
                <multi-select 
                  v-model="filterData.status"
                  @input="handleFilterChange"
                  @remove="handleFilterChange"
                  deselect-label=""
                  select-label=""
                  :placeholder="formTranslation.appointments.plh_status"
                  :tag-placeholder="formTranslation.appointments.plh_status" 
                  id="status" 
                  label="label" 
                  track-by="value" 
                  :options="allStatus"
                ></multi-select>
                <span class="appointment_select_clear_btn"  @click="handleResetFilter('status',filterData.status)">×</span>
              </div>
            </div>
            <div v-if="userData.addOns.kiviPro == true && getUserRole() == 'administrator'" class="col-md-3" >
              <div class="form-group" >
                <label for="clinic_id" class="form-control-label">
                  {{formTranslation.appointments.select_clinic}} <span class="text-danger">*</span>
                </label>
                <multi-select
                  deselect-label=""
                  select-label=""
                  :tag-placeholder="formTranslation.appointments.select_clinic_plh" 
                  id="clinic_id"
                  :placeholder="formTranslation.appointments.search_plh"
                  @input="handleFilterChange"
                  @remove="handleFilterChange"
                  v-model="filterData.clinic_id"
                  label="label"
                  track-by="id" :options="clinics"
                ></multi-select>
              </div>
            </div>
          </div>
        </div>
        <div class="card shadow">
          <div class="card-header">
            <div class="row">
              <div class="col-md-9 rmb-15">
                <h3 class="text-primary ">{{formTranslation.appointments.appointment}}</h3>
                  <span 
                    class="badge mr-2  cursor-pointer" v-for="(status, index) in status"
                    :class="(filterData.status !== undefined && filterData.status === status.value ? 'badge-primary ' : 'badge-outline-primary')"
                    @click="handleStatusChange(status.value)"
                    :key="index">{{ status.label }}
                  </span>
              </div>
              <div class="col-md-3">
                <div class="d-flex justify-content-end">
                  <button 
                    class="btn btn-sm btn-primary" 
                    v-if="addAppointmentButton" @click="handleAppointmentForm({})"
                    type="button" v-html="appBtnText">
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <b-collapse id="appointmentForm" :visible="showAppointmentForm && appointmentFormObj.id === undefined">
                  <AppointmentForm :appointmentData="appointmentFormObj" @appointmentSaved="handleAppointmentSave" @closeAppointmentForm="closeAppointmentForm" />
                </b-collapse>
              </div>
            </div>
            <AppointmentCard
                :appointment-data="paginatedAppointmentList"  :appointmentDate="filterData.date"
                @reloadAppointment="handleFilterChange" :isLoading="isLoading"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import AppointmentCard from "../../components/appointment/AppointmentCard";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import {get, post} from "../../config/request";

export default {
  components: {AppointmentCard, AppointmentForm},
  data: () => {
    return {
      temp: null,
      page:0,
      filterData: {
        start: new Date(),
        end: null,
        status: null,
        limit: 2,
        offset: 0
      },
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD', // Uses 'iso' if missing
      },
      appointmentFormObj: {
        visit_type: []
      },
      appBtnText: '',
      latestButton: true,
      addAppointmentButton: true,
      allStatus: [
        {label: "upcoming", value: "1"},
        {label: "completed", value: "3"},
        {label: "cancelled", value: "0"},
        {label: "checkin", value: "4"},
      ],
      status: [
        {label: '', value: "all"},
        {label: '', value: 1},
        {label: '', value: "past"},
      ],
      selectedDate: null,
      currentDate: null,
      appointmentTypes:[],
      bottom: false,
      isLoading: false,
      clinicSessionNotice:{
        status:false,
        msg:''
      },
      paginatedAppointmentList: []
    }
  },
  mounted() {

    window.scrollTo(0,document.body.scrollHeight);
    
    if(this.formTranslation.appointments !== undefined) {
      this.appBtnText = '<i class="fa fa-plus"></i>' + this.formTranslation.appointments.add_appointment_btn ;
    }

    this.allStatus = this.allStatus.map( (item) => {
      item.label = this.formTranslation.common[item.label];
      return item;
    })

    setTimeout(()=>{
      this.appointmentTypes = this.$store.state.staticDataModule.static_data.appointment_types;
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible()
      });
    },1000)

    this.$store.commit('TOGGLE_APPOINTMENT_FORM', false);
    this.init();
    this.status[0].label = this.formTranslation.appointments.all ;
    this.status[1].label = this.formTranslation.appointments.upcoming ;
    this.status[2].label = "Past" ;

  },
  methods: {
    init: function () {
      this.checkIfClinicHaveSession();
      this.filterData = this.defaultFilterData();
      this.$store.dispatch("userDataModule/fetchUserForDropdown", {userRoleName: this.patientRoleName})
      let filterData = Object.assign({}, this.filterData);
      filterData.date = moment(this.filterData.date).format('YYYY-MM-DD');
       if (this.getUserRole() === 'patient') {
         filterData.patient_id = this.userData.ID ;
       }
      filterData.limit = 2 ;
      filterData.offset = 0 ;
      this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: filterData})
      // this.$store.dispatch("staticDataModule/fetchStaticData", {
      //   type: "static_data_with_label",
      //   static_data_type: "appointment_types"
      // });
    },
    defaultAppointmentData: function () {
      return {
        appointment_start_date: new Date(),
        appointment_end_date: this.filterData.end_date,
        appointment_start_time: '',
        patient_id:{},
        doctor_id: {},
        clinic_id: {},
        visit_type: [],
        description: '',
        status: "",
        service_id:{},
        custom_fields:{}
      }
    },
    defaultFilterData: function () {
      return {
        date: new Date(),
        patient_id: '',
        status: 1,
        appointmentType: "",
        clinic_id:{
          id:0,
          label: ''
        },
      }
    },
    handleResetFilter: function (remove_filter_id,currentValue) {
      if(currentValue!= null && currentValue!='' && currentValue!=1){
        if(remove_filter_id == 'date'){
            this.filterData.date = ''
            this.handleFilterChange();
        }if(remove_filter_id == 'patient_id'){
            this.filterData.patient_id = ''
            this.handleFilterChange();
        }if(remove_filter_id == 'status'){
            this.filterData.status = ''
            this.handleFilterChange();
        }
      }
      this.$store.commit('appointmentModule/RESET_TIME_SLOT');
      this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
    },
    handleFilterChange: function () {
      this.isLoading = true
      let filterData = Object.assign({}, this.filterData);
      if(filterData.date != '' && filterData.date != null){
        filterData.date = moment(this.filterData.date).format('YYYY-MM-DD');
      }else{
        filterData.date = ''
      }
      filterData.patient_id = this.filterData.patient_id;
      filterData.status = this.filterData.status;
      this.appointmentFormObj.patient_id = filterData.patient_id;
      this.appointmentFormObj.status = filterData.status;
      filterData.limit = 2 ;
      filterData.offset = 0 ;
      this.filterData.limit = 2 ;
      this.filterData.offset =  0 ; 
      this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: filterData})
    },
    closeAppointmentForm(){
      this.$store.commit('TOGGLE_APPOINTMENT_FORM', false);
    },
    handleStatusChange: function (status) {
      this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
      this.isLoading = true
      if(status == 1) {
        this.filterData.date = new Date();
      }
      this.filterData.status = status;
      this.handleFilterChange();
    },
    getTimeSlot: function (data) {
      this.$store.dispatch("appointmentModule/fetchAppointmentSlots", data)
    },
    handleAppointmentForm: function (appointment) {
      if (!this.showAppointmentForm) {
        this.appBtnText = '<i class="fa fa-minus"></i>' + this.formTranslation.appointments.close_form_btn;
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
              id: this.userData.ID,
              label: this.userData.display_name,
              timeSlot: this.userData.timeSlot,
              enableTeleMed: this.userData.enableTeleMed
            }
          } else if (this.getUserRole() === 'patient') {
            formObj.patient_id = {
              id: this.userData.ID,
              label: this.userData.display_name
            }
          } else {
            formObj.doctor_id = {}
          }

          formObj.appointment_start_date =  new Date() ;

          this.appointmentFormObj = formObj;
        } else {
          this.appointmentFormObj = appointment;
        }
      } else {
        this.appBtnText = '<i class="fa fa-plus"></i>' + this.formTranslation.appointments.add_appointment_btn ;
        this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
      }
    },
    handleAppointmentSave: function () {
      this.$store.commit('TOGGLE_APPOINTMENT_FORM', false);
      this.handleStatusChange(1)
      this.handleFilterChange();
    },
    handleDateChange: function (event) {
      this.$store.commit('appointmentModule/RESET_TIME_SLOT');
      if (this.filterData.date != null) {
        let filterData = Object.assign({}, this.filterData);
        filterData.limit = 2;
        filterData.offset = 2;
        if (moment(filterData.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
          filterData.status = "all";
        } else {
          filterData.status = "-1";
        }

        if (this.appointmentFormObj.doctor_id !== undefined && this.appointmentFormObj.doctor_id.id !== undefined) {
          this.getTimeSlot({
            date: filterData.date,
            appointment_id: this.appointmentFormObj.id !== undefined ? this.appointmentFormObj.id : "",
            clinic_id: this.appointmentFormObj.clinic_id.id,
            doctor_id: this.appointmentFormObj.doctor_id.id,
            patient_id: this.appointmentFormObj.patient_id.id,
          })

        } else {
          this.$store.commit('appointmentModule/RESET_TIME_SLOT');
        }

        let end_date =  moment(event.end).format('YYYY-MM-DD');
        let start_date = moment(event.start).format('YYYY-MM-DD');

        this.filterData.date = Object({
          start:start_date,
          end: end_date
        })

        this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: filterData,start:start_date,end:end_date});
        this.filterData.date.start = new Date(this.filterData.date.start + ' 00:00');
        this.filterData.date.end = new Date(this.filterData.date.end + ' 00:00');

      }

    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight;
      return bottomOfPage || pageHeight < visible;
    },
    checkIfClinicHaveSession:function (){
      this.clinicSessionNotice.status = window.request_data.allClinicHaveSession.status
      this.clinicSessionNotice.msg = window.request_data.allClinicHaveSession.message;
    }
  },
  computed: {
    patients() {
      return this.$store.state.userDataModule.userDropDownData.patients
    },
    appointmentList() {
      return this.$store.state.appointmentModule.appointmentList
    },
    clinic() {
      return this.$store.state.userDataModule.clinic;
    },
    clinics() {
      return this.$store.state.clinic
    },
    userData() {
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
    // formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // }
  },
  watch: {
    appointmentList(value) {
      if(typeof value == 'object') {
        Array.from(value).forEach(appointment => {
          // setTimeout(() => {
            this.paginatedAppointmentList.push(appointment);
          // }, 200);
        })
      }
    },
    date(newVal) {
      if (moment(newVal).isAfter(moment()) || moment(newVal).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        this.addAppointmentButton = true
      } else {
        this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
        this.addAppointmentButton = false
      }
    },
    bottom(bottom) {
      if (bottom) {
        // this.init();
        this.filterData.limit = 2 ;
        this.filterData.offset = this.filterData.limit + this.filterData.offset ;
        this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: this.filterData})
      }
    },
    showAppointmentForm(newValue) {
      if (!newValue) {
        this.appBtnText = '<i class="fa fa-plus"></i>' + this.formTranslation.appointments.add_appointment_btn ;
      } else {
        this.appBtnText = '<i class="fa fa-minus"></i>' + this.formTranslation.appointments.close_form_btn ;
      }
    },
  }
}
</script>
