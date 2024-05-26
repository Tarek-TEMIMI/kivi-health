<template>
  <div class="row">
    <div class="col-12 col-md-3" v-if="!load">
      <div >
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2><i class="fas fa-chevron-left text-primary" @click="handlePrevClick" ></i></h2>
            <h2 class="text-center text-primary">{{titleList[controllerType]}}</h2>
            <h2><i class="fas fa-chevron-right text-primary" @click="handleNextClick"></i></h2>
          </div>         
          <div class="card-body" v-if="controllerType === 'fieldList'">
            <div class="card-container">
              <div v-for="field in inputType" :key="field.id" class="card d-flex justify-start gap-1 align-items-center cursor-pointer" @click="addNewField(field)">
                <div class="card-icon">
                  <i :class="field.icon"></i>
                </div>
                <div class="card-label">{{ field.label }}</div>
              </div> 
            </div>
          </div>
          <div class="card-body" v-if="controllerType === 'formTitle'">
            <div class="card-container">
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label for="formtext" class="form-control-label ">{{formTranslation.common.form_title}} <span class="text-danger"> *</span></label>
                    <input class="form-control" v-model="customFormData.name.text">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label for="formtext" class="form-control-label ">{{formTranslation.common.form_title_color}} <span class="text-danger"> *</span></label>
                    <select class="form-control" v-model="customFormData.name.color">
                      <option value="text-primary"> {{'Primary'}}</option>
                      <option value="text-secondary"> {{'Secondary'}}</option>
                      <option value="text-warning"> {{'Warning'}}</option>
                      <option value="text-danger"> {{'Danger'}}</option>
                      <option value="text-dark"> {{'Dark'}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label for="formtext" class="form-control-label ">{{formTranslation.common.form_title_alignment}} <span class="text-danger"> *</span></label>
                    <select class="form-control" v-model="customFormData.name.align">
                      <option value="text-center"> {{'Center'}}</option>
                      <option value="text-left"> {{'Left'}}</option>
                      <option value="text-right"> {{'Right'}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body" v-if="controllerType === 'fieldEdit'">
            <div class="card-container">
              <div class="row" v-if="!['heading','hr'].includes(fieldData.type.id)">
                <div class="col-md-12">
                  <div class="form-group mb-2">
                    <label for="label" class="form-control-label ">{{formTranslation.custom_field.label}} <span class="text-danger"> *</span></label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        v-model="fieldData.label"
                        class="form-control"
                        :class="{ ' is-invalid': !fieldValidation.label }"
                        :placeholder="formTranslation.custom_field.field_label_plh"
                        required
                    />
                    <div v-if="!fieldValidation.label"
                                 class="invalid-feedback">
                              {{formTranslation.custom_field.label_required}}
                            </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group mb-2">
                    <label for="type" class="form-control-label"> {{formTranslation.custom_field.input_type}} <span class="text-danger"> *</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          id="type"
                          v-model="fieldData.type"
                          :placeholder="formTranslation.custom_field.input_type_plh"
                          label="label"
                          track-by="id"
                          :class="{ ' is-invalid': !fieldValidation.type }"
                          :options="inputType"
                          required
                          :disabled="editMode"
                      ></multi-select>
                      
                      <div v-if="!fieldValidation.type"
                                 class="invalid-feedback">
                              {{formTranslation.common.input_type + ' ' + formTranslation.common.required}}
                            </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12" v-if="selected_field_type_file_upload">
                  <div class="form-group mb-2">
                    <label for="file_upload_type" class="form-control-label">{{formTranslation.common.file_type}}
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
                          :class="{ ' is-invalid': !fieldValidation.file_upload_type }"
                          :multiple="true"
                      ></multi-select>
                      <div v-if="!fieldValidation.file_upload_type"
                                 class="invalid-feedback">
                              {{formTranslation.common.file_type + ' ' + formTranslation.common.required}}
                            </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12" v-if="['textarea','number','text','multi_select'].includes(fieldData.type.id)">
                  <div class="form-group mb-2">
                    <label for="placeholder" class="form-control-label">{{formTranslation.custom_field.placeholder}}</label>
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
                <div class="col-md-12" v-if="!selected_field_type_file_upload">
                  <div class="form-group mb-2" v-if="!selectDisabled">
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
                          :class="{ ' is-invalid': !fieldValidation.options }"
                          @tag="addOption"
                      ></multi-select>
                    </div>
                    <span class="text-primary"><small>{{formTranslation.common.note_options}}</small></span>                    
                    <div v-if="!fieldValidation.options"
                                 class="invalid-feedback">
                                 {{formTranslation.common.note_options + ' ' + formTranslation.common.required}}
                            </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group mb-2">
                    <label for="isRequired-1" class="form-control-label">
                      {{formTranslation.custom_field.validation}}
                    </label>
                    <div class="px-2">
                      <input type="checkbox"
                      class="kivicare_settings_custom_field_checkbox"
                             id="isRequired-1" v-model="fieldData.is_required"
                             name="isRequired" :checked="fieldData.is_required"
                             >
                      <label for="isRequired-1" class="form-control-label d-inline-block">
                        {{formTranslation.custom_field.mandatory_field}}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="col-md-12" v-if="fieldData.type.id === 'heading'">
                  <div class="form-group mb-2">
                    <label for="label" class="form-control-label ">{{formTranslation.common.heading_title}} <span class="text-danger"> *</span></label>
                    <input
                        type="text"
                        id="label"
                        name="label"
                        v-model="fieldData.label"
                        class="form-control"
                        :class="{ ' is-invalid': !fieldValidation.label }"
                        :placeholder="formTranslation.common.heading_title"
                        required
                    />
                    <div v-if="!fieldValidation.label"
                                 class="invalid-feedback">
                              {{formTranslation.common.heading_title + ' ' + formTranslation.common.required}}
                            </div>
                  </div>
                </div>
                <div class="col-md-12" v-if="fieldData.type.id === 'heading'">
                  <div class="form-group mb-2">
                    <label for="label" class="form-control-label ">{{formTranslation.common.heading_tag}} <span class="text-danger"> *</span></label>
                    <select class="form-control" v-model="fieldData.tag">
                      <option value="h1">{{ 'Heading 1' }}</option>
                      <option value="h2">{{ 'Heading 2' }}</option>
                      <option value="h3">{{ 'Heading 3' }}</option>
                      <option value="h4">{{ 'Heading 4' }}</option>
                      <option value="h5">{{ 'Heading 5' }}</option>
                      <option value="h6">{{ 'Heading 6' }}</option>
                      <option value="p">{{ 'Paragraph' }}</option>
                      <option value="div">{{ 'Div' }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-12 p-0">
                  <div class="form-group mb-2">
                    <label for="class" class="form-control-label ">{{formTranslation.common.class}}</label>
                    <input
                        type="text"
                        id="class"
                        name="class"
                        v-model="fieldData.class"
                        class="form-control"
                        :placeholder="formTranslation.common.add_field_classes"
                        required
                    />
                  </div>
                </div>
            </div>
          </div>
          <div class="card-body" v-if="controllerType === 'formSetting'">
            <div class="card-container">
              <div class="col-md-12">
                  <div class="form-group">
                    <label for="module_type" class="form-control-label">{{formTranslation.common.module_type}} <span class="text-danger"> *</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          id="module_type"
                          v-model="customFormData.module_type"
                          :placeholder="formTranslation.common.module_type"
                          label="label"
                          track-by="id"
                          :options="moduleType"
                          :disabled="editMode"
                      ></multi-select>
                    </div>
                  </div>
                </div>
              <div class="col-md-12">
                  <div class="form-group">
                    <label for="field_status" class="form-control-label">{{formTranslation.common.status}} <span class="text-danger"> *</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          id="field_status"
                          v-model="customFormData.status"
                          :placeholder="formTranslation.custom_field.status_plh"
                          label="label"
                          track-by="id"
                          :options="[{ id: 1, label: formTranslation.common.active }, { id: 0, label: formTranslation.common.inactive }]"
                      ></multi-select>
                    </div>
                  </div>
                </div>
              <div class="col-md-12">
                  <div class="form-group">
                    <label for="form_icon" class="form-control-label">{{formTranslation.common.form_icon}}</label>
                    <div class="kivi-pr">
                      <input
                          id="form_icon"
                          v-model="customFormData.name.icon"
                          :placeholder="formTranslation.common.form_icon_placeholder"
                          class="form-control"
                      >
                    </div>
                  </div>
                </div>
              <div v-if="customFormData.module_type && customFormData.module_type.id === 'appointment_module'">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="field_status" class="form-control-label">{{formTranslation.common.show_if_appointment_status}} <span class="text-danger"> *</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          id="show_mode"
                          v-model="customFormData.conditions.appointment_status"
                          :placeholder="formTranslation.common.show_if_appointment_status"
                          label="label"
                          track-by="id"
                          :options="[
                            {id:'1',label:this.formTranslation.appointments.booked},
                            {id:'2',label:this.formTranslation.appointments.check_out},
                            {id:'4',label:this.formTranslation.appointments.check_in},
                          ]"
                          :multiple="true"
                      ></multi-select>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="show_mode" class="form-control-label">{{formTranslation.common.show_in}} <span class="text-danger"> *</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          id="show_mode"
                          v-model="customFormData.conditions.show_mode"
                          :placeholder="formTranslation.common.show_in"
                          label="label"
                          track-by="id"
                          :options="[
                            {id:'encounter',label:'Encounter'},
                            {id:'appointment',label:'Appointment'},
                          ]"
                          :multiple="true"
                      ></multi-select>
                      <span class="text-primary"><small>{{formTranslation.common.custom_form_appointment_note}}</small></span>
                    </div>
                  </div>
                </div>
              </div>  
              <div class="col-md-12" v-if="userData.addOns.kiviPro == true && ['administrator'].includes(getUserRole())">
                  <div class="form-group">
                    <label for="show_mode" class="form-control-label">{{formTranslation.widgets.clinics}} <span class="text-danger"> *</span></label>
                    <div class="kivi-pr">
                      <multi-select
                          id="show_mode"
                          v-model="customFormData.conditions.clinic_ids"
                          :placeholder="formTranslation.widgets.clinics"
                          label="label"
                          track-by="id"
                          :options="clinics"
                          :multiple="true"
                      ></multi-select>
                      <span class="text-primary"><small>{{formTranslation.common.custom_form_clinic_note}}</small></span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-9" v-if="!load">
      <b-row>
        <div class="page-loader-section" v-if="customFormLoading">
          <loader-component-2></loader-component-2>
        </div>
        <b-col sm="12">
          <form id="customFormDataForm" @submit.prevent="handleSubmit" :novalidate="true">
            <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
              <template v-slot:header>
                <b-row>
                  <b-col sm="12" md="8" lg="8">
                    <h3 class="mb-0">{{ cardTitle }}</h3>
                  </b-col>
                  <b-col sm="12" md="4" lg="4">
                    <div class="d-flex justify-content-end align-items-center">
                      <button type="button" class="btn btn-sm btn-primary d-flex justify-content-center align-items-center" @click="controllerType = 'formSetting'">
                        <i class="fa fa-cogs"></i>{{ formTranslation.common.form_setting }} 
                      </button>
                      <CustomForm :data="customFormData" :fields="customFormData.form_data ? customFormData.form_data : [] " :viewMode="true" :customFormModal="patientCustomFormModal" v-if="patientCustomFormModal" @closeModal="patientCustomFormModal=false"></CustomForm>
                      <button type="button" :class="{'btn btn-sm btn-primary d-flex justify-content-center align-items-center':true,'disabled': customFormData.form_data.length == 0}" @click=" patientCustomFormModal = customFormData.form_data.length !== 0" >
                        <i class="fa fa-eye"></i> {{formTranslation.common.preview}}
                      </button>
                      <button type="button" class="btn btn-sm btn-primary d-flex justify-content-center align-items-center" @click="$router.go(-1);"  v-if="kcCheckPermission('custom_form_list')">
                        <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                      </button>
                    </div>
                  </b-col>
                </b-row>
              </template>
              <div class="p-2" :class="controllerType === 'formSetting' ? ' field-border' : ''">
                <div class="row">
                  <div class="col-12 d-flex justify-content-end" @click="controllerType = 'formSetting'">
                    <i class='fa fa-edit text-primary cursor-pointer' role="button"></i>
                  </div>
                </div>
                <h2 :class="nameClass + (controllerType === 'formTitle' ? ' field-border mb-2' : ' mb-2')" >{{customFormData.name && customFormData.name.text ? customFormData.name.text :''}}&nbsp;<span><i :class="'fa fa-edit ' + (customFormData.name && customFormData.name.color ? customFormData.name.color :'text-primary')"  @click="controllerType = 'formTitle'"></i></span></h2>
                <div class="mt-2">
                  <draggable class="row mb-2" :list="customFormData.form_data" >
                    <div :class="(['hr','heading'].includes(field.type.id) ? 'col-md-12 ' : 'col-md-6 ' )  + (field.name === fieldData.name && controllerType === 'fieldEdit' ? 'field-border' : '')" v-for="(field, index) in customFormData.form_data" :key="index" >
                      <div class="form-group">
                        <div class="d-flex justify-content-between align-items-center">
                          <label v-if="!['heading','hr'].includes(field.type.id)" :for="field.name + '_' + index">{{ field.label }}
                            <span class="text-danger">{{ field.is_required && ['1','true'].includes(field.is_required.toString())  ? '*' : '' }}
                        </span>
                          </label>
                          <span><i class="fa fa-edit text-primary cursor-pointer"  @click="editFormFieldData(field)"></i> &nbsp;<i class="fa fa-trash text-danger cursor-pointer"  @click="deleteField(index)"></i></span>
                        </div>
                        <input
                            v-if="field.type.id === 'text' || field.type.id === 'number'"
                            :id="field.name + '_' + index"
                            :placeholder="field.placeholder"
                            :type="field.type.id"
                            class="form-control"
                            :class="field.class"
                        />
                        <div v-else-if="field.type.id === 'heading'">
                          <component  :is="field.tag ? field.tag : 'h2'" :class="field.class">{{field.label}}</component> 
                        </div>
                        <div v-else-if="field.type.id === 'hr'">
                          <hr :class="field.class">
                        </div>
                        <div v-else-if="field.type.id === 'file_upload'">
                          <div class="input-group kivi-choose-file">
                            <div class="input-group-prepend">
                              <button class="btn btn-primary" :class="field.class"  type="button" :id="field.name + '_' + index" >{{ formTranslation.common.choose_file }}</button>
                            </div>
                            <label class="input-group-text" :for="field.name + '_' + index">{{ formTranslation.common.no_file_chosen }}</label>
                          </div>
                        </div>
                        <b-select
                            v-else-if="field.type.id === 'select'"
                            :id="field.name + '_' + index"
                            class="form-control text-capitalize"
                            :class="field.class"
                        >
                          <option value=""> {{formTranslation.common.select_option}} </option>
                          <option v-for="(option, index) in field.options" :value="option.id" :key="index" >{{ option.text }}</option>
                        </b-select>
                        <div v-else-if="field.type.id === 'radio'">
                          <div v-for="(option, key) in field.options" class="custom-control custom-radio custom-control-inline" :key="key">
                            <input
                                type="radio"
                                :id="field.name + '_' +key"
                                :name="'custom_field_'+field.id"
                                class="custom-control-input"
                                :class="field.class"
                            >
                            <label class="custom-control-label" :for="field.name + '_' +key">{{ option.text }}</label>
                          </div>
                        </div>
                        <div v-else-if="field.type.id === 'checkbox'">
                          <div v-for="(option, key) in field.options" class="custom-control custom-checkbox custom-control-inline" :key="key">
                            <input
                                type="checkbox"
                                :id="field.name + '_' +key"
                                :name="'custom_field_'+field.id"
                                class="custom-control-input"
                                :class="field.class"
                            >
                            <label class="custom-control-label" :for="field.name + '_' +key">{{ option.text }}</label>
                          </div>
                        </div>
                        <div v-else-if="field.type.id === 'calendar'">
                          <input type="date"
                                id="doc_birthdate"
                                :class="field.class"
                          >
                        </div>
                        <textarea
                            v-else-if="field.type.id === 'textarea'"
                            :id="field.name + '_' + index"
                            :placeholder="field.placeholder"
                            :name="'custom_field_'+field.id"
                            class="form-control"
                            :class="field.class"
                        ></textarea>
                        <multi-select
                          v-else-if="field.type.id === 'multi_select'"
                          :id="field.name + '_' + index"
                          :placeholder="field.placeholder"
                          :name="'custom_field_'+field.id"
                          :class="field.class"
                          label="text"
                          track-by="id"
                          :options="field.options"
                          :multiple="true"
                      ></multi-select>
                      </div>
                    </div>
                    <div class="col-md-6 d-flex justify-content-start align-items-center mt-2">
                      <i class="fa fa-plus text-primary cursor-pointer" @click="controllerType = 'fieldList'">&nbsp;Add</i>
                    </div>
                  </draggable>
                </div>
              </div>
              <template v-slot:footer>
                <div class="row">
                  <div class="col-md-12 p-0">
                    <div class="d-flex justify-content-end">
                      <button v-if="!formLoading" class="btn btn-primary rtl-ml-2" type="submit" >
                        <i class="fa fa-save"></i> {{ formTranslation.common.save }}
                      </button>
                      <button v-else class="btn btn-primary" type="submit" disabled>
                        <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                      </button>
                      <button type="button" class="btn btn-outline-danger" @click="$router.go(-1);"> {{formTranslation.common.cancel}}</button>
                    </div>
                  </div>
                </div>
              </template>
            </b-card>
          </form>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import {post, get} from "../../config/request";
import {validateForm, specialCharacters} from "../../config/helper";
import draggable from 'vuedraggable';
import CustomForm from '../CustomForm/Form.vue'

export default {
  components: {draggable,CustomForm},
  data: () => {
    return {
      cardTitle: 'Add custom form',
      moduleType: [
        {"id":"doctor_module","label":"Doctor module"},
        {"id":"patient_module","label":"Patient module"},
        {"id":"patient_encounter_module","label":"Patient encounter module"},
        {"id":"appointment_module","label":"Appointment module"},
      ],
      customFormData: {},
      fieldData: {},
      fieldOptions: [],
      formLoading:false,
      inputType: [
        { id: 'text', label: 'Text', icon: 'fas fa-font' },
        { id: 'number', label: 'Number', icon: 'fas fa-hashtag' },
        { id: 'textarea', label: 'Textarea', icon: 'fas fa-align-left' },
        { id: 'file_upload', label: 'File Upload', icon: 'fas fa-upload' },
        { id: 'multi_select', label: 'Multi Select', icon: 'fas fa-check-double' },
        { id: 'select', label: 'Select', icon: 'fas fa-list' },
        { id: 'radio', label: 'Radio', icon: 'fas fa-dot-circle' },
        { id: 'checkbox', label: 'Checkbox', icon: 'fas fa-check-square'},
        { id: 'calendar', label: 'Calendar', icon: 'fas fa-calendar-alt' },
        { id: 'heading', label: 'Heading', icon: 'fas fa-heading' },
        { id: 'hr', label: 'Hr tag', icon: 'fas fa-horizontal-rule' }
      ],
      file_upload_type_options:[],
      file_upload_type_status:true,
      controllerType:'formSetting',
      fieldValidation:{
        label:false,
        type:false,
        options:false,
        file_upload_type:true
      },
      fieldCount:2,
      titleList:[],
      editMode:false,
      load:true,
      patientCustomFormModal:false,
      customFormLoading:false
    }
  },
  mounted() {
    
    this.titleList = {
      fieldList:'Field list',
      formTitle: 'Edit form name',
      formSetting:'Form settings',
      fieldEdit: 'Edit field',
    }
    this.customFormData = this.defaultCustomFormData(); // This custom field object.
    this.init();
    this.load = false
  },
  methods: {
    init: function () {
      this.moduleType = [
        {"id":"doctor_module","label":this.formTranslation.common.doctor_module},
        {"id":"patient_module","label":this.formTranslation.common.patient_module},
        {"id":"patient_encounter_module","label":this.formTranslation.common.patient_encounter_module},
        {"id":"appointment_module","label":this.formTranslation.common.appointment_module},
      ]

      this.fileUploadData();
      /// Code for the Edit functionality...
      if (this.$route.params.id) {
        this.editMode = true;
        this.cardTitle = 'Edit custom form';
        this.customFormLoading = true;
        get('custom_form_edit', {
          id: this.$route.params.id
        })
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                this.customFormData = response.data.data
                this.fieldCount = this.customFormData.form_data.length;
                this.customFormLoading = false
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.custom_field.record_not_found);
            })

      }
    },
    defaultCustomFormData: function () {
      return {
        name:{
          text:"Form name",
          color:"text-primary",
          align:"text-center",
          tag:"h2",
          icon:'fas fa-book-medical'
        },
        module_type: {'id':'appointment_module','label':'Appointment module'},
        form_data: [
          {
            "label":"Example field 1",
            "type":{"id":"text","label":"Text"},
            "name":"",
            "options":[],
            "is_required":true,
            "placeholder":"Enter field 1",
            "class" :'',
            "name" : 'custom-form-field-1'
          },
          {
            "label":"example field 2",
            "type":{"id":"checkbox","label":"Checkbox"},
            "name":"",
            "options":[{"id":"Yes","text":"Yes"},{"id":"No","text":"No"}],
            "is_required":true,
            "placeholder":"",
            "class" :'',
            "name" : 'custom-form-field-2'
          }
        ],
        status:{
          id: 1, label: this.formTranslation.common.active
        },
        conditions:{
          appointment_status: [
            {id:'1',label:this.formTranslation.appointments.booked},
            {id:'2',label:this.formTranslation.appointments.check_out},
            {id:'4',label:this.formTranslation.appointments.check_in}
          ],
          show_mode: [
            {id:'encounter',label:'Encounter'},
            {id:'appointment',label:'Appointment'},
          ]
        },
  
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
    defaultFieldData: function () {
      this.fieldCount++;
      return {
        label: "",
        type: "",
        name: "",
        options: [],
        is_required: true,
        placeholder: "",
        class:'',
        name:'custom-form-field-'+this.fieldCount
      }
    },
    showErrorField(data,msg){
      this.fieldData = data;
      displayErrorMessage(msg);
      this.controllerType = 'fieldEdit';
    },
    handleSubmit:function(){
      if(!this.customFormData.form_data || !this.customFormData.form_data.length){
        displayErrorMessage(this.formTranslation.common.please_add_form_fields);
        return;
      }
      // if(!this.customFormData.status || !this.customFormData.status.id){
      //   displayErrorMessage(this.formTranslation.common.please_select_form_status);
      //   return;
      // }
      if(!this.customFormData.module_type || !this.customFormData.module_type.id){
        displayErrorMessage(this.formTranslation.common.please_select_module_type);
        return;
      }
      let len = this.customFormData.form_data.length;
      for (let i = 0; i < len; i++) {
        const data = this.customFormData.form_data[i];
        if (!data.label) {
          this.showErrorField(data,this.formTranslation.common.please_enter_field_label);
          return;
        }
        if (!data.type || !data.type.id ) {
          this.showErrorField(data,this.formTranslation.common.please_select_field_type);
          return;
        }
        if ((data.type.id === 'file_upload') && (!data.file_upload_type || data.file_upload_type.length < 1) ) {
          this.showErrorField(data,this.formTranslation.common.please_select_file_types);
          return;
        }
        if ((['select','checkbox','radio','multi_select'].includes(data.type.id)) && (!data.options || data.options.length < 1)) {
          this.showErrorField(data,this.formTranslation.common.please_enter_options);
          return;
        }
      }
      this.formLoading = true;
      if (validateForm("customFormDataForm")) {
        post('custom_form_save', this.customFormData)
            .then((response) => {
              this.formLoading = false;
              if (response.data.status !== undefined && response.data.status === true) {
                displayMessage(response.data.message);
                this.$router.go(-1);
              } else {
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              console.log(error);
              this.formLoading = false;
              displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
      }
    },
    fileUploadData:function(){
      get('custom_field_file_upload_data', {})
          .then((data) => {
            if (data.data.status !== undefined && data.data.status === true) {
              this.file_upload_type_options = data.data.data.file_type_options;
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    addNewField(data){
      const fieldData = this.defaultFieldData();
      fieldData.type = { id:data.id,label:data.label};
      fieldData.label = 'Label';
      if(fieldData.type.id === 'heading'){
        fieldData.is_required = false;
        fieldData.tag = 'h2';
      }else if(fieldData.type.id === 'hr'){
        fieldData.is_required = false;
        fieldData.class = "mb-0"
      }
      this.customFormData.form_data.push({...fieldData});
      this.editFormFieldData(this.customFormData.form_data[this.customFormData.form_data.length - 1]);
    },
    deleteField(index){
      if(this.editMode){
        $.confirm({
            title: this.formTranslation.clinic_schedule.dt_are_you_sure,
            content: 'Delete form field',
            type: 'red',
            buttons: {
                ok: {
                    text: this.formTranslation.common.yes,
                    btnClass: 'btn-danger',
                    keys: ['enter'],
                    action: () => {
                      this.customFormData.form_data.splice(index, 1);
                      this.controllerType = 'fieldList';
                    }
                },
                cancel:{
                    text:this.formTranslation.common.cancel
                }
            }
        });
      }else{
        // If you don't have a route parameter, simply remove the field from the array.
        this.customFormData.form_data.splice(index, 1);
        this.controllerType = 'fieldList';
      }
    },
    editFormFieldData(field){
      this.fieldData = field;
      this.controllerType = 'fieldEdit';
    },
    handlePrevClick() {
      const keys = Object.keys(this.titleList);
      const currentIndex = keys.indexOf(this.controllerType);
      if (currentIndex > 0) {
        this.controllerType = keys[currentIndex - 1];
        if(this.controllerType === 'fieldEdit'){
          if(this.customFormData.form_data.length){
            this.fieldData = this.customFormData.form_data[0]
          }else{
            this.controllerType = 'fieldList';
          }
        }
      }else{
        this.controllerType = 'formSetting';
      }
    },
    handleNextClick() {
      const keys = Object.keys(this.titleList);
      const currentIndex = keys.indexOf(this.controllerType);
      if (currentIndex < keys.length - 1) {
        this.controllerType = keys[currentIndex + 1];
        if(this.controllerType === 'fieldEdit' ){
          if(this.customFormData.form_data.length){
            this.fieldData = this.customFormData.form_data[0]
          }else{
            this.controllerType = 'fieldList';
          }
        }
      }else{
        this.controllerType = 'fieldList';
      }
    },
    openPreview(){

    }
  },

  computed: {
    selectDisabled: function () {
      return !(this.fieldData.type && this.fieldData.type.id ? ['radio','checkbox','select','multi_select'].includes(this.fieldData.type.id) : false);
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    selected_field_type_file_upload:function(){
      return this.fieldData.type && this.fieldData.type.id === 'file_upload';
    },
    nameClass:function (){
      return (this.customFormData.name && this.customFormData.name.color ? this.customFormData.name.color : '')
          + ' ' +(this.customFormData.name && this.customFormData.name.align ? this.customFormData.name.align : '');
    },
    clinics:function(){
      if(this.$store.state.clinic){
        return this.$store.state.clinic
      }else{
        return []
      }
    }
  },
  watch: {
    'fieldData.label' :function(val){
      if(!val){
        this.fieldValidation.label = false;
        return;
      }
      this.fieldValidation.label = true;
    },
    'fieldData.type' :function(val){
      if(!val || !val.id){
        this.fieldValidation.type = false;
        return;
      }
      this.fieldValidation.type = true;
    },
    'fieldData.options' :function(val){
      if(this.fieldData && this.fieldData.type && this.fieldData.type.id && ['radio','checkbox','select','multi_select'].includes(this.fieldData.type.id)){
        if(val === '' || val.length < 1){
          this.fieldValidation.options = false;
          return;
        }      
      }
      this.fieldValidation.options = true;
    },
    'fieldData.file_upload_type' :function(val){
      if(this.fieldData.type && this.fieldData.type.id && ['file_upload'].includes(this.fieldData.type.id)){
        if(!val || val.length < 1){
          this.fieldValidation.file_upload_type = false;
          return;
        }      
      }
      this.fieldValidation.file_upload_type = true;
    },
    'customFormData.module_type.id' :function(val){
      if(val === 'appointment_module'){
        // if(!this.customFormData.conditions.appointment_status){
        //   this.customFormData.conditions.appointment_status = [
        //     {id:'1',label:this.formTranslation.appointments.booked},
        //     {id:'2',label:this.formTranslation.appointments.check_out},
        //     {id:'4',label:this.formTranslation.appointments.check_in}
        //   ];
        // }
        // if(!this.customFormData.conditions.show_mode){
        //   this.customFormData.conditions.show_mode = [
        //     {id:'encounter',label:'Encounter'},
        //     {id:'appointment',label:'Appointment'},
        //   ];
        // }
      }
      // if(!this.customFormData.conditions.clinic_ids){
      //   this.customFormData.conditions.clinic_ids = [];
      // }
    }
  }
}
</script>
<style>
#doc_birthdate {
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  background-color: #fff;
  padding: 3px 5px;
  box-shadow: inset 0 3px 6px rgba(0,0,0,0.1);
  /* width: 190px; */
  width: 100%;
  height: 45px;
  color:#8c9cad
}
#doc_birthdate ::placeholder{
  color:#8c9cad
}
.field-border{
  border: solid 1px var(--primary);
  border-style: dashed;
}
</style>