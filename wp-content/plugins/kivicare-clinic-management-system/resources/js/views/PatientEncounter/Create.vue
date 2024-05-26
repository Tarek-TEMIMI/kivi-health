<template>
    <b-row>
        <b-col sm="12">
            <form id="encounterDataForm" @submit.prevent="handleSubmit" :novalidate="true">
              <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="receptionist_birthdate" class=" form-control-label">
                                {{formTranslation.patient_encounter.encounter_date}}
                                <span class="text-danger">*</span>
                            </label>
                            <vc-date-picker
                                id="receptionist_birthdate"
                                title-position="left"
                                v-model="encounterData.date"
                                :popover="{ placement: 'bottom', visibility: 'click' }"
                                :class="{ ' is-invalid': submitted && $v.encounterData.date.$error }"

                            >
                                <template v-slot="{ inputValue }">
                                    <input
                                        class="form-control date-picker"
                                        readonly
                                        :value="inputValue"
                                    />
                                </template>
                            </vc-date-picker>
                            <div v-if="submitted && !$v.encounterData.date.required" class="invalid-feedback">
                                {{formTranslation.patient_encounter.encounter_date_required}}
                            </div>
                        </div>
                    </div>
                     <div  v-if="(userData.addOns.kiviPro == true && (getUserRole() == 'administrator' || getUserRole() == 'doctor')) && clinicField" class="col-md-4">
                        <div class="form-group" >
                            <label for="doctor_id" class="form-control-label">
                                {{formTranslation.clinic.select_clinic}} <span class="text-danger">*</span>
                            </label>
                            <multi-select
                                    deselect-label=""
                                    select-label=""
                                    @select="clinicChange"
                                    @remove="clinicChange"
                                    v-model="encounterData.clinic_id"
                                    :tag-placeholder="formTranslation.patient_encounter.tag_select_clinic_plh" 
                                    id="clinic_id"
                                    :loading="clinicMultiselectLoader"
                                    :disabled="clinicMultiselectLoader"
                                    :placeholder="formTranslation.patient_encounter.tag_select_clinic_plh"
                                    label="label"
                                    track-by="id" :options="clinic"
                            ></multi-select>
                          <div v-if="submitted && !$v.encounterData.clinic_id.id.required"
                               class="invalid-feedback">{{formTranslation.common.clinic_is_required}}
                          </div>
                        </div>
                    </div>
                    <div v-if="getUserRole() != 'doctor'" class="col-md-4" >
                        <div class="form-group">
                            <label for="doctor_id" class="form-control-label">
                                {{formTranslation.common.doctor}} <span class="text-danger">*</span>
                            </label>
                            <multi-select v-model="encounterData.doctor_id"
                                          deselect-label=""
                                          select-label=""
                                          :tag-placeholder="formTranslation.patient_encounter.tag_select_doctor" id="doctor_id"
                                          :placeholder="formTranslation.patient_encounter.search_plh"
                                          :loading="doctorMultiselectLoader"
                                          :disabled="doctorMultiselectLoader"
                                          label="label" track-by="id" :options="doctors"
                            ></multi-select>
                            <div  v-if="submitted && !$v.encounterData.doctor_id.required"
                                 class="invalid-feedback">{{formTranslation.appointments.doc_required}}
                            </div>
                        </div>
                    </div>
                      <div class="col-md-4" v-if="patientField">
                        <div class="form-group">
                        <label for="form_patient_id" class="form-control-label">
                            {{formTranslation.common.patient}} <span class="text-danger">*</span>
                        </label>
                        <multi-select
                            deselect-label=""
                            select-label=""
                            v-model="encounterData.patient_id"
                            :tag-placeholder="formTranslation.patient_encounter.tag_patient_type_plh" id="patient_id"  :placeholder="formTranslation.patient_encounter.search_plh"
                            label="label"
                            track-by="id"
                            :loading="patientMultiselectLoader"
                            :disabled="patientMultiselectLoader"
                            :options="patients"
                        />
                        <div v-if="submitted && !$v.encounterData.patient_id.required"
                            class="invalid-feedback">{{formTranslation.patient_bill.patient_required}}
                        </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="description" class="form-control-label">
                                {{formTranslation.appointments.description}}
                            </label>
                            <textarea
                                name="description"
                                v-model="encounterData.description"
                                :placeholder="formTranslation.appointments.description"
                                class="form-control"
                                id="description">
                            </textarea>
                        </div>
                    </div>

                  
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex justify-content-end">
                            <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit"
                                    > <i class="fa fa-save"></i> {{ formTranslation.patient_encounter.save_btn }} </button>
                            <button v-else class="btn btn-primary" type="submit" disabled>
                                <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                            </button>
                            <button type="button" class="btn btn-outline-primary" @click="getCloseForm()"> {{formTranslation.common.cancel}}</button>
                        </div>
                    </div>
                </div>
              </div>
            </form>
        </b-col>
    </b-row>
