<template>
  <b-row>
    <b-col sm="12">
      <form id="serviceForm" @submit.prevent="handleSubmit" :novalidate="true" enctype="multipart/form-data">
        <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
          <div class="row">
            <div class="col-md-9">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="type" class="form-control-label">
                      {{formTranslation.service.service_category}} <span class="text-danger">*</span>
                    </label>
                    <multi-select
                      v-model="service.type"
                      deselect-label=""
                      select-label=""
                      :class="{ ' is-invalid': submitted && $v.service.type.$error }"
                      :tag-placeholder="formTranslation.service.tag_select_service_plh" id="type"
                      :placeholder="formTranslation.service.select_service_plh"
                      label="label"
                      track-by="id"
                      :taggable="true"
                      @tag="addNewServiceCategory"
                      :options="types"
                      :loading="categoryMultiselectLoader && isServiceEdit"
                      :disabled="!isServiceEdit"
                    ></multi-select>
                    <span class="text-primary small font-weight-bold">{{formTranslation.service.note_category}}</span>
                    <div v-if="submitted && !$v.service.type.required" class="invalid-feedback"> {{formTranslation.service.service_category_required}} </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="name" class="form-control-label"> {{formTranslation.service.service_name}} <span class="text-danger">*</span></label>
                    <input
                        id="name"
                      :class="{ ' is-invalid': submitted && $v.service.name.$error }"
                      v-model="service.name"
                      :placeholder="formTranslation.service.service_name_plh"
                      required="required" name="name" type="text" class="form-control">
                    <div v-if="submitted && !$v.service.name.required"
                        class="invalid-feedback">{{formTranslation.service.service_name_required}}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="price" class="form-control-label">{{formTranslation.service.charges}} <span
                        class="text-danger">*</span></label>
                        <b-input-group size="md" :prepend="currencyPrefix" :append="currencyPostfix">
                          <b-form-input
                          id="price"
                          :class="{ ' is-invalid': submitted && $v.service.price.$error }"
                          v-model="service.price" 
                          :placeholder="formTranslation.service.charges_plh"
                          required="required" name="price" type="number"
                            min="0"
                          max="100000000000"
                          oninput="validity.valid||(value='');"></b-form-input>
                        </b-input-group>
                    <div v-if="submitted && !$v.service.price.required"
                        class="invalid-feedback">{{formTranslation.service.service_charges_required}}
                    </div>
                    <div v-else-if="submitted && (!$v.service.price.minValue || !$v.service.price.maxValue)"
                        class="invalid-feedback">{{formTranslation.service.service_charge_length}}
                    </div>
                  </div>
                </div>                
                <div class="col-md-4" v-if="userData.addOns.telemed || userData.addOns.googlemeet">
                  <div class="form-group ">
                    <label for="telemed_service" class="form-control-label">
                      {{formTranslation.service.is_telemed_service}} <span class="text-danger">*</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          v-model="service.telemed_service"
                          :tag-placeholder="formTranslation.service.telemed_service"
                          id="status"
                          name="telemed_service"
                          :placeholder="formTranslation.service.telemed_service"
                          :options="['yes','no']"
                          @select="telemedEnableChange"
                          :disabled= "getUserRole() == 'doctor' && (!userData.telemedConfigOn && userData.is_enable_doctor_zoom_telemed == 'off')"
                      ></multi-select>
                      <span class="select_clear_btn"  @click="service.telemed_service = ''">×</span>
                    </div>
                    <div v-if="submitted && !$v.service.telemed_service.required"
                        class="invalid-feedback">{{formTranslation.service.telemed_service_required}}
                    </div>
                    <span v-if="getUserRole() == 'doctor' && (!userData.telemedConfigOn && userData.is_enable_doctor_zoom_telemed == 'off')" class="text-primary small font-weight-bold">{{formTranslation.service.note_telemed}}</span>
                    <div v-if="submitted && !$v.service.status.required" class="invalid-feedback">
                      {{formTranslation.appointments.status_required}}
                    </div>
                  </div>
                </div>

                <div  v-if="(userData.addOns.kiviPro == true && (getUserRole() == 'administrator' || getUserRole() == 'doctor'))" class="col-md-4">
                        <div class="form-group" >
                          <div class="select-all-doctor d-flex" >
                            <div class="doctor-select-all-2" style="width: 100%">
                              <label for="doctor_id" class="form-control-label">
                                {{formTranslation.clinic.clinic}} <span class="text-danger">*</span>
                              </label>
                              <b-form-checkbox
                                  v-if="(serviceId == 0 || serviceId == -1 || serviceId == '' )"
                                  id="clinic-select-all"
                                  v-model="clinicSelectAll"
                                  name="clinic-select-all"
                                  value="accepted"
                                  unchecked-value="not_accepted"
                                  class="float-right text-primary"
                              > {{formTranslation.service.select_all}} </b-form-checkbox>
                            </div>
                          </div>
                            <multi-select
                                    deselect-label=""
                                    select-label=""
                                    @select="clinicChange"
                                    @remove="clinicChange"
                                    v-model="service.clinic_id"
                                    :tag-placeholder="formTranslation.patient_encounter.tag_select_clinic_plh" 
                                    id="clinic_id"
                                    :multiple="isServiceEdit"
                                    :loading="clinicMultiselectLoader"
                                    :disabled="clinicMultiselectLoader"
                                    :placeholder="formTranslation.patient_encounter.tag_select_clinic_plh"
                                    label="label"
                                    track-by="id" :options="clinic"
                            ></multi-select>
                          <div v-if="submitted && !$v.service.clinic_id.required"
                               class="invalid-feedback">{{formTranslation.common.clinic_is_required}}
                          </div>
                        </div>
                    </div>
                <div class="col-md-4" v-if="getUserRole() !== 'doctor' && !hideDoctor" >
                  <div class="form-group">
                    <div class="select-all-doctor d-flex" >
                      <div class="doctor-select-all-2" style="width: 100%">
                        <label for="doctor-select-all" class="form-control-label">
                          {{formTranslation.common.doctor}} <span class="text-danger">*</span>
                        </label>
                        <b-form-checkbox
                          v-if="(serviceId == 0 || serviceId == -1 || serviceId == '' ) &&  $route.params.id === undefined"
                          id="doctor-select-all"
                          v-model="doctorSelectAll"
                          name="doctor-select-all"
                          value="accepted"
                          unchecked-value="not_accepted"
                          class="float-right text-primary"
                          > {{formTranslation.service.select_all}} </b-form-checkbox>
                      </div>
                    </div>
                    <div class="kivi-pr">
                      <multi-select
                        v-model="service.doctor_id"
                        :tag-placeholder="formTranslation.service.tag_select_doc_plh"
                        id="doctor_id"
                        :placeholder="formTranslation.service.select_doc_plh"
                        label="label"
                        track-by="id"
                        :loading="doctorMultiselectLoader"
                        :multiple="isServiceEdit"
                        :options="doctors"
                      ></multi-select>
                    </div>
                    <div v-if="submitted && !$v.service.doctor_id.required"
                        class="invalid-feedback">{{formTranslation.appointments.doc_required}}
                    </div>
                  </div>
                </div>                
                
                <div class="col-md-4" v-if="userData.addOns.kiviPro">
                  <div class="form-group">
                    <label for="duration" class="form-control-label"> {{formTranslation.patient_encounter.duration}} </label>
                    <div class="">
                      <!-- <b-select
                          id="time_slot"
                          v-model="service.duration"
                          class="form-control text-capitalize"
                          name="duration"
                      >
                        <option v-for="(slot, index) in time_slots" :key="index" :value="slot.value"> {{ slot.label }}</option>
                      </b-select> -->
                      <VueTimepicker manual-input="true" v-model="service.duration" id="time_slot" name="duration" :minute-range="[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" hide-disabled-minutes="true" :minute-interval="5" @change="changeDurationHandler" placeholder="HH:MM"></VueTimepicker>
                    </div>
                  </div>
                </div>
                <div :class="userData.addOns.telemed || userData.addOns.googlemeet ? 'col-md-4' : 'col-md-4'" >
                  <div class="form-group ">
                    <label for="status" class="form-control-label">
                      {{formTranslation.common.status}} <span class="text-danger">*</span></label>
                    <div class="kivi-pr">
                        <multi-select
                          v-model="service.status"
                          :tag-placeholder="formTranslation.service.tag_select_doc_plh"
                          id="status"
                          name="status"
                          :placeholder="formTranslation.service.select_status_plh"
                          label="label"
                          track-by="id"
                          :options="[{ id: 1, label: formTranslation.common.active }, { id:0 , label: formTranslation.common.inactive}]"
                        ></multi-select>
                        <span class="select_clear_btn"  @click="service.status = ''">×</span>
                    </div>
                    <div v-if="submitted && !$v.service.status.required" class="invalid-feedback">
                      {{formTranslation.appointments.status_required}}
                    </div>
                  </div>
                </div>
                <div :class="userData.addOns.telemed || userData.addOns.googlemeet ? 'col-md-4' : 'col-md-4'">
                  <div class="form-group ">
                    <label for="multiservice" class="form-control-label">
                      {{formTranslation.common.include_in_multiservice}} <span class="text-danger">*</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          v-model="service.multiservice"
                          :tag-placeholder="formTranslation.common.tag_select_doc_plh"
                          id="multiservice"
                          name="multiservice"
                          :placeholder="formTranslation.service.select_status_plh"
                          label="label"
                          track-by="id"
                          :options="multiServiceOptions"
                      ></multi-select>
                      <span class="select_clear_btn"  @click="service.multiservice = ''">×</span>
                    </div>
                    <div v-if="submitted && !$v.service.multiservice.required" class="invalid-feedback">
                      {{formTranslation.appointments.status_required}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="kivicare-avatar-upload">
                <div class="kivicare-avatar-edit">
                  <input  id="file" type="button" ref="file" class="p-2"
                          @click="uploadProfile()" style="color: transparent;">
                  <label for="file" v-b-tooltip.hover :title="formTranslation.clinic.edit_profile_img">
                    <i class="fas fa-pencil-alt fa-2x"></i>
                  </label>
                </div>
                <div class="kivicare-avatar-preview">
                  <div id="imagePreview" :style="'background-image: url('+ (service.image ? service.image : profileImage)+');'">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-12 p-0">
              <div class="d-flex justify-content-end">
                <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit">
                 <i class="fa fa-save"></i> {{ formTranslation.service.save_btn }}
                </button>
                <button v-else class="btn btn-primary" type="submit" disabled>
                  <i class="fa fa-sync fa-spin"></i> &nbsp; {{formTranslation.common.loading}}
                </button>
                <button type="button" class="btn btn-outline-primary" @click="closeForm" > {{formTranslation.common.cancel}} </button>
              </div>
            </div>
          </div>
        </b-card>
      </form>
    </b-col>
  </b-row>
</template>

<script>

import VueTimepicker from 'vue2-timepicker'
import 'vue2-timepicker/dist/VueTimepicker.css'
import {maxLength, maxValue, minLength, minValue, required, requiredIf} from "vuelidate/lib/validators";
import {post, get} from "../../config/request";
import {validateForm } from "../../config/helper";

export default {
  components:{
    VueTimepicker
  },
  data: () => {
    return {
      curency: {},
      oldDoctorList: [],
      serviceSelectAll: [],
      doctorSelectAll: '',
      clinicSelectAll:'',
      cardTitle: 'Add service',
      encounter_id: 0,
      types: [],
      serviceList: [],
      outcomes: [],
      service: {},
      loading: false,
      submitted: false,
      buttonText: '<i class="fa fa-save"></i> Save',
      doctors: [],
      clinic:[],
      clinic_id: 0,
      hideDoctor:false,
      profileImage: '',
      file:'',
      categoryMultiselectLoader:true,
      doctorMultiselectLoader:true,
      time_slots:[],
      multiServiceOptions:[
        {
          id:'no',
          label:'Single'
        },
        {
          id:'yes',
          label:'Multiple'
        }
      ],
      clinicMultiselectLoader:false,
      selected_clinic_id: [],
      service_clinic_id: 0

    }
  },
  props:{
    serviceId:[Number,String],
    props_doctor_id:{
      type:[Number,String],
      default() {
        return -1
      }
    }
  },
  validations: {
    service: {
      type: {required},
      name: {
        required
      },
      clinic_id:{
        required: requiredIf(function () {
              return this.userData.addOns.kiviPro == true && (this.getUserRole() == 'administrator' || this.getUserRole() == 'doctor') && (this.clinicField !== false)
            })
        },
      doctor_id: {
        required: requiredIf(function () {
          return  this.getUserRole() !== 'doctor'
        })
      },
      price: {
        required,
        minValue: minValue(0),
        maxValue: maxValue(1000000000000000000)
      },
      status: {required},
      multiservice:{required},
      telemed_service:{
        required: requiredIf(function () {
          return this.userData.addOns.telemed || this.userData.addOns.googlemeet;
        })
      },
    },
  },
  mounted() {   
    this.service = this.defaultServiceData();
    if(this.props_doctor_id !== undefined && this.props_doctor_id !== -1 && this.props_doctor_id !== '-1'){
      this.hideDoctor = true;
      this.service.doctor_id = [{
        id:this.props_doctor_id
      }];
      this.clinicList({
              data_type: 'clinics',
              doctor_id:this.props_doctor_id
        });
    }else{
      this.clinicList({
                data_type: 'clinic_list',
            });
    }
    this.profileImage = window.request_data.kiviCarePluginURL + 'assets/images/kc-demo-img.png';
    this.init();
  },
  methods: {
    changeDurationHandler(event) {
      const duration = parseInt(event.data.HH) * 60 + parseInt(event.data.mm);
      this.service.duration = duration.toString();   
    },
    init: function () {
      this.getTimeSlots()
     
      this.getServiceType();
      if (this.$store.state.userDataModule.clinic !== undefined) {
        this.clinic_id = this.$store.state.userDataModule.clinic.id;
        if (this.getUserRole() !== 'doctor') {
          if(!this.hideDoctor){
            this.getDoctorDropdown();
          }
        } else {
          this.service.doctor_id = {
            id: this.$store.state.userDataModule.user.ID,
            label: this.$store.state.userDataModule.user.display_name
          }
        }
      } else {
        this.$store.dispatch("userDataModule/fetchUserData", {});
        setTimeout(() => {
          this.clinic_id = this.$store.state.userDataModule.clinic.id;
          if (this.getUserRole() !== 'doctor') {
            if(!this.hideDoctor){
              this.getDoctorDropdown();
            }
          } else {
            this.service.doctor_id = {
              id: this.$store.state.userDataModule.user.ID,
              label: this.$store.state.userDataModule.user.display_name
            }
          }
        }, 1000);
      }
      this.multiServiceOptions = this.multiServiceOptions.map( (item) => {
        item.label = this.formTranslation.common[item.id];
        return item;
      })

      if(this.serviceId != -1){
        this.cardTitle = this.formTranslation.common.edit_service;
        this.buttonText = '<i class="fa fa-save"></i>'+this.formTranslation.common.save;
        this.get_service(this.serviceId)
      }

      if(this.$route.params.id !== undefined){
        this.get_service(this.$route.params.id)
      }
    },
    getTimeSlots: function () {
      this.time_slots = [
          {value:5,label:'5min'},
        {value:10,label:'10min'},
        {value:15,label:'15min'},
        {value:20,label:'20min'},
        {value:25,label:'25min'},
        {value:30,label:'30min'},
        {value:35,label:'35min'},
        {value:40,label:'40min'},
        {value:45,label:'45min'},
        {value:50,label:'50min'},
        {value:55,label:'55min'},
        {value:60,label:'1hr'},
        {value:75,label:'1hr 15min'},
        {value:90,label:'1hr 30min'},
        {value:105,label:'1hr 45min'},
        {value:120,label:'2hr'},
        {value:150,label:'2hr 30min'}
      ]
    },
    closeForm(){
      if(this.hideDoctor){
        this.$emit('closeServiceModal')
        this.hideDoctor = false;
      }
      this.$emit('closeForm')
      if(this.$route.params.id !== undefined){
        this.$router.push({name: 'service'});
      }
    },  
    clinicChange(selectedOption) {
      if (this.getUserRole() !== 'doctor') {
        if (this.selected_clinic_id.some(option => option.id === selectedOption.id)){
          const index = this.selected_clinic_id.findIndex(option => option.id === selectedOption.id);
          if (index !== -1) {
            this.selected_clinic_id.splice(index, 1);
          }
        }else{
          this.selected_clinic_id.push(selectedOption);
        }
        let clinic_id = '';
        if(selectedOption !== undefined){
          if(Array.isArray(this.selected_clinic_id)){
            clinic_id = this.selected_clinic_id.map((index)=>{
              return index.id;
            })
          }
        }
        else{
          if(Array.isArray(this.service.clinic_id)){
            clinic_id = this.service.clinic_id.map((index)=>{
            return index.id;
          })
          }else{
            clinic_id = this.service.clinic_id.id
          }
        } 
        this.service.doctor_id = '';
        this.doctorSelectAll = '';
        this.doctorMultiselectLoader = true;
        get('get_static_data', {
          data_type: 'get_users_by_clinic',
          clinic_id: clinic_id,
          telemed_service: this.service.telemed_service,
          type: 'doctor'
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
      }
    },
    uploadProfile() {
      let _this = this;

      var custom_uploader = kivicareCustomImageUploader(this.formTranslation)

      custom_uploader.on('select', function () {
        var attachment = custom_uploader.state().get('selection').first().toJSON();
        _this.profileImage = attachment.url;
        _this.service.profile_image = attachment.id;
        _this.service.image = _this.profileImage
      });

      //Open the uploader dialog
      custom_uploader.open();
    },
    handleSubmit: function () {
      this.loading = true;

      this.submitted = true;

      if (this.props_doctor_id !== undefined && this.props_doctor_id !== -1 && this.props_doctor_id !== '-1') {
        this.hideDoctor = true;
        this.service.doctor_id = [{
          id: this.props_doctor_id
        }]
      }
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.service.$invalid) {
        this.loading = false;
        return;
      }
      
      if (validateForm("serviceForm")) {
        post('service_save', this.service)
          .then((response) => {
            this.loading = false;
            this.submitted = false;
            if (response.data.status !== undefined && response.data.status === true) {
              if(this.getUserRole() === 'administrator'){
                this.$store.dispatch("userDataModule/fetchUserData", {});
              }
              this.service = this.defaultServiceData();
              displayMessage(response.data.message);
              this.$emit('closeForm');
              this.getService()
              if(this.hideDoctor){
                this.$emit('closeServiceModal')
                this.hideDoctor = false;
              }
            } else {
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.submitted = false;
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
      }
    },
    defaultServiceData: function () {
      return {
        type: '',
        name: '',
        doctor_id: '',
        service_id: '',
        price: '',
        status: { id: 1, label: this.formTranslation.common.active },
        multiservice:{id:"yes",label:this.formTranslation.common.yes},
        telemed_service:'no',
        duration: ''       
      }
    },
    getDoctorDropdown: function () {
      this.doctorMultiselectLoader = true;
      get('get_static_data', {
        data_type: 'clinic_doctors',
        module_type:'service_module',
        clinic_id: this.service_clinic_id
      }).then((response) => {
        this.doctorMultiselectLoader = false;
        if (response.data.status !== undefined && response.data.status === true) {
          this.doctors = response.data.data;
          this.oldDoctorList = this.doctors;
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
    getService() {
       this.$emit('getServiceData')
    },
    getServiceType () {
      this.categoryMultiselectLoader = true;
      // Get dropdown data for service
      get('get_static_data', {
        data_type: 'static_data_with_label',
        static_data_type: 'service_type'
      })
        .then((response) => {
          if (response.data.status !== undefined && response.data.status === true) {
            this.types = response.data.data;
            let temp = this.types;
            if(temp.length > 0) {
              let checkExists = false ;
              temp.map(function(value,key){
                  if(value.id == 'system_service'){
                   checkExists = true;
                  }
              })
              if(!checkExists){
                this.types.push({id:'system_service',label:'System Service'})
              }
            }
          } else {
            displayErrorMessage(response.data.message)
          }
          this.categoryMultiselectLoader = false;
        })
        .catch((error) => {
          this.categoryMultiselectLoader = false;
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error)
        })
    },
    addNewServiceCategory (value) {
      let specialitiesObj = {
        label: value,
        type: 'service_type',
        value: value.replace('', '_'),
        status: 1,
      }
      let _this = this;
      post('static_data_save', specialitiesObj)
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              _this.types.push({id: value.replace('', '_'), label: value})
              _this.service.type =  {id: value.replace('', '_'), label: value} ;
                this.getServiceType();
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
    },
    get_service(serviceId){
      if(!serviceId){
        return
      }
      get('service_edit', {
        id: serviceId
      })
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.service_clinic_id = response.data.data.clinic_id.id;
              this.getDoctorDropdown();
              this.service = response.data.data
              this.telemedEnableChange(this.service.telemed_service)
              this.service.duration = (this.service.duration !== '00:00') ? this.service.duration : '';
              //scroll to top
              const element = this.$el;
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.widgets.record_not_found);
          })
    },
    telemedEnableChange(selectedValue){
      if(this.userData.addOns.telemed || this.userData.addOns.googlemeet){
        this.doctorSelectAll = {};
        this.doctors = this.oldDoctorList;
        
        if(selectedValue === 'yes'){
          let selected_doctor_telemed_active = false;
          this.doctors = this.doctors.filter((val, key) => {
            if(val.enableTeleMed && this.service.doctor_id && this.service.doctor_id.id ){
              if(val.id == this.service.doctor_id.id){
                selected_doctor_telemed_active = true
              }
            }
            if(val.enableTeleMed){
              return val
            }
            
          });
          if(!(selected_doctor_telemed_active) && this.getUserRole() !== 'doctor' ){
            this.service.doctor_id = {};
          }
        }else{
          if(this.service.id !== undefined){
            this.doctors = this.oldDoctorList;
          }
        }
      }
    },
    clinicList(data){
      this.clinicMultiselectLoader = true;
      get('get_static_data', data)
        .then((response) => {
          this.clinicMultiselectLoader = false;
            if (response.data.status !== undefined && response.data.status === true) {
                this.clinic = response.data.data;
            }
        })
        .catch((error) => {
          this.clinicMultiselectLoader = false;
            console.log(error);
            displayErrorMessage('Internal server error');
        })
    }
  },
  computed: {
    currency: function() {
      return  this.currencyData
    },
    currencyPrefix: function () {
      if(this.currency !== undefined && this.currency !== null && this.currency !== '') {
        return this.currency.currency_prefix;
      }
    },
    currencyPostfix: function () {
      if(this.currency !== undefined && this.currency !== null && this.currency !== '') {
        return this.currency.currency_postfix;
      }
    },
    clinicId: function () {
      if (this.$store.state.userDataModule.clinic !== undefined) {
          return this.$store.state.userDataModule.clinic.id
      }
    },
    isServiceEdit: function () {
      return !(this.serviceId !== undefined && this.serviceId !== 0 && this.serviceId !== -1);
    },
    userData () {
      return this.$store.state.userDataModule.user;
    }
  },
  watch: {
    serviceId(serviceId, oldVal) {
      if (serviceId !== undefined && serviceId !== 0 && serviceId !== -1) {
        this.cardTitle = this.formTranslation.common.edit_service;
        this.buttonText = '<i class="fa fa-save"></i>'+this.formTranslation.common.save;
        this.get_service(serviceId)        
      }
    },
    doctorSelectAll(value) { 
      if( this.serviceId == undefined || this.serviceId == 0 || this.serviceId == -1 ){
        if (value === 'not_accepted') {
          this.service.doctor_id = [] ;
        } else if(value === 'accepted') {
          this.service.doctor_id = this.doctors ;
        }else{
          this.service.doctor_id = [];
        }
      }
    },
    clinicSelectAll(value){
      if (value === 'not_accepted') {
        this.service.clinic_id = [] ;
      } else {
        this.service.clinic_id = this.clinic ;
      }
      this.clinicChange()
    },
  }
}
</script>

<style scoped>
label{
  display: unset !important;
}
</style>