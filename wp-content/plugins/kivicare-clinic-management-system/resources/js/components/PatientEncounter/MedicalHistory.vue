<template>
  <b-row>
    <b-col sm="12">
      <div class="card p-0 shadow">
        <div class="card-header">
          <h3 class="mb-0">{{ recordData.title }}</h3>
        </div>
        <div class="card-body medical-history-card p-0">
          <div class="col-md-12">
            <ul v-if="medicalHistoryList.length > 0" class="list-group list-group-flush">
              <li v-for="(history, index) in medicalHistoryList" class="animated fadeInUp list-group-item" v-if="history !== undefined" :key="index">
                {{ index + 1 }}.
                {{ history.title }}
                <i v-if="ecounterStatus != 0 && getUserRole() != 'patient' && kcCheckPermission('medical_records_delete')" class="float-right fa fa-times font-weight-bold text-danger cursor-pointer"  v-b-tooltip.hover :title="formTranslation.common.remove" @click="deleteMedicalHistoryData(++index)"></i>
              </li>
            </ul>
            <div v-else-if="medicalHistoryListLoader" class="h2 font-weight-bold mb-0 text-center">
              <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
            </div>
            <h4 v-else class="text-center small text-danger p-3">{{formTranslation.common.no_records_found}}</h4>
          </div>
        </div>
        <div class="card-footer" v-if="kcCheckPermission('medical_records_add') && encounterStatus === '1'">
          <form id="historyDataForm" @submit.prevent="handleSubmitForm" :novalidate="true">
            <div class="row">
              <div class="col-md-12" v-if="medicalHistory.type === 'note'">
                <div class="form-group mb-0">
                  <label for="title" class="sr-only">{{formTranslation.common.title}}</label>
                  <b-form-textarea  v-if="ecounterStatus != 0" class="form-control" v-model="medicalHistory.title" id="title" :placeholder="'Enter ' + recordData.title">
                  </b-form-textarea>
                  <div v-if="submitted && !$v.medicalHistory.title.required"
                       class="invalid-feedback">
                    {{ recordData.title }} {{formTranslation.patient_encounter.is_required}}
                  </div>
                </div>
              </div>
              <div class="col-md-12 text-center mt-3" v-if="ecounterStatus != 0 && medicalHistory.type === 'note'">
                <button v-if="!loading" class="btn btn-sm btn-block btn-primary" type="submit">
                  <i class="fa fa-plus"></i> {{ formTranslation.encounter_dashboard.add_btn }}
                </button>
                <button v-else class="btn btn-sm btn-block btn-primary" type="submit" disabled>
                  <i class="fa fa-sync fa-spin"></i>&nbsp; {{formTranslation.common.loading}}
                </button>
              </div>
              <div v-else-if="ecounterStatus != 0" class="col-md-12">
                <multi-select
                  deselect-label=""
                  select-label=""
                  :id="medicalHistory.type"
                  @select="clinical_detail_select"
                  :tag-placeholder="tagPlaceholder"
                  :placeholder="placeholder"
                  :options="medical_options"
                  @tag="addNewMedicalRecord"
                  :taggable="true"
                  :loading="specializationMultiselectLoader"
                >
                </multi-select>
                <div class="mt-2 clinical_details_notes" >
                  <span v-if="recordData.title === 'Problems'" class="text-primary small font-weight-bold">{{formTranslation.patient_encounter.note_problem}}</span>
                  <span v-else-if="recordData.title === 'Observations'" class="text-primary small font-weight-bold">{{formTranslation.patient_encounter.note_observation}}</span>
                </div>
                <div v-if="submitted && !$v.medicalHistory.title.required"
                     class="invalid-feedback">
                  {{ recordData.title  }} {{formTranslation.patient_encounter.is_required}}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>

import {post,get} from "../../config/request";
import {required} from "vuelidate/lib/validators";
import {validateForm} from "../../config/helper";

