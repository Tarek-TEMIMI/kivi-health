<template>
    <b-row>
        <b-col sm="12">
            <form id="customFieldDataForm" @submit.prevent="handleSubmit" :novalidate="true">
                <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                    <template v-slot:header>
                        <b-row>
                            <b-col sm="12" md="8" lg="8">
                                <h3 class="mb-0">{{ cardTitle }}</h3>
                            </b-col>
                            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('custom_field_list')">
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                                        <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                                    </button>
                                </div>
                            </b-col>
                        </b-row>
                    </template>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="module_type" class="form-control-label">
                                    {{formTranslation.common.module}} <span class="text-danger">*</span>
                                </label>
                                <div class="kivi-pr">
                                    <multi-select
                                        deselect-label=""
                                        select-label=""
                                        v-model="customFieldData.module_type"
                                        id="module_type"

                                        class="text-capitalize"
                                        :tag-placeholder="formTranslation.custom_field.tag_module_plh"
                                        :placeholder="formTranslation.custom_field.select_module_plh"
                                        label="label" track-by="id"
                                        :options="getUserRole() !== 'doctor' ? moduleType : doctorType"
                                        @input="onChangeModule"

                                    ></multi-select>
                                    <span class="select_clear_btn"  @click="customFieldData.module_type = ''">×</span>
                                </div>
                                <div v-if="submitted && !$v.customFieldData.module_type.required"
                                    class="invalid-feedback">
                                    {{formTranslation.clinic_schedule.module_type_required}}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4" v-if="getUserRole() !== 'doctor'">
                            <div class="form-group">
                                <label for="specialties" class="form-control-label">
                                    {{formTranslation.common.doctor}}
