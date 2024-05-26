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
            <div class="col-6 p-2 pl-4 rtl-pr-4">
              <h3 class="text-primary ">{{formTranslation.common.filters}}</h3>
            </div>
            <div class="col-6 p-2 pl-4 rtl-pr-4">
                <div class="d-flex justify-content-end mr-3">
                  <button 
                    class="btn btn-sm btn-primary"
                    @click="filterOpenClose"
                    type="button">
                    <span v-if="!filterOpen">
                      <i class="fa fa-plus"></i>{{formTranslation.common.add_filter}}
                    </span>
                    <span v-else>
                      <i class="fa fa-minus"></i>{{formTranslation.common.close_filter}}
                    </span>
                  </button>
                </div>
              </div>
          </div>
        <b-collapse v-model="filterOpen">
          <div class="row ml-3 mr-3 mb-3 g-2 kc-row-gap"> 
            <div class="col-sm-12 col-md-6 col-lg-4">
                <label for="appointmentDate" class="form-control-label">
                  {{formTranslation.appointments.select_date}} <span class="text-danger"></span>
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
            <div v-if="userData.addOns.kiviPro == true && (getUserRole() == 'administrator' || getUserRole() == 'doctor')" class="col-sm-12 col-md-6 col-lg-4 kivi-pr">
              <div class="kivi-pr" >
                <label for="clinic_id" class="form-control-label">
                  {{formTranslation.appointments.select_clinic}} <span class="text-danger"></span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    :tag-placeholder="formTranslation.appointments.select_clinic"
                    id="clinic_id"
                    :placeholder="formTranslation.appointments.select_clinic"
                    @input="handleFilterChange('clinic')"
                    @remove="handleFilterChange('clinic')"
                    v-model="filterData.clinic_id"
                    label="label"
                    :loading="clinicMultiselectLoader"
                    :disabled="clinicMultiselectLoader"
                    track-by="id" :options="clinics"
                ></multi-select>
                <span class="appointment_select_clear_btn"  @click="handleResetFilter('clinic',filterData.clinic_id)">×</span>
              </div>
            </div>
            <div  v-if="getUserRole() != 'patient'" class="col-sm-12 col-md-6 col-lg-4 kivi-pr">
              <div class="kivi-pr" v-if="$route.params.patient_id === undefined && !patient_profile_id">
                <label for="patient_id" class="form-control-label">
                  {{formTranslation.appointments.select_patient}} <span class="text-danger"></span>
                </label>
                <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="filterData.patient_id"
                    @input="handleFilterChange"
                    @remove="handleFilterChange"
                    id="patient_id" 
                    :placeholder="formTranslation.appointments.tag_patient_plh"
                    :loading="patientMultiselectLoader"
                    :disabled="patientMultiselectLoader"
                    label="label" track-by="id" :options="patients"
                ></multi-select>
                <span class="appointment_select_clear_btn"  @click="handleResetFilter('patient_id',filterData.patient_id)">×</span>
              </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-4">
              <div class="kivi-pr">
                <label for="status" class="form-control-label">
                  {{formTranslation.appointments.select_status}}
                </label>
                <multi-select
                    v-model="filterData.status"
                    @input="handleFilterChange"
                    @remove="handleFilterChange"
                    deselect-label=""
                    select-label=""
                    :placeholder="formTranslation.appointments.select_status"
                    :tag-placeholder="formTranslation.appointments.select_status"
                    id="status"
                    label="label"
                    track-by="value"
                    :options="allStatus"
                ></multi-select>
                <span class="appointment_select_clear_btn"  @click="handleResetFilter('status',filterData.status)">×</span>
              </div>
            </div>
            <div v-if="getUserRole() !== 'doctor'" class="col-sm-12 col-md-6 col-lg-4">
              <div class="kivi-pr">
                <label for="doctors" class="form-control-label">
                  {{formTranslation.patient_encounter.tag_select_doctor}}
                </label>
                <multi-select
                    v-model="filterData.doctor_id"
                    @input="handleFilterChange"
                    @remove="handleFilterChange"
                    deselect-label=""
                    select-label=""
                    :placeholder="formTranslation.patient_encounter.tag_select_doctor"
                    :tag-placeholder="formTranslation.patient_encounter.tag_select_doctor"
                    id="doctors"
                    label="label"
                    track-by="id"
                    :loading="doctorMultiselectLoader"
                    :disabled="doctorMultiselectLoader"
                    :options="doctors"
                ></multi-select>
                <span class="appointment_select_clear_btn"  @click="handleResetFilter('doctor',filterData.doctor_id)">×</span>
              </div>
            </div>
          </div>
        </b-collapse>
        </div>
        <module-data-import v-if="userData.addOns.kiviPro && kcCheckPermission('appointment_add') 
        && kivicareCompareVersion(requireProVersion,userData.pro_version)" ref="module_data_import"
                            :required_data="[
                              {label:formTranslation.common.lbl_date_validation,value:'date'},
                              {label:formTranslation.doctor_session.plh_start_time,value:'start_time'},
                              {label:formTranslation.doctor_session.plh_end_time,value:'end_time'},
                              {label:formTranslation.common.service,value:'service'},
                              {label:formTranslation.clinic.clinic_name,value:'clinic_name'},
                              {label:formTranslation.doctor.doctor_name,value:'doctor_name'},
                              {label:formTranslation.patient.patient_name,value:'patient_name'},
                              {label:formTranslation.common.status,value:'status'},
                            ]" :module_name="formTranslation.appointments.appointments" module_type="appointment"></module-data-import>

        <div class="card shadow">
          <div class="card-header">
            <div class="row">
              <div class="col-md-4 rmb-15">
                <h3 class="text-primary ">{{formTranslation.appointments.appointment}}</h3>
                  <span 
                    class="badge mr-2  cursor-pointer" v-for="(status, index) in status"
                    :class="(filterData.status !== undefined && filterData.status === status.value ? 'badge-primary p-2 ' : 'badge-outline-primary')"
                    :style="(filterData.status !== undefined && filterData.status === status.value ? 'font-size: 0.8rem;' : '')"
                    @click="handleStatusChange(status.value)"
                    :key="index">{{ status.label }}
                  </span>
              </div>
              <div class="col-md-8">
                <div class="d-flex justify-content-end align-items-center">
                  <button
                    v-if="(filterData.status == 'past' || filterData.status == 'all') && enableMultiBtnDelete == true && appointmentList != ''"
                    class="btn btn-sm btn-danger"
                    @click="deleteSelected()" 
                    type="button"
                    v-html="deleteSelectedBtnText"
                    >

                  </button>
                  <button 
                    v-if="(filterData.status == 'past' || filterData.status == 'all') && appointmentList != '' && kcCheckPermission('appointment_delete')"
                    class="btn btn-sm btn-danger"
                    @click="deleteMultiple()" 
                    type="button" 
                    v-html="deleteBtnEnableText">
                  </button>
                  <button 
                    class="btn btn-sm btn-primary" 
                    v-if="addAppointmentButton && kcCheckPermission('appointment_add')" @click="handleAppointmentForm({})"
                    type="button" v-html="appBtnText">
                  </button>
                  <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion,userData.pro_version) && getUserRole() !== 'patient'" class="float-right btn btn-sm btn-primary rtl-left"  @click="$refs.module_data_import.openModel = true" >
                    <i class="fas fa-file-import"></i>{{formTranslation.common.import_data}}
                  </button>
                  <module-data-export :module_data="csvAppointmentData" :module_name="formTranslation.appointments.appointments"  module_type="appointment" v-if="kcCheckPermission('appointment_export')"> </module-data-export>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <b-collapse id="appointmentForm" :visible="showAppointmentForm && appointmentFormObj.id === undefined">
                  <AppointmentForm :patient_profile_id="patient_profile_id" v-if="appointmentFormObj.id === undefined"  :appointmentData="appointmentFormObj" @appointmentSaved="handleAppointmentSave" @closeAppointmentForm="closeAppointmentForm" />
                </b-collapse>
              </div>
            </div>
            <AppointmentCard
                :appointment-data="appointmentList"  
                :appointmentDate="filterData.date"
                :filter_status ="filterData.status"
                :enable_delete_multiple="enableMultiDelete"
                :delete_multiple_appointment="deleteMultipleAppointment"
                @enabledDeleteBtn="deleteBtnEnabled"
                @reloadAppointment="handleFilterChange"
                @reloadMultipleDeleteAppointment="handleMultipleAppointmentChange"
                @closeFilterForm="closeFilterForm"
                @updateAppointmentList="updateAppointmentList"
                :isLoading="isLoading"
                :patient_profile_id="patient_profile_id"
                ref="appointmentCardRef"
                @disableMultiDeleteButton="deleteMultipleAppointment=false"
            />
          </div>
        </div>
      </div>
    </div>
    <b-row class="justify-content-end">
      <b-col md="6" class="my-1 mr-2">
        <b-pagination
            v-model="currentPage"
            :total-rows="appointmentTotalRows"
            :per-page="perPage"
            size="lg"
            first-number
            last-number
            :next-text="formTranslation.datatable.next_text"
            :prev-text="formTranslation.datatable.prev_text"
            class="my-0 justify-content-end flex-wrap kivicare-pagination"
        ></b-pagination>
      </b-col>
    </b-row>
  </div>