</template>

<script>
import { required, numeric,requiredIf, requiredUnless } from "vuelidate/lib/validators";
import { post, get } from "../../config/request";
import {validateForm} from "../../config/helper";

export default {
  data: () => {
      return {
          cardTitle: 'Add encounter',
          patient_id: 0,
          encounterData: {},
          specialization: [],
          clinics: [],
          doctors: [],
          loading: false,
          submitted: false,
          buttonText: '<i class="fa fa-save"></i> Save',
          patients:[],
          encounterTemplates:[],
        clinicMultiselectLoader:true,
        doctorMultiselectLoader:true,
        patientMultiselectLoader:true,
        encounterTemplateLoader:true,
      }
  },
  props: ['encounterId','patientField', 'clinicField'],
  validations() {
    return {
      encounterData: {
        date: { required },
        patient_id:{
          required
        },
        doctor_id: {
          required: requiredIf(function () {
            return !this.isDoctorSelectionEnabled
          })
        },
        clinic_id:{
          id:{
            required: requiredIf(function () {
              return this.userData.addOns.kiviPro == true && (this.getUserRole() == 'administrator' || this.getUserRole() == 'doctor') && (this.clinicField !== false)
            })
          }
        }
      }
    }
  },
  mounted() {
      this.encounterData = this.defaultEncounterData();   
      
      if(this.getUserRole() !== 'doctor'){
        this.getDoctorsData();
      }
      this.init();
      setTimeout(()=>{
        this.activeClinicId = this.userData.default_clinic_id ;
      },2000)
  },
  methods: {
      init: function () {

        if (this.encounterId!== undefined && this.encounterId != -1 ) {
          this.cardTitle = this.formTranslation.common.edit_encounter;
          this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;
          get('patient_encounter_edit', {
            id:this.encounterId
          })
              .then((response) => {
                if (response.data.status !== undefined && response.data.status === true) {
                  this.encounterData = response.data.data ;
                  this.patient_id = this.encounterData.patient_id
                  this.encounterData.date  = new Date(this.encounterData.date + ' 00:00');
                }
              })
              .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.widgets.record_not_found);
              })
        }
          if (this.getUserRole() !== 'patient') {
            this.getClinicPatients('')
          }

          if (this.$route.params.patient_id !== undefined) {
              this.encounterData.patient_id = this.$route.params.patient_id;
          }
         
      },
      getDoctorsData: function () {

          let clinic_id = 0 ; 

          if(typeof this.activeClinicId == 'object') {
              clinic_id = this.activeClinicId.id ;
          } else {
              clinic_id = this.activeClinicId ;
          }

          this.doctorMultiselectLoader = true;
        get('get_static_data', {
          data_type: 'clinic_doctors',
          clinic_id: clinic_id
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
      handleSubmit: function () {
         let userRole = this.getUserRole();
          this.loading = true;
          this.submitted = true;
          // stop here if form is invalid
          this.$v.$touch();
          if (this.$v.encounterData.$invalid) {
              this.loading = false;
              return;
          }
          this.encounterData.date = moment(this.encounterData.date).format("YYYY-MM-DD") ;
          if(userRole ==='doctor'){
              this.encounterData.doctor_id = this.userId
          }
          if (validateForm("encounterDataForm")) {
              post('patient_encounter_save', this.encounterData)
                  .then((response) => {
                      this.loading = false;
                      this.submitted = true;
                      if (response.data.status !== undefined && response.data.status === true) {
                          displayMessage(response.data.message);
                          if('patient_id' in this.$route.params){
                              this.$router.push({path: '/patient'})
                          }
                          this.$router.push({
                              name: 'patient-encounter.dashboard', 
                              params: { encounter_id: response.data.data }
                          });
                      } else {
                          displayErrorMessage(response.data.message)
                      }

                  })
                  .catch((error) => {
                      console.log(error);
                      this.loading = false;
                      this.submitted = true;
                      displayErrorMessage(this.formTranslation.common.internal_server_error)
                  })
          }
      },
      defaultEncounterData: function () {
          return {
              date: new Date(),
              clinic_id: {id:''},
              doctor_id: "",
              patient_id:"",
              encounter_template_name:"",
              appointment_id: {},
              description: "",
              added_by: "",
              status: 1,
          }
      },
      handleClinicUnselect: function () {
          this.appointmentData.clinic_id = {};
          this.appointmentData.doctor_id = {};
          this.doctors = [];
      },
      clinicChange(selectedOption) {
      this.encounterData.doctor_id = '';
      this.encounterData.patient_id = '';
        this.doctorMultiselectLoader = true;
      if (this.getUserRole() !== 'doctor') {
        get('get_static_data', {
          data_type: 'get_users_by_clinic',
          clinic_id: selectedOption.id,
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
      if (this.$route.params.patient_id !== undefined) {
        this.encounterData.patient_id = this.$route.params.patient_id;
      } else {
        if (this.getUserRole() !== 'patient') {
          this.getClinicPatients(selectedOption.id)
        }
      }
    },
      getClinicPatients(clinic_id){
        this.patientMultiselectLoader =true;
          get('get_static_data', {
                data_type: 'users',
                user_type: this.patientRoleName,
                request_clinic_id:clinic_id
            })
                .then((response) => {
                  this.patientMultiselectLoader =false;
                    if (response.data.status !== undefined && response.data.status === true) {
                       this.patients = response.data.data;
                    }
                })
                .catch((error) => {
                  this.patientMultiselectLoader =false;
                    console.log(error);
                    displayErrorMessage('Internal server error');
                })
      },  
      getClinicDoctors: function () {
          this.doctors = [];
          let clinic_id = 0 ; 

          if(typeof this.encounterData == 'object') {
              clinic_id = this.encounterData.id ;
          } else {
              clinic_id = this.encounterData ;
          }

          get('get_static_data', {
              data_type: 'clinic_doctors',
              clinic_id: clinic_id
          })
              .then((response) => {
                  if (response.data.status !== undefined && response.data.status === true) {
                      this.doctors = response.data.data;
                  } else {
                      displayErrorMessage(response.data.message)
                  }
              })
              .catch((error) => {
                  console.log(error);
                  displayErrorMessage(this.formTranslation.common.internal_server_error)
              })
      },
      getCloseForm(){
        this.$emit('closeEncounterForm')
      },
      getEncounter(){
        this.$emit('getPatientEncountersData')
      },
    
  },
  computed: {
    clinicID () {
      if(this.$store.state.userDataModule.clinic.id !== undefined) {
        return this.$store.state.userDataModule.clinic.id ;
      }
    },
    isDoctorSelectionEnabled: function () {
        return !(this.getUserRole() !== 'doctor') ;
    },
    userId () {
            return this.$store.state.userDataModule.user.ID;
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    clinic() {
      this.clinicMultiselectLoader = false;
      return this.$store.state.clinic
    }
  },
  watch: {

  }
}
</script>