<!--                                  <span class="text-danger">*</span>-->
                                </label>
                                <div class="kivi-pr">
                                    <multi-select
                                        deselect-label=""
                                        select-label=""
                                        v-model="customFieldData.module_id"
                                        id="select-module-type-id"
                                        :tag-placeholder="formTranslation.custom_field.tag_doctors_plh"
                                        :placeholder="formTranslation.custom_field.doctors_plh"
                                        label="label"
                                        track-by="id"
                                        :options="doctors"
                                        :loading="doctorMultiselectLoader"
                                        :searchable="true"
                                        :disabled="!isDoctorSelectionEnabled"
                                        :multiple="multiple" :taggable="taggable"
                                    >
                                    </multi-select>
                                    <span class="select_clear_btn"  @click="customFieldData.module_id = ''">×</span>
                                  </div>
                                  <span class="text-primary small"><b>{{formTranslation.common.tax_doctor_note}}</b></span>
                                <!-- <div v-if="submitted && !$v.customFieldData.module_id.required" class="invalid-feedback">
                                    {{formTranslation.appointments.doc_required}}
                                </div> -->
                            </div>
                        </div>
                        <div class="col-md-4">
                          <div class="from-group">
                            <div v-if="showDoctorModule">
                                <label for="label" class="form-control-label ">{{formTranslation.custom_field.label}} <span class="text-danger"> *</span>
                                    <span id="doctorModule" class="cursor-pointer">({{formTranslation.custom_field.where_it_look_like}} <i class="fa fa-question-circle " ></i>)</span>
                                </label>
                                <b-tooltip target="doctorModule" triggers="hover" class="test">
                                  <span> {{formTranslation.custom_field.shows_in_doc_creation_form}}</span>
                                </b-tooltip>
                            </div>
                            <div v-if="showEncounterModule">
                                <label for="label" class="form-control-label ">{{formTranslation.custom_field.label}} <span class="text-danger"> *</span>
                                    <span id="encounterModule" class="cursor-pointer">({{formTranslation.custom_field.where_it_look_like}} <i class="fa fa-question-circle " ></i>) </span>
                                </label>
                                <b-tooltip target="encounterModule" triggers="hover" classd="test">
                                  <span> {{formTranslation.custom_field.shows_in_patient_encounter_dashboard}}</span>
                                </b-tooltip>
                            </div>
                            <div v-if="showPatientModule">
                                <label for="label" class="form-control-label ">{{formTranslation.custom_field.label}} <span class="text-danger"> *</span>
                                    <span id="patientModule" class="cursor-pointer">({{formTranslation.custom_field.where_it_look_like}} <i class="fa fa-question-circle "></i>) </span>
                                </label>
                                <b-tooltip target="patientModule" triggers="hover" class="test">
                                  <span> {{formTranslation.custom_field.shows_in_patient_creation_form}}</span>
                                </b-tooltip>
                            </div>
                             <div v-if="showAppointmentModule">
                                <label for="label" class="form-control-label ">{{formTranslation.custom_field.label}} <span class="text-danger"> *</span>
                                    <span id="appointmentModule" class="cursor-pointer">({{formTranslation.custom_field.where_it_look_like}} <i class="fa fa-question-circle "></i>) </span>
                                </label>
                                <b-tooltip target="appointmentModule" triggers="hover" class="test">
                                  <span> {{formTranslation.custom_field.shows_in_patient_creation_form}}</span>
                                </b-tooltip>
                            </div>
                            <input
                                type="text"
                                id="label"
                                name="label"
                                v-model="fieldData.label"
                                class="form-control"
                                :class="{ ' is-invalid': submitted && $v.fieldData.label.$error }"
                                :placeholder="formTranslation.custom_field.field_label_plh"
                                required
                            />
                            <span class="text-primary" v-if="fieldData.name !== ''"><small>({{formTranslation.custom_field.filed_name}} "{{ fieldData.name }}")</small></span>
                            <div v-if="submitted && !$v.fieldData.label.specialCharacters" class="invalid-feedback">
                              {{formTranslation.custom_field.invalid_label_name}}
                            </div>
                            <div v-if="submitted && !$v.fieldData.label.required"
                                 class="invalid-feedback">
                              {{formTranslation.custom_field.label_required}}
                            </div>
                            <div v-if="submitted && uniqueFieldName"
                                 class="invalid-feedback">
                              {{formTranslation.custom_field.field_name_used}}
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                          <div class="from-group">
                            <label for="type" class="form-control-label"> {{formTranslation.custom_field.input_type}} <span class="text-danger"> *</span></label>
                            <div class="kivi-pr">
                                <multi-select
                                    id="type"
                                    v-model="fieldData.type"
                                    :placeholder="formTranslation.custom_field.input_type_plh"
                                    label="label"
                                    track-by="id"
                                    :options="inputType"
                                    required
                                ></multi-select>
                                <span class="select_clear_btn"  @click="fieldData.type = ''">×</span>
                            </div>
                            <div v-if="submitted && !$v.fieldData.type.required"
                                 class="invalid-feedback">
                              {{formTranslation.custom_field.input_type_required}}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4" v-if="selected_field_type_file_upload">
                            <div class="from-group">
                            <label for="file_upload_type" class="form-control-label">{{formTranslation.common.file_type}}test
                             <span class="text-danger">*</span>
                            </label>
                            <div class="kivi-pr">
                                <multi-select
                                    deselect-label=""
                                    select-label=""
                                    id="file_upload_type"
                                    v-model="fieldData.file_upload_type"
                                    :tag-placeholder="formTranslation.common.select_allowed_file_type"
                                    :placeholder="formTranslation.common.select_allowed_file_type"
                                    label="text"
                                    track-by="id"
                                    :options="file_upload_type_options"
                                    :multiple="true"
                                ></multi-select>
                            </div>
                            <div v-if="submitted && !file_upload_type_status"
                                 class="invalid-feedback">
                              {{formTranslation.common.file_type + ' ' +formTranslation.common.required}}
                            </div>
                            <span class="text-primary" >
                              <small>{{formTranslation.common.accept_all_file_type}}</small>
                            </span>
                            </div>
                        </div>
                        <div class="col-md-4" v-else>
                            <div class="from-group">
                            <label for="placeholder" class="form-control-label col-md-4">{{formTranslation.custom_field.placeholder}}</label>
                            <input
                                type="text"
                                id="placeholder"
                                name="placeholder"
                                v-model="fieldData.placeholder"
                                class="form-control"
                                :placeholder="formTranslation.custom_field.placeholder_plh"
                                required
                            />
                            </div>
                        </div>
                        <div class="col-md-4" v-if="!selected_field_type_file_upload">
                            <div class="from-group">
                            <label for="options" class="form-control-label">{{formTranslation.custom_field.options}}</label>
                            <div class="kivi-pr">
                                <multi-select
                                    deselect-label=""
                                    select-label=""
                                    id="options"
                                    v-model="fieldData.options"
                                    :tag-placeholder="formTranslation.custom_field.tag_add_new_option_plh"
                                    :placeholder="formTranslation.custom_field.serach_plh"
                                    label="text"
                                    track-by="id"
                                    :options="fieldOptions"
                                    :multiple="true"
                                    :taggable="true"
                                    :disabled="selectDisabled"
                                    @tag="addOption"
                                ></multi-select>
                                <span class="select_clear_btn"  @click="fieldData.options = ''"> × </span>
                            </div>
                            <span class="text-primary"><small>{{formTranslation.common.note_options}}</small></span>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-4">
                            <div class="form-group">
                            <label for="isRequired-1" class="form-control-label">
                                {{formTranslation.custom_field.validation}}
                            </label>
                            <div class="col-md-12">
                            
                                  <input type="checkbox" class="kivicare_settings_custom_field_checkbox" id="isRequired-1" v-model="fieldData.isRequired" name="isRequired" :checked="fieldData.isRequired">
                              
                              {{formTranslation.custom_field.mandatory_field}}
