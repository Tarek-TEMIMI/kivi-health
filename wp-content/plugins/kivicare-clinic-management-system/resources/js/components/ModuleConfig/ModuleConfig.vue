<template>
    <div>
      <div class="page-loader-section" v-if="formLoader">
        <loader-component-2></loader-component-2>
      </div>
      <div v-else>
        <div class="row mt-2" v-for="(values, index) in moduleList" :key="index">
          <div class="col-md-12" v-if="values.length > 0">
            <h4 class="text-capitalize text-primary">{{ index | moduleLabelFilter }}</h4>
            <div class="ml-3" v-for="(value, index) in values" :key="index">
              <b-form-checkbox v-model="value.status" unchecked-value="0" value="1" name="check-button">
                <b> {{ value.label }} </b>
              </b-form-checkbox>
            </div>
          </div>
        </div>
        <div  class="row" v-if="userData.addOns.kiviPro == true">
          <div   class="col-md-12" >
            <h4 class="text-capitalize text-primary">{{formTranslation.patient_encounter.encounter_module}}</h4>
            <div class="ml-3" v-for="(data, index) in encounter_module" :key="index">
              <div v-for="(en, index) in data" :key="index">
                <b-form-checkbox v-model="en.status" unchecked-value="0" value="1" name="check-button">
                  <b> {{ en.label }} </b>
                </b-form-checkbox>
              </div>
            </div>
          </div>
        </div>
        <br>
        <div class="row" v-if="userData.addOns.kiviPro == true">
          <div   class="col-md-12" >
            <h4 class="text-capitalize text-primary">{{formTranslation.reports.prescription_module}}</h4>
            <div class="ml-3" v-for="(data, index) in prescription_module" :key="index">
              <div v-for="(en, index) in data" :key="index">
                <b-form-checkbox v-model="en.status" unchecked-value="0" value="1" name="check-button">
                  <b> {{ en.label }} </b>
                </b-form-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import {post, get} from "../../config/request";
import UniqueIdSetting from "../../views/Patient/UniqueIdSetting";
export default {
    data: () => {
        return {
            moduleList: [],
            encounter_module:[],
            prescription_module:[],
            moduleConfigMessage: {
                module_config: '',
            },
          request_status:'0',
          formLoader:true
        }
    },
    mounted() {
        this.init();
        // displayTooltip();
    },

    filters: {
        moduleLabelFilter: function (labelValue) {
            return labelValue.replace("_", " ");
        }
    },
      components:{
        UniqueIdSetting
      },
    methods: {
        init: function () {
            this.getModules();
            // this.getEncounterModules();
            // this.getPrescriptionModules();
        },
        getModules: function () {
            this.formLoader =true;
            get('module_list', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.moduleList = response.data.data
                        if(window.request_data.proActive && response.data.encounter != undefined && typeof response.data.encounter.status != undefined &&response.data.encounter.status == true){
                          this.encounter_module = response.data.encounter.data
                        }
                        if(window.request_data.proActive && response.data.prescriptionModules != undefined && typeof response.data.prescriptionModules.status != undefined &&response.data.prescriptionModules.status == true){
                          this.prescription_module = response.data.prescriptionModules.data
                        }
                    }
                  this.formLoader =false;
                })
                .catch((error) => {
                  this.formLoader =false;
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        getEncounterModules: function () {
            post('encounter_module_list', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.encounter_module = response.data.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        getPrescriptionModules: function () {
            post('prescription_module_list', {})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        this.prescription_module = response.data.data;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        async handleSubmit() {
            await post('module_save', {modules: this.moduleList,encounter_modules: this.encounter_module,prescription_module: this.prescription_module})
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message);
                        this.$store.dispatch('userDataModule/updateSetupStep', this.currentStep);
                        this.$store.dispatch('userDataModule/fetchUserData')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        },
        saveSetting: function () {
            post('module_save', { modules: this.moduleList, updateStep: false,encounter_modules: this.encounter_module,prescription_module: this.prescription_module })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        displayMessage(response.data.message);
                        this.$store.dispatch("userDataModule/fetchUserData")
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })
        }
    },
    computed: {
        currentStep() {
            const step = this.$store.state.userDataModule.setups.filter((obj) => {
                return obj.name === 'configuration';
            });
            if (step.length > 0) {
                return step[0];
            } else {
                return {}
            }
        },
        userData(){
            return this.$store.state.userDataModule.user;
        }
    },
    watch: {}
}
</script>
