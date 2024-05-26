<template>
  <b-row>
    <b-col sm="12" md="12" lg="12">
      <form id="clinic-schedule-form" @submit.prevent="handleSubmit" :novalidate="true">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4" v-if="getUserRole() !== 'doctor'">
              <div class="form-group">
                <label for="module_type" class="form-control-label">
                  {{formTranslation.clinic_schedule.holiday_of}} <span class="text-danger">*</span>
                </label>
                <div class="kivi-pr">
                  <multi-select
                    deselect-label=""
                    select-label=""
                    v-model="clinicScheduleRequest.module_type"
                    @select="handleModuleChange"
                    id="module_type"
                    :tag-placeholder="formTranslation.clinic_schedule.tag_module_type_plh" 
                    :placeholder="formTranslation.clinic_schedule.select_modulr_plh"
                    label="label"
                    track-by="id"
                    :allow-empty="false"
                    :options="clinicModule"
                    @input="changeType">
                  </multi-select>
                  <span class="select_clear_btn"  @click="clinicScheduleRequest.module_type = {} ">×</span>
                </div>
                <div v-if="submitted && !$v.clinicScheduleRequest.module_type.required"
                     class="invalid-feedback">{{formTranslation.clinic_schedule.module_type_required}}
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="from_date" class="form-control-label"> {{formTranslation.clinic_schedule.schedule_date}} <span
                    class="text-danger">*</span></label>
                <vc-date-picker
                    id="schedule-date"
                    title-position="left"
                    v-model="clinicScheduleRequest.scheduleDate"
                    mode='range'
                    ref="holidayDatePicker"
                    :min-date="minDate"
                    :update-on-input="false"
                    :popover="{ placement: 'bottom', visibility: 'click' }"
                    :class="{ ' is-invalid': submitted && $v.clinicScheduleRequest.scheduleDate.$error,  'mb-2': true }"
                >
                  <template v-slot="{ inputValue }">
                    <input
                        class="form-control date-picker"
                        readonly
                        :value="inputValue"
                        :placeholder="formTranslation.clinic_schedule.select_schedule_date_plh"
                    />
                  </template>
                </vc-date-picker>
                <div
                    v-if="submitted && (!$v.clinicScheduleRequest.scheduleDate.start.required || !$v.clinicScheduleRequest.scheduleDate.end.required)"
                    class="invalid-feedback">
                    {{formTranslation.clinic_schedule.schedule_date_required}}
                </div>
              </div>
            </div>
            <div class="col-md-4" v-if="getUserRole() !== 'doctor'">
              <div class="form-group">
                <div v-if="isDoctorModule">
                  <label for="specialties" class="form-control-label">
                    {{formTranslation.common.doctor}} <span class="text-danger">*</span>
                  </label>
                  <div class="kivi-pr">
                    <multi-select
                        deselect-label=""
                        select-label=""
                        v-model="clinicScheduleRequest.module_id"
                        id="select-module-type-id1"
                        :tag-placeholder="formTranslation.clinic_schedule.tag_doctors_plh"
                        :placeholder="formTranslation.clinic_schedule.select_doc_plh"
                        label="label"
                        track-by="id"
                        :loading="doctorMultiselectLoader"
                        :disabled="doctorMultiselectLoader"
                        :options="doctors"
                        :searchable="true"
                    >
                    </multi-select>
                    <span class="select_clear_btn"  @click="clinicScheduleRequest.module_id = ''">×</span>
                  </div>
                  <div v-if="submitted && !$v.clinicScheduleRequest.module_id.id.required" class="invalid-feedback">
                    {{formTranslation.appointments.doc_required}}
                  </div>
                </div>
                <div v-if="isClinicModule">
                  <label for="specialties" class="form-control-label">
                    {{formTranslation.common.clinic}} <span class="text-danger">*</span>
                  </label>
                  <div class="kivi-pr">
                    <multi-select
                        deselect-label=""
                        select-label=""
                        v-model="clinicScheduleRequest.module_id"
                        id="select-module-type-id"
                        :tag-placeholder="formTranslation.clinic_schedule.plh_tag_clinic"
                        :placeholder="formTranslation.clinic.select_clinic"
                        label="label"
                        track-by="id"
                        :loading="userData.addOns.kiviPro != true && clinicMultiselectLoader"
                        :disabled="userData.addOns.kiviPro != true && clinicMultiselectLoader"
                        :options="clinics"
                        :searchable="true"
                        
                    >
                    </multi-select>
                    <span class="select_clear_btn"  @click="clinicScheduleRequest.module_id = ''">×</span>
                  </div>
                  <div v-if="submitted && !$v.clinicScheduleRequest.module_id.id.required" class="invalid-feedback">
                    {{formTranslation.reports.tag_plh_select_clinic}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <b-row>
            <b-col sm="12" md="12" lg="12" class="p-0">
              <div class="d-flex justify-content-end">
                <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit">
                  <i class="fa fa-save"></i> {{ formTranslation.common.save }}        
                </button>
                <button v-else class="btn btn-primary" type="submit" disabled>
                  <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                </button>
                <button type="button" class="btn btn-outline-primary" @click="closeForm"> {{formTranslation.common.cancel}}</button>
              </div>
            </b-col>
          </b-row>
        </div>
      </form>
    </b-col>
  </b-row>
</template>

<script>

import {get, post} from "../../config/request";
import {required, numeric} from "vuelidate/lib/validators";
import {validateForm, minTime, maxTime, validateTimeSlot, objToTime} from "../../config/helper";

export default {
  data: () => {
    return {
      minDate: new Date(),
      isDoctorModule: true,
      isClinicModule:false,
      scheduleDate: {
        start: new Date(),
        end: new Date()
      },
      defaultClinic: {},
      submitted: false,
      loading: false,
      selectModuleID: {},
      selectModuleType: {
        id: 'doctor',
        label: 'Doctor'
      },
      clinicScheduleRequest: {},
      clinicScheduleTitle: 'Create holiday',
      clinicScheduleButtonText: '<i class="fa fa-save"></i> Save',
      clinicModule: [
        {
          id: 'clinic',
          label: 'Clinic'
        },
        {
          id: 'doctor',
          label: 'Doctor'
        }
      ],
      doctors: [],
      clinics: [],
      clinicMultiselectLoader:true,
      doctorMultiselectLoader:true
    }
  },
  props: [
    'holidayId',
    'holidayDetail'
  ],
  validations: {
    clinicScheduleRequest: {
      module_type: {required},
      scheduleDate: {
        start: {required},
        end: {required}
      },
      module_id: {
        id: {required}
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      setTimeout(() => {
        this.clinicScheduleRequest = this.defaultClinicScheduleRequest();
        this.clinicRequest = this.defaultClinicRequest();
        this.getDoctorsData();
        //this.getClinicData();
      }, 1000);
    },
    handleSubmit: function () {
      this.submitted = true;
      this.$v.$touch();

      if (this.$v.clinicScheduleRequest.$invalid) {
        this.loading = false;
        return;
      }

      
      let clinicScheduleRequest = Object.assign({}, this.clinicScheduleRequest);
      clinicScheduleRequest.scheduleDate.start = moment(this.clinicScheduleRequest.scheduleDate.start).format('YYYY-MM-DD');
      clinicScheduleRequest.scheduleDate.end = moment(this.clinicScheduleRequest.scheduleDate.end).format('YYYY-MM-DD');
      // clinicScheduleRequest.scheduleDate.start = new Date(this.clinicScheduleRequest.scheduleDate.start + ' 00:00')
      // clinicScheduleRequest.scheduleDate.end = new Date(this.clinicScheduleRequest.scheduleDate.end + ' 00:00')
      $.confirm({
        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
        content: this.formTranslation.common.cancel_date,
        type: 'red',
        buttons: {
          ok: {
            text: this.formTranslation.common.yes,
            btnClass: 'btn-danger',
            keys: ['enter'],
            action: () => {
              this.submitted = true;
              this.loading = true;
              post('clinic_schedule_save', clinicScheduleRequest)
                  .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                      displayMessage(response.data.message);
                      this.isCollapse (false);
                      this.getHoliday()
                    } else {
                      displayErrorMessage(response.data.message)
                    }
                    this.loading = false;
                    this.submitted = false
                  })
                  .catch((error) => {
                    this.submitted = false
                    this.loading = false;
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error)
                  })
            }
          },
          cancel: {
            text:this.formTranslation.common.cancel
          }
        }
      });

    },
    changeType: function (data, index) {
      this.clinicScheduleRequest.module_id=''
      if (this.clinicScheduleRequest.module_type !== undefined && this.clinicScheduleRequest.module_type.id === 'doctor') {
        this.isDoctorModule = true;
        this.isClinicModule = false;
      }else if(this.clinicScheduleRequest.module_type !== undefined && this.clinicScheduleRequest.module_type.id === 'clinic'){
        this.isClinicModule = true;
        this.isDoctorModule = false;
      } else {
        this.isDoctorModule = false;
        this.isClinicModule = false;
        let module_id = {
          module_id: {
            id: this.defaultClinicData.id
          }
        }
        this.clinicScheduleRequest = module_id
      }
      // this.clinicScheduleRequest = {}
    },
    defaultClinicScheduleRequest: function () {
      let module_id = {
        id: '',
        label: ''
      }
      if (this.getUserRole() === 'doctor') {
        let userData = this.loginUserData;
        module_id = {
          id: userData.ID,
          label: userData.display_name
        }
      }
      return {
        id: '',
        module_type: {
          id: 'doctor',
          label: 'Doctor'
        },
        scheduleDate: {
          start: new Date(),
          end: new Date()
        },
        module_id: module_id,
        description: '',
        status: 1
      }
    },
    getDoctorsData: function () {
      this.doctorMultiselectLoader = true;
      get('get_static_data', {
        data_type: 'clinic_doctors',
        clinic_id: this.defaultClinicData.id
      })
          .then((data) => {
            this.doctorMultiselectLoader = false;
            if (data.data.status !== undefined && data.data.status === true) {
              this.doctors = data.data.data;
            }
          })
          .catch((error) => {
            this.doctorMultiselectLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    getClinicData: function () {
       this.clinicMultiselectLoader = true
        get('get_static_data', {
          data_type: 'clinics'
        })
        .then((data) => {
          this.clinicMultiselectLoader = false
          if (data.data.status !== undefined && data.data.status === true) {
            this.clinics = data.data.data;
            if(this.clinics.length > 0){
              this.clinicScheduleRequest.module_id = [];

              this.clinicScheduleRequest.module_id = Object.assign({},this.clinics[0] );
            }
          }
        })
        .catch((error) => {
          this.clinicMultiselectLoader = false
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    defaultClinicRequest: function () {
        return {
            searchKey: '',
            searchValue: '',
            offset: 0,
            limit: 10
        }
    },
    editScheduleData: function (id) {    
      if (id !== undefined && id !== null && id !== '') {
        this.clinicScheduleRequest.scheduleDate = '';
        get('clinic_schedule_edit', {id: id})
            .then((data) => {
              if (data.data.status !== undefined && data.data.status === true) {
                this.clinicScheduleRequest = data.data.data;
                if (this.clinicScheduleRequest.module_type.id === 'clinic') {
                  this.isDoctorModule = false;
                }

              
                this.clinicScheduleRequest.scheduleDate = {
                  start:new Date(this.clinicScheduleRequest.scheduleDate.start + ' 00:00'),
                  end:new Date(this.clinicScheduleRequest.scheduleDate.end + ' 00:00')
               }
              } else {
                displayErrorMessage(data.data.message);
                this.$router.push({name: 'clinic-schedule'});
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
      } else {
        displayErrorMessage(this.formTranslation.clinic_schedule.schedule_not_found);
      }
    },
    getHoliday() {
      this.$emit('getClinicScheduleList')
    },
    closeForm(){
      this.$emit('closeForm');
      this.clinicScheduleRequest = this.defaultClinicScheduleRequest();

    },
    isCollapse (value) {
      this.$emit('closeForm', value)
    },
    handleModuleChange:function(selected){
      if(selected.id !== undefined && selected.id === 'clinic'){
        this.getClinicData();
      }
    }
  },
  computed: {
    defaultClinicData() {
      return this.$store.state.userDataModule.clinic;
    },
    loginUserData() {
      return this.$store.state.userDataModule.user
    },
    // formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // },
    userData () {
      return this.$store.state.userDataModule.user;
    },
  },
  watch: {
    holidayId(holidayId, oldVal) {
      if (holidayId !== undefined && holidayId !== -1 ) {
        this.clinicScheduleTitle = this.formTranslation.clinic_schedule.editholiday;
        this.clinicScheduleButtonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;
        this.editScheduleData(holidayId);
      } else {
        this.clinicScheduleRequest = this.defaultClinicScheduleRequest();
      }
    },
    holidayDetail: function(){
      this.clinicScheduleRequest.module_type = this.holidayDetail.module_type
      if (this.holidayDetail.module_type !== undefined && this.holidayDetail.module_type === 'doctor') {
        this.isDoctorModule = true;
        this.isClinicModule = false;
        // this.clinicScheduleRequest.module_id = this.holidayDetail.module_id
      }else if(this.holidayDetail.module_type !== undefined && this.holidayDetail.module_type === 'clinic'){
        this.isClinicModule = true;
        this.isDoctorModule = false;
        // this.clinicScheduleRequest.module_id = this.holidayDetail.module_id
      } else {
        this.isDoctorModule = false;
        this.isClinicModule = false;
      }
    }
  }
}
</script>