</template>
<script>

import AppointmentCard from "../../components/appointment/AppointmentCard";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import {get, post} from "../../config/request";

export default {
  props:{
    patient_profile_id: {
      type :[Number,String],
      default(){
        return ''
      }
    }
  },
  components: {AppointmentCard, AppointmentForm},
  data: () => {
    return {
      filterOpen:false,
      temp: null,
      page:0,
      enableMultiDelete: false,
      enableMultiBtnDelete: false,
      deleteMultipleAppointment:false,
      enableDel:false,
      deleteBtnEnableText:'',
      filterData: {
        start: new Date(),
        end: null,
        status: null
      },
      perPage:10,
      currentPage:1,
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
        {label:"all", value:'all'},
        {label: "upcoming", value: "1"},
        {label: "completed", value: "3"},
        {label: "cancelled", value: "0"},
        {label: "checkin", value: "4"},
        {label: "pending", value: "2"},
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
      doctors:[],
      patients:[],
      csvAppointmentData:[],
      csvLoader:true,
      paginationAppointmentCondition:{},
      minDate:new Date(),
      maxDate:new Date(Date.now() + 1000 * 60 * 60 * 24 * 1000),
      clinicMultiselectLoader:true,
      doctorMultiselectLoader:true,
      patientMultiselectLoader:true,
      firstTimeFilterEnable:0,
      deleteSelectedBtnText:''
    }
  },
  mounted() {
    if(this.formTranslation.appointments !== undefined) {
      this.appBtnText = '<i class="fa fa-plus"></i>' + this.formTranslation.appointments.add_appointment_btn ;
      this.deleteBtnEnableText = '<i class="fa fa-trash" style="padding: 5px;"></i> ' +  this.formTranslation.appointments.enableDelete ;
      // this.deleteSelectedBtnText = '<i class="fa fa-trash"></i> ';
      this.deleteSelectedBtnText = '<i class="fa fa-trash" style="padding: 5px;"></i> ' + this.formTranslation.appointments.deleteSelectedAppointment ;
    }

    this.allStatus = this.allStatus.map( (item) => {
      if(item.label === 'pending'){
        item.label = this.formTranslation.appointments[item.label];
      }else{
        item.label = this.formTranslation.common[item.label];
      }
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
    this.status[2].label = this.formTranslation.appointments.past ;

  },
  methods: {
    init: function () {
      this.checkIfClinicHaveSession();
      this.filterData = this.defaultFilterData();
      if(this.userData.addOns.kiviPro !== true){
        this.$store.dispatch("userDataModule/fetchUserForDropdown", {userRoleName: this.patientRoleName})
      }
      let filterData = Object.assign({}, this.filterData);
      filterData.date = moment(this.filterData.date).format('YYYY-MM-DD');
       if (this.getUserRole() === 'patient') {
         filterData.patient_id = this.userData.ID ;
       }
      if (this.getUserRole() === 'doctor') {
        filterData.doctor_id = this.userData.ID ;
      }
      filterData.pagination =this.currentPage;
      this.paginationAppointmentCondition.filterData = filterData;
      this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: filterData})
      if (window.matchMedia('(max-width: 768px)').matches) {
        $('.kivicare-pagination').removeClass('pagination-lg');
        $('.kivicare-pagination').addClass('pagination-sm');
        $('.kivicare-pagination li span').addClass('font-size-10');
      } else {
        $('#kivicare-pagination').addClass('pagination-lg');
        $('#kivicare-pagination').removeClass('pagination-sm');
        $('.kivicare-pagination li span').removeClass('font-size-10');
      }
    },
    updateAppointmentList(data){
      this.csvAppointmentData = this.formatJsonAppointmentData(data)
      this.csvLoader = false;
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
      let patient_id = '';
      if(this.$route.params.patient_id !== undefined){
        patient_id = this.$route.params.patient_id
      }else if(this.patient_profile_id){
        patient_id = this.patient_profile_id
      }
      return {
        date: new Date(),
        patient_id: {
          id:patient_id
        },
        status: 1,
        // appointmentType: "",
        clinic_id:{
          id:'',
          label: ''
        },
        doctor_id:''
      }
    },
    filterOpenClose(){
      this.firstTimeFilterEnable++;
      this.filterOpen = !this.filterOpen
      if(this.firstTimeFilterEnable === 1){
        if (this.getUserRole() !== 'patient') {
          this.getClinicPatients('')
        }
        if (this.getUserRole() !== 'doctor') {
          this.doctorListDropDown('')
        }
      }
    },
    closeFilterForm(){
      this.filterOpen = false;
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
        }if(remove_filter_id == 'clinic'){
          this.filterData.clinic_id = {
            id:0
          }
          this.handleFilterChange();
        }if(remove_filter_id == 'doctor'){
          this.filterData.doctor_id = ''
          this.handleFilterChange();
        }
      }
      this.$store.commit('appointmentModule/RESET_TIME_SLOT');
      this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
    },
    handleFilterChange: function (type='') {
      let select_clinic_id = this.filterData.clinic_id != null ? this.filterData.clinic_id.id : '';
      if(type == 'clinic'){
        if (this.getUserRole() !== 'patient') {
          this.getClinicPatients(select_clinic_id)
        }
        if (this.getUserRole() !== 'doctor'){
          this.doctorListDropDown(select_clinic_id)
        }
      }
      this.isLoading = true
      let filterData = '';
      filterData = Object.assign({}, this.filterData);
      if(filterData.date != '' && filterData.date != null){
        filterData.date.end = moment(this.filterData.date.end).format('YYYY-MM-DD');
        filterData.date.start = moment(this.filterData.date.start).format('YYYY-MM-DD');
      }else{
        filterData.date = ''
      }
      if(filterData.status === 1){
        filterData.date = moment(new Date()).format('YYYY-MM-DD');
      }
      this.appointmentFormObj.patient_id = filterData.patient_id;
      this.appointmentFormObj.status = filterData.status;
      this.appointmentFormObj.clinic_id = filterData.clinic_id;
      this.appointmentFormObj.doctor_id = filterData.doctor_id;
      this.currentPage = 1;
      filterData.pagination =this.currentPage;
      this.paginationAppointmentCondition.filterData = filterData;
      // let end_date =  moment(filterData.date.end).format('YYYY-MM-DD');
      // let start_date = moment(filterData.date.start).format('YYYY-MM-DD');
      // this.filterData.date = Object({
      //   start:start_date,
      //   end: end_date
      // })
      // this.paginationAppointmentCondition.filterData.start_date =  start_date;
      // this.paginationAppointmentCondition.filterData.start_date =  end_date;
      // this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: filterData, start:start_date,end:end_date})
      this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: filterData})
    },
    closeAppointmentForm(){
      this.$store.commit('TOGGLE_APPOINTMENT_FORM', false);
    },
    handleStatusChange: function (status) {
      this.csvLoader = true;
      this.enableMultiDelete = false
      this.deleteMultipleAppointment = false
      this.deleteBtnEnableText = '<i class="fa fa-trash" style="padding: 5px;"></i> ' + this.formTranslation.appointments.enableDelete ;
      this.$store.commit('TOGGLE_APPOINTMENT_FORM', false)
      this.isLoading = true
      switch (status){
        case 'all':
          this.minDate = new Date(Date.now() - (1000 * 60 * 60 * 24 * 10000));
          this.maxDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 10000));
          break;
        case 'past':
          this.minDate = new Date(Date.now() - (1000 * 60 * 60 * 24 * 10000));
          this.maxDate = new Date();
          break;
        case '1':
          this.minDate = new Date();
          this.maxDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * 10000));
          break;
      }
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
          if(this.getUserRole() !== 'doctor'){
            formObj.clinic_id = {
              id: this.clinic.id,
              label: this.clinic.name
            }
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
      // this.handleFilterChange();
    },
    handleDateChange: function (event) {
      this.$store.commit('appointmentModule/RESET_TIME_SLOT');
      if (this.filterData.date != null) {
        let filterData = Object.assign({}, this.filterData);
        if (moment(filterData.date).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {

          filterData.status = "all";
        } else {
          // filterData.status = "-1";
        }

        if (this.appointmentFormObj.doctor_id !== undefined && this.appointmentFormObj.doctor_id.id !== undefined) {
          this.getTimeSlot({
            date:  moment(filterData.date).format('YYYY-MM-DD'),
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
        this.currentPage = 1;
        filterData.pagination =this.currentPage;
        this.paginationAppointmentCondition.filterData =  filterData;
        this.paginationAppointmentCondition.filterData.start_date =  start_date;
        this.paginationAppointmentCondition.filterData.start_date =  end_date;
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
    },
    deleteMultiple(){
      if(this.enableMultiDelete == false){
        this.enableMultiDelete = true
        this.deleteMultipleAppointment = false
        this.deleteBtnEnableText = '<i class="fa fa-trash" style="padding: 5px;"></i> ' + this.formTranslation.appointments.disableDelete ;
        this.enableMultiBtnDelete = false
      }else{
        this.enableMultiDelete = false
        this.deleteMultipleAppointment = false
        this.deleteBtnEnableText = '<i class="fa fa-trash" style="padding: 5px;"></i> ' + this.formTranslation.appointments.enableDelete ;
        this.enableMultiBtnDelete = false       
      }
    },
    deleteSelected(){
      this.deleteMultipleAppointment = true
    },
    handleMultipleAppointmentChange(){
      this.deleteMultiple()
      this.handleFilterChange()
    },
    deleteBtnEnabled(e){
      if(e != ''){
        this.enableMultiBtnDelete = true
      }else{
        this.enableMultiBtnDelete = false
      }
    },
    doctorListDropDown(clinic_id){
      this.doctorMultiselectLoader = true;
      get('get_static_data', {
        data_type: 'clinic_doctors',
        clinic_id: clinic_id,
        module_type:'appointment_filter'
      })
          .then((response) => {
            this.doctorMultiselectLoader = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.doctors = response.data.data;
            } else {
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            this.doctorMultiselectLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
    },
    getClinicPatients(clinic_id){
      this.patientMultiselectLoader = true;
      get('get_static_data', {
        data_type: 'users',
        user_type: this.patientRoleName,
        request_clinic_id:clinic_id
      })
          .then((response) => {
            this.patientMultiselectLoader = false;
            if (response.data.status !== undefined && response.data.status === true) {
              this.patients = response.data.data;
            }
          })
          .catch((error) => {
            this.patientMultiselectLoader = false;
            console.log(error);
            displayErrorMessage('Internal server error');
          })
    }
  },
  computed: {
    appointmentList() {
      if(this.$store.state.appointmentModule.appointmentList){
        return this.$store.state.appointmentModule.appointmentList;
      }else{
        return '';
      }
    },
    appointmentTotalRows() {
      if(this.$store.state.appointmentModule.totalrows){
        return this.$store.state.appointmentModule.totalrows;
      }else{
        return 0;
      }
    },
    clinic() {
      return this.$store.state.userDataModule.clinic;
    },
    clinics() {
      this.clinicMultiselectLoader=false;
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
      }
    },
    showAppointmentForm(newValue) {
      if (!newValue) {
        this.appBtnText = '<i class="fa fa-plus"></i>' + this.formTranslation.appointments.add_appointment_btn ;
      } else {
        this.appBtnText = '<i class="fa fa-minus"></i>' + this.formTranslation.appointments.close_form_btn ;
      }
    },
    currentPage:function(newVal,oldVal){
      if(newVal !== oldVal){
        this.$refs.appointmentCardRef.isLoading = true;
        this.paginationAppointmentCondition.filterData.pagination = newVal;
        if(this.paginationAppointmentCondition.start_date !== undefined && this.paginationAppointmentCondition.start_date != ''){
          this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData:this.paginationAppointmentCondition.filterData,start:this.paginationAppointmentCondition.start_date,end:this.paginationAppointmentCondition.end_date})
        }else{
          this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData:this.paginationAppointmentCondition.filterData})
        }
      }
    },
    filterOpen: function(newValue, oldValue) {
      let end_date =  (this.filterData.date?.end !== undefined && this.filterData.date?.end !== null) ? moment(this.filterData.date.end).format('YYYY-MM-DD') : null;
      let start_date =  (this.filterData.date?.start !== undefined && this.filterData.date?.start !== null) ? moment(this.filterData.date.start).format('YYYY-MM-DD') : null;

      if(newValue == true){
        this.filterData.date = Object({
          start:start_date,
          end: end_date
        })
        this.paginationAppointmentCondition.filterData.start_date =  start_date;
        this.paginationAppointmentCondition.filterData.start_date =  end_date;
        this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: this.filterData, start:start_date,end:end_date});
      }else{
        this.filterData.date = Object({
          start:start_date,
          end: end_date
        })
        this.paginationAppointmentCondition.filterData.start_date =  null;
        this.paginationAppointmentCondition.filterData.start_date =  null;
        this.$store.dispatch("appointmentModule/fetchAppointmentData", {filterData: this.filterData});
      }

    }
    // filterData: {
    //     handler: function() {
    //       if(this.filterData.status == 'past'){
    //         setTimeout(()=>{
    //           this.enableDel = true
    //         },200)
    //       }else{
    //         this.enableDel = false
    //       }
    //     },
    //     deep: true
    // }
  }
}
</script>
<style>
.kivicare-pagination  .page-item.active button{
  border-color:var(--primary) !important;
  background-color:var(--primary)!important;
}
.kivicare-pagination .page-link{
  border-color: var(--primary)!important;
}
.font-size-10 {
  font-size :10px !important;
}
.kc-row-gap{
  row-gap: 1em;
}
</style>