export default {
  validations: {
    medicalHistory: {
      title: {required},
      encounter_id: {required},
      type: {required},
    },
  },
  props: {
    recordData: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
    ecounterStatus: 0,
    isEcounterTemplateModule:false,
    updateCounter:0
  },
  data: () => {
    return {
      medicalHistoryList: [],
      medicalHistory: {},
      buttonText: '<i class="fa fa-plus"></i> Add',
      loading: false,
      submitted: false,
      medical_options:[],
      medicalHistoryListLoader:true,
      specializationMultiselectLoader:false
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      this.medicalHistory = this.defaultFormData();
      // this.medicalHistory.encounter_id = this.recordData.encounter_id
      this.medicalHistory.type = this.recordData.type
    },
    defaultFormData: function () {
      return {
        title: '',
        type: '',
        encounter_id: '',
      }
    },
    handleSubmitForm: function () {
      this.loading = true;

      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.medicalHistory.$invalid) {
        this.loading = false;
        return;
      }

      if (validateForm("historyDataForm")) {
        post(!this.isEcounterTemplateModule? 'medical_history_save':'save_encounter_template_medical_history', this.medicalHistory)
            .then((response) => {
              this.loading = false;
              if ((response.data.status !== undefined && response.data.status === true) || (response?.data?.success=== true)) {
                //displayMessage(response.data.message);
                this.submitted = false;
                this.medicalHistoryList.push(response.data.data)
                this.medicalHistory = this.defaultFormData();
                this.medicalHistory.encounter_id = this.recordData.encounter_id
                this.medicalHistory.type = this.recordData.type

              } else {
                displayErrorMessage(response.data.message)
              }

            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
      }
    },
    deleteMedicalHistoryData: function (index) {
      if (this.medicalHistoryList[index - 1] !== undefined) {
        get(!this.isEcounterTemplateModule? 'medical_history_delete' : 'delete_encounter_template_medical_history', {
          id: this.medicalHistoryList[index - 1].id
        })
            .then((data) => {
              if ((data.data.status !== undefined && data.data.status === true) || (data?.data?.success=== true)) {
                this.medicalHistoryList.splice((index - 1), 1);
                displayMessage(data.data.message);
              }
            })
            .catch((error) => {

              if (error.response.data !== undefined && error.response.data.message !== undefined) {
                displayErrorMessage(error.response.data.message);
              } else {
                displayErrorMessage(this.formTranslation.common.internal_server_error);;
              }

            })
      }
    },
    addNewMedicalRecord: function (value) {
      let specialitiesObj = {
        type: '',
        label: value,
        status: { id: 1, label: 'Active' }
      }
      if(this.medicalHistory.type === 'problem'){
        specialitiesObj.type = {
          "id": "clinical_problems",
          "type": "clinical problems"
        }
      }else{
        specialitiesObj.type = {
          "id": "clinical_observations",
          "type": "clinical Observations"
        }
      }

      this.medical_options.push(value)
      this.medicalHistory.title = value
      post('static_data_save', specialitiesObj)
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.handleSubmitForm();
            } else {
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
    },
    clinical_detail_select(selected_value){
      this.medicalHistory.title = selected_value
      console.log(selected_value);
      this.handleSubmitForm();
    },
    get_medical_options(){
      let type = '';
      if(this.medicalHistory.type === 'problem'){
        type = "clinical_problems"
      }else{
        type ="clinical_observations"
      }
      let _this = this;
      
      get('get_static_data', {
        data_type: 'static_data_with_label',
        static_data_type: type
      })
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              if(response.data.data.length > 0){
                _this.medical_options = [];
                response.data.data.map((value,key) =>{
                  _this.medical_options.push(value.label)
                })
              }
            }
          })
          .catch((error) => {
            console.log(error);
          })
    }
  },
  watch: {
    recordData(val, oldVal) {
      this.medicalHistory.encounter_id = val.encounter_id
      this.medicalHistory.type = val.type
      if(this.medicalHistory.type !== 'note'){
        this.get_medical_options();
      }
    },
    updateCounter(){
      this.medicalHistoryList.length = 0 
      this.medicalHistoryListLoader = true
    }
  },
  computed: {
    encounterStatus() {
      return this.recordData.status !== undefined ? this.recordData.status : '1'
    },
    tagPlaceholder() {
      if (this.recordData.type === 'problem') {
        return this.formTranslation.patient_encounter.select_problem;
      } else if (this.recordData.type === 'observation') {
        return this.formTranslation.patient_encounter.select_observation;
      } else {
        return 'Select ' + this.recordData.type;
      }
    },
    placeholder() {
      if (this.recordData.type === 'problem') {
        return this.formTranslation.patient_encounter.select_problem;
      } else if (this.recordData.type === 'observation') {
        return this.formTranslation.patient_encounter.select_observation;
      } else {
        return 'Select ' + this.recordData.type;
      }
    },
  }
}
</script>