<!--                                <b-form-checkbox id="isRequired-1" v-model="fieldData.isRequired" name="isRequired" size="lg">-->
<!--                                {{formTranslation.custom_field.mandatory_field}}-->
<!--                                </b-form-checkbox>-->
                            </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="field_status" class="form-control-label">{{formTranslation.common.status}} <span class="text-danger"> *</span></label>
                                <div class="kivi-pr">
                                    <multi-select
                                        id="field_status"
                                        v-model="fieldData.status"
                                        :placeholder="formTranslation.custom_field.status_plh"
                                        label="label"
                                        track-by="id"
                                        :options="[{ id: 1, label: formTranslation.common.active }, { id: 0, label: formTranslation.common.inactive }]"
                                    ></multi-select>
                                    <span class="select_clear_btn"  @click="fieldData.status = ''"> × </span>
                                </div>
                                <div
                                    v-if="submitted && !$v.fieldData.status.required"
                                    class="invalid-feedback">
                                    {{formTranslation.appointments.status_required}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-slot:footer>
                        <div class="row">
                            <div class="col-md-12 p-0">
                                <div class="d-flex justify-content-end">
                                    <button v-if="!loading" class="btn btn-primary rtl-ml-2" type="submit">
                                      <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                                    </button>
                                    <button v-else class="btn btn-primary" type="submit" disabled>
                                        <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                                    </button>
                                    <button type="button" class="btn btn-outline-primary" @click="$router.go(-1);"> {{formTranslation.common.cancel}}</button>
                                </div>
                            </div>
                        </div>
                    </template>
                </b-card>
            </form>
        </b-col>
    </b-row>
</template>

<script>
import {required, requiredIf, numeric,requiredUnless} from "vuelidate/lib/validators";
import {post, get} from "../../config/request";
import {validateForm, specialCharacters} from "../../config/helper";

export default {
    data: () => {
        return {
            visible: false,
            cardTitle: 'Add custom field',
            fieldTitle: 'Add new field',
            moduleType: [
                {"id":"doctor_module","label":"Doctor module"},
                {"id":"patient_module","label":"Patient module"},
                {"id":"patient_encounter_module","label":"Patient encounter module"},
            ],
          
            doctorType:[
                {"id":"patient_module","label":"Patient module"},
                {"id":"patient_encounter_module","label":"Patient encounter module"},

            ],
            customFieldData: {},
            fieldData: {},
            fieldButtonText: '<i class="fa fa-plus"></i> Add field',
            fieldSubmitted: false,
            fieldEdit: false,
            fieldOptions: [],
            loading: false,
            submitted: false,
            buttonText: '<i class="fa fa-save"></i> Save',
            inputType: [
              { id: 'text', label: 'Text' },
              { id: 'number', label:'Number' }, 
              { id:'textarea', label:'Textarea' },
              { id:'file_upload', label:'File Upload' }, 
              { id:'select', label:'Select' }, 
              { id:'multiselect', label:'Multi select' }, 
              { id:'radio', label:'Radio' }, 
              { id:'checkbox', label:'Checkbox' },
              { id:'calendar', label:'Calendar' },
            ],
            fieldEditId: "",
            uniqueFieldName: false,
            doctors: [],
            doctorModuleImage: window.request_data.kiviCarePluginURL + 'assets/images/doctorModule.png',
            encounterModuleImage: window.request_data.kiviCarePluginURL + 'assets/images/encounterModule.png',
            patientModuleImage: window.request_data.kiviCarePluginURL + 'assets/images/patientModule.png',
            showDoctorModule:true,
            showEncounterModule:false,
            showPatientModule:false,
           showAppointmentModule:false,
            multiple:false,
            taggable:false,
           doctorMultiselectLoader:true,
           file_upload_type_options:[],
           file_upload_size_options:[],
          file_upload_max_size_msg:'',
          file_upload_type_status:true
        }
    },
    validations: {
        customFieldData: {
            module_type: {required},
            // module_id: {
            //     required: requiredIf((isDoctorSelectionEnabled) => {
            //       if(isDoctorSelectionEnabled.module_type.id == "appointment_module"){
            //           return true;
            //       }
            //       // return !isDoctorSelectionEnabled ;
            //     }),
            // }
        },
        fieldData: {
            label: {
                required,
                specialCharacters: specialCharacters
            },
            type: {required},
            status: {required},
            isRequired: {},
        }
    },
    mounted() {
        this.cardTitle = this.formTranslation.custom_field.add_custom_field;
        this.customFieldData = this.defaultCustomFieldData(); // This custom field object.
        this.fieldData = this.defaultFieldData(); // This is inner field object.
        this.init();
        if(this.userData.addOns.kiviPro === true){
          if(this.getUserRole() !== 'doctor'){
            this.moduleType = [
                  {"id":"doctor_module","label":this.formTranslation.common.doctor_module},
                  {"id":"patient_module","label":this.formTranslation.common.patient_module},
                  {"id":"patient_encounter_module","label":this.formTranslation.common.patient_encounter_module},
                  {"id":"appointment_module","label":this.formTranslation.common.appointment_module},
            ];
          }else{
                this.doctorType= [
                    {"id":"patient_module","label":this.formTranslation.common.doctor_module},
                    {"id":"patient_encounter_module","label":this.formTranslation.common.patient_encounter_module},
                    {"id":"appointment_module","label":this.formTranslation.common.appointment_module},
                ];
          }
         
        }
    },
    methods: {
        init: function () {
          this.getDoctorsData();
          this.fileUploadData();

          /// Code for the Edit functionality...
          if (this.$route.params.id !== undefined) {

            this.cardTitle = this.formTranslation.custom_field.edit_custom_field;
            this.buttonText = '<i class="fa fa-save"></i> '+this.formTranslation.common.save;

            get('custom_field_edit', {
              id: this.$route.params.id
            })
                .then((response) => {
                  if (response.data.status !== undefined && response.data.status === true) {
                    this.customFieldData = response.data.data
                    this.fieldData = response.data.data.fields
                  }
                })
                .catch((error) => {
                  console.log(error);
                  displayErrorMessage(this.formTranslation.custom_field.record_not_found);
                })

          }
        },
        defaultCustomFieldData: function () {
            return {
                module_type: '',
                module_id: '',
                fields: {},
            }
        },
        defaultFieldData: function () {
            return {
                id:'',
                label: "",
                type: "",
                name: "",
                options: [],
                isRequired: 0,
                priority: 0,
                placeholder: "",
                status:{
                  id: 1, label: this.formTranslation.common.active
                }
            }
        },
        onChangeModule:function (selectedOption){
          if(selectedOption.id == "doctor_module"){
            this.multiple=false
            this.taggable=false
            this.showEncounterModule = false;
            this.showPatientModule=false
            this.showAppointmentModule = false
            this.showDoctorModule=true
          }else if(selectedOption.id == "patient_module"){
            this.multiple=false
            this.taggable=false
            this.showDoctorModule=false
            this.showEncounterModule = false;
            this.showAppointmentModule = false
            this.showPatientModule= true
          }else if(selectedOption.id == "appointment_module"){
            this.showDoctorModule=false
            this.showPatientModule=false
            this.showEncounterModule = false;
            this.showAppointmentModule = true
          }
          else{
            this.showDoctorModule=false
            this.showPatientModule=false
            this.showAppointmentModule = false
            this.showEncounterModule = true
          }
        },
        addOption: function (newOption) {
          const tag = {
            id: newOption,
            text: newOption
          }
          this.fieldOptions.push(tag)
          this.fieldData.options.push(tag)
        },
        handleSubmit:function(){
          this.loading = true;
          this.submitted = true;
          this.addFieldData();
          this.$v.$touch();
          if (this.$v.fieldData.$invalid) {
            this.loading = false;
            return;
          }
          if(this.fieldData.type && this.fieldData.type.id === 'file_upload'){
            if(!this.fieldData.file_upload_type || this.fieldData.file_upload_type.length < 1){
              this.file_upload_type_status = false;
              this.loading = false;
              return;  
            }
          }
          if (this.$v.customFieldData.$invalid) {
            this.loading = false;
            return;
          }
          if (validateForm("customFieldDataForm")) {
            post('custom_field_save', this.customFieldData)
                .then((response) => {
                  this.loading = false;
                  if (response.data.status !== undefined && response.data.status === true) {
                    displayMessage(response.data.message);
                    this.$router.go(-1);
                  } else {
                    displayErrorMessage(response.data.message)
                  }

                })
                .catch((error) => {
                  console.log(error);
                  this.loading = false;
                  displayErrorMessage(this.formTranslation.common.internal_server_error)
                })
          }
        },
        addFieldData: function () {
          this.customFieldData.fields = [this.fieldData];
        },
        getDoctorsData: function () {
          this.doctorMultiselectLoader = true;
          get('get_static_data', {
            data_type: 'doctors',
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
        deleteFieldData: function (index) {
          if (index !== undefined) {
            $.confirm({
              title: this.formTranslation.custom_field.are_you_sure,
              content: this.formTranslation.custom_field.press_yes_to_delete,
              type: 'red',
              buttons: {
                ok: {
                  text: this.formTranslation.common.yes,
                  btnClass: 'btn-danger',
                  keys: ['enter'],
                  action: () => {
                    if (this.customFieldData.fields[index - 1] !== undefined) {
                      this.customFieldData.fields.splice((index - 1), 1);
                      this.fieldData = this.defaultFieldData();
                    }
                  }
                },
                cancel: {
                  text:this.formTranslation.common.cancel
                }
              }
            });
          } else {
            displayErrorMessage(this.formTranslation.custom_field.doctor_profile_data_not_found)
          }
        },
        editFieldData: function (index) {
          this.visible = !this.visible ;
          this.fieldTitle = this.formTranslation.custom_field.edit_field;
          this.fieldEdit = true;
          this.fieldButtonText = '<i class="fa fa-save"></i> '+this.formTranslation.custom_field.save_field;
          this.fieldEditId = index - 1;

          this.fieldData = this.customFieldData.fields[index - 1];
        },
        optionToString: function (options) {
          let optionArray = [];
          if (options.length === 0) {
            return ' - ';
          }
          options.map((option) => {
            optionArray.push(option.id);
          })

          return optionArray.join(', ');
        },
        fileUploadData:function(){
          get('custom_field_file_upload_data', {})
            .then((data) => {
              if (data.data.status !== undefined && data.data.status === true) {
                this.file_upload_size_options = data.data.data.file_size_options;
                this.file_upload_type_options = data.data.data.file_type_options;
                this.file_upload_max_size_msg = data.data.data.allowed_size;
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
        }
    },

    computed: {
      selectDisabled: function () {
        if (this.fieldData.type !== undefined) {
          return ( this.fieldData.type.id === 'text' || this.fieldData.type.id === 'number' || this.fieldData.type.id === 'textarea' ? true : false);
        }
      },
      isDoctorSelectionEnabled: function () {
        return !(this.getUserRole() !== 'doctor' && (this.customFieldData.module_type !== undefined && this.customFieldData.module_type !== null && ( this.customFieldData.module_type.id === 'doctor_module' || this.customFieldData.module_type.id === 'patient_module' || this.customFieldData.module_type.id === 'patient_encounter_module' )  )) ;
      },
      userData() {
        return this.$store.state.userDataModule.user;
      },
      selected_field_type_file_upload:function(){
        return this.fieldData.type && this.fieldData.type.id === 'file_upload';
      }
    },
    watch: {
      'customFieldData.module_type' :function(newVal){
        if(newVal.id === 'appointment_module'){
          // this.inputType = this.inputType.filter((index) => index.id !== 'file_upload');
          if(this.fieldData.type === 'file_upload'){
            this.fieldData.type = '';
          }
          return;
        }
        if (!this.inputType.find(item => item.id === 'file_upload')) {
          this.inputType.push({label:'File upload',id:'file_upload'});
        }
      },
      'fieldData.file_upload_type' :function(newVal){
        if(!this.file_upload_type_status && this.fieldData.file_upload_type 
        && this.fieldData.file_upload_type.length > 0){
          this.file_upload_type_status = true;
        }
      }
    }
}
</script>
