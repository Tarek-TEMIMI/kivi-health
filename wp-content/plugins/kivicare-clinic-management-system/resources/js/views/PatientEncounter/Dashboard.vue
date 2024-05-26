<template>
    <b-row id="encounterPage">
        <b-col md="3" v-if="!isEncounterTemp" >
            <b-row>
                <b-col sm="12" >
                    <b-card class="p-0 shadow " header-tag="header" footer-tag="footer">
                        <template v-slot:header>
                            <b-row>
                                <b-col sm="12" md="6" lg="12">
                                    <h3 class="encounter-title">{{formTranslation.patient_encounter.encounter_details}}</h3>
                                </b-col>
                            </b-row>
                        </template>
                        <div class="row patient-details">
                            <div class="col-md-12">
                              <!-- <div class="row">   
                                  <div class="col-md-3 d-flex align-items-center">
                                    <img v-if="encounterData.patient_profile_image != '' && encounterData.patient_profile_image != null"
                                    :src="encounterData.patient_profile_image" alt="profile_image" height="70px" width="70px"
                                    style="border-radius:50%; margin-right:1rem;" />
                                    <b-avatar v-else variant="primary" :text="getInitials(encounterData.patient_name)" class="mr-3" size="70px"></b-avatar>
                                  </div> -->
                                  <!-- <div class="col-md-9"> -->
                                    <div class="mb-0"><strong>{{formTranslation.common.name}} : </strong> {{ encounterData.patient_name }}</div>
                                    <div v-if = "encounterData.is_patient_unique_id_enable" class="mb-0"><strong>{{formTranslation.patient.unique_id}} : </strong> {{ encounterData.patient_unique_id }}</div>
                                    <div class="mb-0"><strong class="font-weight-bold"> {{ formTranslation.common.email}} : </strong>{{ encounterData.patient_email }} </div>
                                    <div class="mb-0"><strong class="font-weight-bold"> {{ formTranslation.patient_encounter.encounter_date}} : </strong>{{   encounterData.encounter_date }}</div>
                                    <div class="mb-0"><strong class="font-weight-bold"> {{ formTranslation.common.address }} : </strong>{{ encounterData.patient_address || formTranslation.common.no_records_found}}</div>
                                  <!-- </div> -->
                              <!-- </div> -->
                            </div>
                        </div>
                        <hr class="m-2 ml-0">
                        <div class="row clinic-details">
                            <div class="col-md-12">
                                <div class="mb-0"><strong class="font-weight-bold">{{formTranslation.clinic.clinic_name}} : </strong>{{ encounterData.clinic_name }}</div>
                                <div class="mb-0"><strong class="font-weight-bold">{{formTranslation.doctor.doctor_name}} : </strong>{{ encounterData.doctor_name }}</div>
                                <div class="mb-0"><strong class="font-weight-bold">{{formTranslation.appointments.description}} : </strong>{{ encounterData.description || formTranslation.common.no_records_found}}</div>
                                <div class="mb-0 mt-1">
                                <p class="mb-0 float-left">
                                  <span class="badge badge-success p-2" v-if="encounterData.status == 1" > {{formTranslation.common.active}}</span>
                                  <span class="badge badge-danger" v-if="encounterData.status == 0" > {{formTranslation.common.closed}}</span>
                                </p>
                              </div>
                            </div>
                        </div>
                        <CustomForm :data="encounterCustomFormData" :viewMode="encounterCustomFormViewMode" :customFormModal="encounterCustomFormModal" v-if="encounterCustomFormModal" @closeModal="encounterCustomFormModal=false"></CustomForm>
                        <ModalPopup
                        v-if="billModel"
                        modalId="bill-modal"
                        modalSize="lg"
                        :openModal="billModel"
                        :modalTitle="formTranslation.patient_bill.generate_invoice"
                        @closeModal="billModel = false"
                        >
                        <BillForm :encounterId="encounterId" :checkOutVal="checkOutVal" @onBillSaved="handleBillSave" @onBillCancel="handleBillCancel" :appointmentData="encounterData" :clinic_extra="encounterData.clinic_extra !== undefined ? encounterData.clinic_extra : {} " :doctorId="encounterData.doctor_id"/>
                      </ModalPopup>
                        <ModalPopup
                        v-if="billDetailsModel"
                        modalId="bill-details-modal"
                        modalSize="lg"
                        :openModal="billDetailsModel"
                        :modalTitle="formTranslation.patient_bill.invoice_detail"
                        @closeModal="billDetailsModel = false"
                        >
                        <BillDetails :encounterId="encounterId" :clinic_extra="encounterData.clinic_extra !== undefined ? encounterData.clinic_extra : {} " @onBillCancel="billDetailsModel = false;" />
                      </ModalPopup>
                    </b-card>
                </b-col>
                <b-col sm="12" v-if="getUserRole() !== 'patient' && encounterData.status !=0 && kcCheckPermission('encounters_template_list')" id="patient-details-ecounter-template">
                    <b-card class="p-0 shadow " header-tag="header" footer-tag="footer">
                      <b-overlay :show="(Boolean)(userData.addOns.kiviPro != true && !isEncounterTemp)" variant="white"
                     :opacity="0.4">
                     <template #overlay>
                        <overlay-message addon_type="pro"></overlay-message>
                      </template>
                        <template v-slot:header>
                            <b-row>
                                <b-col sm="12" md="6" lg="12">
                                    <h3 class="encounter-title">{{formTranslation.patient_encounter.ecounter_template}}</h3>
                                </b-col>
                            </b-row>
                        </template>
                        <div class="row patient-details">
                            <div class="col-md-12">
                              <div class="form-group">
                                <label for="encounterTemplate" class="form-control-label">
                                    {{formTranslation.appointments.encounter_template}}
                                </label>
                                <multi-select
                                deselect-label=""
                                select-label=""
                                v-model="encounterTemplate"
                                :tag-placeholder="formTranslation.appointments.encounter_template" id="id"  :placeholder="formTranslation.patient_encounter.search_plh"
                                label="encounters_template_name"
                                track-by="id"
                                :loading="encounterTemplateLoader"
                                :disabled="encounterTemplateLoader"
                                :options="encounterTemplates"
                                @select="ChangeEncounterHandler"
                            ></multi-select>
                            </div>
                            </div>
                        </div>
                      </b-overlay>      
                    </b-card>
                </b-col>
            </b-row>
          <b-row v-if="encounterData.appointment_id
          && ((encounterData.appointment_report && encounterData.appointment_report.length > 0 ) || (encounterData.appointment_custom_field && encounterData.appointment_custom_field.length > 0))">
            <b-col sm="12" >
              <b-card class="p-0 shadow" header-tag="header" footer-tag="footer">
                <template v-slot:header>
                  <b-row>
                    <b-col sm="12" md="6" lg="12">
                      <h3> {{formTranslation.patient_encounter.patient_extra_details}}</h3>
                    </b-col>
                  </b-row>
                </template>
                <div class="row" v-if="encounterData.appointment_report && encounterData.appointment_report.length > 0">
                  <div class="col-md-12">
                    <div class="mb-0 text-center"><strong>{{formTranslation.patient.medical_report}} </strong></div>
                    <div v-for="(report, index) in encounterData.appointment_report" :key="index">
                      <div class="mt-2">
                        <a variant="outline-primary" v-b-tooltip.hover title="view report" :href="report.url" target="_blank">
                          <i class="fas fa-external-link-alt mr-1"></i>{{report.name}}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="m-2 ml-0" v-if="encounterData.appointment_report && encounterData.appointment_report.length > 0">
                <div class="row" v-if="encounterData.appointment_custom_field && encounterData.appointment_custom_field.length > 0">
                  <div class="col-md-12">
                    <div class="mb-0 text-center"><strong>{{formTranslation.patient_bill.other_info}} </strong></div>
                    <div v-html="customFieldContent(encounterData.appointment_custom_field)"></div>
                  </div>
                </div>
                <hr class="m-2 ml-0 print-class d-none">
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col :md="!isEncounterTemp ? 9:12 ">
          <b-card class="p-0 shadow" header-tag="header" footer-tag="footer" header-class="sticky-header">
            <template v-slot:header >
              <b-row>
                <b-col sm="12" md="3" lg="3">
                  <h3 class="mb-0"> {{ kcCheckPermission('medical_records_list') && !hideClinicalDetailsToPatient ? formTranslation.encounter_dashboard.title : '' }} </h3>
                </b-col>
                <b-col sm="12" md="9" lg="9">
                  <div class="d-md-flex d-lg-flex d-xl-flex justify-content-end">
                    <button type="button" class="btn btn-sm btn-primary mb-1" @click="$router.go(-1);">
                      <i class="fa fa-angle-double-left"></i> {{formTranslation.common.back}}
                    </button>
                    <button type="button" class="btn btn-sm btn-primary mb-1"  v-for="(custom_form_data,key) in encounterData.custom_forms" :key="key"
                    v-if="userData.addOns.kiviPro == true && customFormCondition(encounterData,custom_form_data)" @click="customFormOpen(encounterData,custom_form_data)">
                      <i :class="(custom_form_data.name && custom_form_data.name.icon ? custom_form_data.name.icon : 'fas fa-book-medical')"></i> 
                      {{custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : ''}}
                    </button>
                    <button v-if="userData.addOns.kiviPro == true &&  !isEncounterTemp" type="button" class="btn btn-sm btn-primary mb-1" @click="printEncounter">
                      <i class="fa fa-print"></i> {{ formTranslation.patient_bill.print + ' ' + formTranslation.patient_encounter.encounters}}
                    </button>
                    <router-link :to="{ name: 'patient-encounter.body-chart',params:{ encounter_id: encounterId  } }" 
                        class="btn btn-sm btn-primary mb-1" v-if="userData.addOns.bodyChart == true && kcCheckPermission('body_chart_list')" >
                      <i class="fas fa-x-ray"></i> 
                      {{ formTranslation.common.body_chart }}
                    </router-link>
                     <!-- patient_id: encounterData.patient_id, -->
                    <router-link :to="{ name: 'patient-medical-report',params:{ encounter_id: encounterId  } }" class="btn btn-sm btn-primary mb-1" v-if="userData.addOns.kiviPro == true &&  kcCheckPermission('patient_report') && !isEncounterTemp">
                      <i :class="encounterData.status != 0 ? 'fa fa-upload' : 'fa fa-eye'"></i> {{ encounterData.status != 0 ? formTranslation.patient.upload_report : formTranslation.common.view+' '+formTranslation.reports.reports}}
                    </router-link>
                    <button class="btn btn-sm btn-outline-danger mb-1 mr-0" v-if="kcCheckPermission('patient_bill_add') && encounterData.status != 0 && !isEncounterTemp" @click="handleEncounterStatus('0')">
                      <i class="fa fa-check"></i> {{formTranslation.patient_bill.encounter_close}}
                    </button>
                    <button class="btn btn-sm btn-outline-danger ml-md-2 ml-ld-2 ml-xl-2 mb-1" v-if="kcCheckPermission('patient_bill_add') && kcCheckPermission('patient_appointment_status_change') && encounterData.status != 0 && encounterData.appointment_id !== undefined && encounterData.appointment_id !== null" @click="handleEncounterStatus('1')">
                      <i class="fa fa-check"></i> {{formTranslation.patient_bill.encounter_close_checkout}}
                    </button>
                    <button class="btn btn-sm btn-primary mb-1" v-if="encounterData.status == 0 && checkEnableModule('billing')" @click="handleBillDetails">
                        <i class="fa fa-file-invoice"></i> {{formTranslation.patient_bill.bill_details}}
                    </button>
                  </div>
                </b-col>
              </b-row>
            </template>
            <div id="print_clinical_details" v-if="kcCheckPermission('medical_records_list') && !hideClinicalDetailsToPatient">
              <b-row>
                  <b-col :md="getEnableCount" v-if="userData.addOns.kiviPro == true ? getEnableEncounter[0]['status'] == 1 : true" >
                      <MedicalHistory   :updateCounter="counter" ref="medical_history_problems" :recordData="problems" :ecounterStatus="encounterData.encounter_edit_after_close_status === true ? true : (isEncounterTemp?kcCheckPermission('encounters_template_edit'): encounterData.status  )"  :isEcounterTemplateModule="isEncounterTemp" />
                  </b-col>
                  <b-col :md="getEnableCount" v-if="userData.addOns.kiviPro == true ? (getEnableEncounter[1]['status'] == 1 ) :true"  >
                      <MedicalHistory   :updateCounter="counter" ref="medical_history_observation" :recordData="observation" :ecounterStatus="encounterData.encounter_edit_after_close_status === true ? true : (isEncounterTemp?kcCheckPermission('encounters_template_edit'): encounterData.status  )" :isEcounterTemplateModule="isEncounterTemp" />
                  </b-col>
                  <b-col :md="getEnableCount"  v-if="userData.addOns.kiviPro == true ? getEnableEncounter[2]['status'] == 1 : true" >
                      <MedicalHistory   :updateCounter="counter" ref="medical_history_note"  :recordData="note" :ecounterStatus="encounterData.encounter_edit_after_close_status === true ? true : (isEncounterTemp?kcCheckPermission('encounters_template_edit'): encounterData.status  )"  :isEcounterTemplateModule="isEncounterTemp" />
                  </b-col>
              </b-row>
              <b-row v-if="extraClinicalData.length > 0">
                <b-col :md="4" v-for="(data, index) in extraClinicalData" :key="index" >
                  <MedicalHistory   :updateCounter="counter" :ref="data.ref"  :recordData="data" :ecounterStatus="encounterData.encounter_edit_after_close_status === true ? true :(isEncounterTemp?kcCheckPermission('encounters_template_edit'): encounterData.status  )"  />
                </b-col>
              </b-row>
            </div>
            <b-row class="">
                <b-col md="12">
                    <Prescription v-if="showCustomField" ref="prescription_ref" :updateCounter="counter" :encounterData="{
                        encounter_id: encounterId,
                        status: encounterData.encounter_edit_after_close_status === true ? '1' : String(Number(isEncounterTemp?kcCheckPermission('encounters_template_edit'): encounterData.status )) ,
                    }"
                    :encounterId="encounterId"
                    :isEcounterTemplateModule="isEncounterTemp"
                    />
                </b-col>
                <b-col md="12" v-if="customFieldsLength > 0" :style="encounterData.status == 0 ?' pointer-events: none; cursor: default;' : ''">
                    <form id="encounterDataForm" @submit.prevent="handleSubmit" :novalidate="true" >
                        <div class="card shadow p-0">
                            <div class="card-header">
                                <h4 class="mb-0">{{formTranslation.patient_bill.other_info}}</h4>
                            </div>
                            <div class="card-body">
                                <edit-custom-fields 
                                    v-if="showCustomField"
                                    :key="componentKey"
                                    module_type="patient_encounter_module"
                                    @bindCustomField="getCustomFieldsValues"
                                    :module_id="customFieldEncounterId"
                                    :customFieldsObj="customFieldsObj"
                                    :fieldsValue="customFieldsData"
                                    @requiredCustomField="getRequireFields"
                                    :doctor_id="encounterData.doctor_id"
                                    :disabledForPatient="getUserRole() == 'patient' ? true : false "
                                ></edit-custom-fields>
                            </div>
                            <div class="card-footer" v-if="encounterData.status === '1' && getUserRole() !== 'patient'">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="float-right">
                                            <button v-if="!loading" class="btn btn-primary" type="submit">
                                                <i class="fa fa-save"></i> {{ formTranslation.encounter_dashboard.presciption_save_btn }}
                                            </button>
                                            <button v-else class="btn btn-primary" type="submit" disabled>
                                                <i class="fa fa-sync fa-spin"></i> &nbsp; {{formTranslation.common.loading}}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </b-col>
            </b-row>
            <div class="print-class mr-3 d-none">
              <hr>
              <div class="row">
                <div class="col-12 d-flex justify-content-end align-items-center">
                  <p  class="nameheading">
                    <strong>{{ formTranslation.patient_encounter.doctor_signature}}</strong>
                  </p>
                  <div class="border-bottom col-4" v-if="encounterData.doctor_signature !== ''">
                    <img :src="encounterData.doctor_signature">
                  </div>
                  <div v-else class="border-bottom col-4">
                  </div>
                </div>
              </div>
            </div>
          </b-card>
        </b-col>
    </b-row>
</template>

<script>
import {post, get} from "../../config/request";
import MedicalHistory from "../../components/PatientEncounter/MedicalHistory";
import Prescription from "../../components/PatientEncounter/Prescription";
import {validateForm} from "../../config/helper";
import BillForm from "../../components/PatientBill/BillForm";
import BillDetails from "../../components/PatientBill/BillDetails";
import ModalPopup from "../../components/Modal/Index"
import CustomForm from "../CustomForm/Form.vue"

export default {
    components: {
        MedicalHistory,
        Prescription,
        BillForm,
        BillDetails,
        ModalPopup,
        CustomForm
    },
    data: () => {
        return {
            encounterId: 0,
            patient_id: 0,
            encounterData: {},
            patientBillData: {},
            createBillButton: true,
            billModel: false,
            billDetailsModel: false,
            loading: false,
            submitted: false,
            buttonText: '<i class="fa fa-save"></i> Save',
            customFieldsLength: 0,
            customFieldsObj: {},
            cardTitle: 'Clinical Detail',
            componentKey: 0,
            showCustomField:false,
            problems: {},
            observation: {},
            note: {},
            hideClinicalDetailsToPatient:false,
            checkOutVal: 0,
            extraClinicalData: [],
            isEncounterTemp: false,
            encounterTemplate:'',
            encounterTemplates:[],
            encounterTemplateLoader:false,
            counter:0,
            encounterCustomFormData:{},
            encounterCustomFormModal:false,
            encounterCustomFormViewMode:false
        }
    },
    mounted() {
        this.encounterData = this.defaultEncounterDetails();
        this.init();
        this.hideClinicalDetailsToPatient = this.getUserRole() === 'patient' ? true : false;
    },
    methods: {
        init: function () {
          if(this.$route?.query?.isEncounterTemp !== undefined){
            this.isEncounterTemp  =this.$route?.query.isEncounterTemp == 1
          }
            this.encounterId = this.$route.params.encounter_id
            this.problems = {
                encounter_id: this.encounterId,
                type: 'problem',
                title: this.formTranslation.encounter_dashboard.problems,
                status: this.encounterData.status,
                data:[]
            } ;

            this.observation = {
                encounter_id: this.encounterId,
                type: 'observation',
                title: this.formTranslation.encounter_dashboard.observation,
                status: this.encounterData.status,
                data:[]
            } ;

            this.note = {
                encounter_id: this.encounterId,
                type: 'note',
                title: this.formTranslation.encounter_dashboard.notes,
                status: this.encounterData.status,
                data:[]
            } ;

            if (this.$route.params.encounter_id !== undefined) {
                this.encounterId = this.$route.params.encounter_id
                get(this.isEncounterTemp?"patient_encounter_template_details": 'patient_encounter_details', {
                    id: this.encounterId
                })
                .then((data) => {
                    if (data.data.status !== undefined && data.data.status === true) {
                        this.showCustomField = true;
                        this.encounterData = data.data.data
                        if(this.encounterData.clinic_extra !== undefined){
                          this.encounterData.clinic_extra = JSON.parse(this.encounterData.clinic_extra)
                        }
                        this.patient_id = this.encounterData.patient_id
                        this.getEncounterCustomField();
                        this.getEncounterBill();
                        this.hideClinicalDetailsToPatient = (data.data.hideInPatient == 'true' || data.data.hideInPatient == true) && this.getUserRole() === 'patient' ? true : false
                        if(!this.hideClinicalDetailsToPatient){
                          this.getMedicalRecords(this.encounterId)
                        }
                        //this.getExtraClinicalDetail(this.encounterId,this.encounterData.status);
                    }else if(data?.data?.status === false){
                      this.$router.push({ name: "/"})
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
                })

            }

            this.userData.addOns.kiviPro &&this.getEncounterTemplates()

        },
      //future use
      getExtraClinicalDetail(encounterId,encounter_status){
        get('encounter_extra_clinical_detail_fields', {
          id: encounterId,
          status:encounter_status
        })
            .then((data) => {
              if (data.data.status !== undefined && data.data.status === true) {
                this.extraClinicalData = data.data.data
              }
              if(!this.hideClinicalDetailsToPatient){
                this.getMedicalRecords(this.encounterId)
              }
            })
            .catch((error) => {
              if(!this.hideClinicalDetailsToPatient){
                this.getMedicalRecords(this.encounterId)
              }
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error);
            })
      },
        forceRerender() {
          this.componentKey += 1;
        },
        defaultEncounterDetails: function () {
            return {
                patient_id: 0,
                patient_name: '',
                clinic_name: '',
                doctor_name: '',
                custom_fields: {}
            }
        },
        getEncounterCustomField: function () {
          get('get_custom_fields', {
            module_type: 'patient_encounter_module',
            module_id: this.encounterId,
            doctor_id:this.encounterData.doctor_id
          } )
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                this.customFieldsObj = response.data.data;
                this.customFieldsLength = response.data.data.length;
              } else {
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
        },
        getCustomFieldsValues: function (fieldsObj) {
          if(!fieldsObj || fieldsObj === undefined){
            return false;
          }
          this.encounterData.custom_fields = fieldsObj;
        },
        getRequireFields: function (validateRequired) {
            this.requiredFields = validateRequired;
        },
        getEncounterBill:  function () {
            if (parseInt(this.encounterId) !== 0 && !this.isEncounterTemp) {
                get('patient_bill_detail', {
                    encounter_id: this.encounterId
                })
                .then((response) => {
                    if (response.data.status !== undefined && response.data.status === true) {
                        if (response.data.data.length === 0) {
                            this.createBillButton = true;
                        } else {
                            this.createBillButton = false;
                            this.patientBillData = response.data.data
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    displayErrorMessage(this.formTranslation.widgets.record_not_found);
                })
            }
        },
        handleSubmit: function () {
            if(this.getUserRole() == 'patient' ){ return; }
            this.loading = true;
            this.submitted = true;
            if (this.requiredFields.length > 0) {
                this.loading = false;
                displayErrorMessage(this.formTranslation.common.all_required_field_validation)
                return;
            }
            if (validateForm("encounterDataForm")) {
                post('save_custom_patient_encounter_field', this.encounterData)
                    .then((response) => {
                        this.loading = false;
                        if (response.data.status !== undefined && response.data.status === true) {
                            displayMessage(response.data.message);
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
        handleEncounterStatus: function (status) {
            this.checkOutVal = status;
            if(this.isBillModuleActive) {
                this.handleGenerateBill();
                return ;
            } else {
                this.handleEncounterstatusUpdate({ id: this.encounterId, status: 0});
            }
        },
        handleEncounterstatusUpdate: function (requestData) {
            post('patient_encounter_update_status', { id: requestData.id, status: requestData.status, checkOutVal: this.checkOutVal })
            .then((response) => {
              if (response.data.status !== undefined && response.data.status === true) {
                  this.encounterData.status = requestData.status ;
                  displayMessage(response.data.message);
              } else {
                displayErrorMessage(response.data.message)
              }
            })
            .catch((error) => {
                console.log(error);
                displayErrorMessage(this.formTranslation.common.internal_server_error)
            })
        },
        handleGenerateBill: function () {
            this.billModel = true;
        },
        handleBillDetails: function () {
            this.billDetailsModel = true;
        },
        handleBillSave: function (data) {
            this.billModel = false;
            this.createBillButton = false;
            // encounter close
            this.encounterData.status = data.payment_status && data.payment_status === 'paid' ?  0 : 1 ;
            this.getEncounterBill();
        },
        handleBillCancel:function(type){
          this.billModel = false;
        },
        defaultBillRecordData: function () {
            return {
                title: '',
                encounter_id: 0,
                total_amount: 0,
                discount: 0,
                actual_amount: '',
                status: 0,
                billItems: []
            }
        },
        defaultBillingItemData: function () {
            return {
                item_id: {},
                qty: 1,
                price: 0,
                total: this.billItem.price * this.billItem.qty
            }
        },
        getMedicalRecords: function (encounter_id) {
        get(this.isEncounterTemp?'medical_history_list_from_template' : 'medical_history_list', {encounter_id: encounter_id})
            .then((response) => {
                try{
                    if(this.$refs.medical_history_note !== undefined){
                      if(this.userData.addOns.kiviPro !== true){
                        this.$refs.medical_history_note.medicalHistoryListLoader = false;
                      }else if( this.getEnableEncounter[2]['status'] == 1){
                        this.$refs.medical_history_note.medicalHistoryListLoader = false;
                      }
                    }
                    if(this.$refs.medical_history_observation !== undefined){
                      if(this.userData.addOns.kiviPro !== true){
                        this.$refs.medical_history_observation.medicalHistoryListLoader = false;
                      }else if(this.getEnableEncounter[1]['status'] == 1){
                        this.$refs.medical_history_observation.medicalHistoryListLoader = false;
                      }
                    }
                    if(this.$refs.medical_history_problems !== undefined){
                      if(this.userData.addOns.kiviPro !== true){
                        this.$refs.medical_history_problems.medicalHistoryListLoader = false;
                      }else if(this.getEnableEncounter[0]['status'] == 1){
                        this.$refs.medical_history_problems.medicalHistoryListLoader = false;
                      }
                    }

                  this.extraClinicalData.map((index,key)=>{
                    this.$refs[index.ref][0].medicalHistoryListLoader = false;
                  });
                } catch (error){
                    console.log(error);
                }
              if (response.data.status !== undefined && response.data.status === true) {
                if(response.data.data.problem !== undefined && response.data.data.problem.length > 0 ){
                  if(this.userData.addOns.kiviPro !== true){
                    this.$refs.medical_history_problems.medicalHistoryList = response.data.data.problem;
                  }else if(this.getEnableEncounter[0]['status'] == 1){
                    this.$refs.medical_history_problems.medicalHistoryList = response.data.data.problem;
                  }
                }
                if(response.data.data.observation !== undefined && response.data.data.observation.length > 0 ){
                  if(this.userData.addOns.kiviPro !== true){
                    this.$refs.medical_history_observation.medicalHistoryList = response.data.data.observation;
                  }else if(this.getEnableEncounter[1]['status'] == 1){
                    this.$refs.medical_history_observation.medicalHistoryList = response.data.data.observation;
                  }
                }
                if(response.data.data.note !== undefined && response.data.data.note.length > 0 ){
                  if(this.userData.addOns.kiviPro !== true){
                    this.$refs.medical_history_note.medicalHistoryList = response.data.data.note;
                  }else if(this.getEnableEncounter[2]['status'] == 1){
                    this.$refs.medical_history_note.medicalHistoryList = response.data.data.note;
                  }
                }
                this.extraClinicalData.map((index,key)=>{
                  if(response.data.data[index.type] !== undefined && response.data.data[index.type].length > 0 ){
                    this.$refs[index.ref][0].medicalHistoryList = response.data.data[index.type];
                  }
                });
              }
            })
            .catch((error) => {
                try{
                    this.$refs.medical_history_note.medicalHistoryListLoader = false;
                    this.$refs.medical_history_observation.medicalHistoryListLoader = false;
                    this.$refs.medical_history_problems.medicalHistoryListLoader = false;
                } catch (error){
                    console.log(error);
                }
              console.log(error);
              displayErrorMessage(this.formTranslation.common.internal_server_error);
              ;
            })
      },
      getEncounterTemplates:function(){
        get('get_encounter_templates',{encounter_id:this.encounterId}).then(res=>{
          if(res?.data?.success){
              this.encounterTemplates = res?.data?.data.list;
              this.encounterTemplate= this.encounterTemplates?.find(obj => obj.id === res?.data?.data?.default);
          }
          this.encounterTemplateLoader= false
        })
      },
      ChangeEncounterHandler: function(val){
        post('insert_template_to_encounter',{encounterTemplateID:val.id , encounter_id:this.encounterId,patientID:this.patient_id}).then(res=>{
          this.counter ++;
          this.init();
        })
      },
      customFieldContent(custom_fields){
        let customContent = ''
        custom_fields.forEach(function(key,index) {
          customContent += `<div class="mt-2"> <p class="mb-0"><span class="font-weight-bold">`
          customContent +=  key.label;
          customContent +=  `: </span>`;
          customContent +=  key.field_data !== null ? (Array.isArray(key.field_data) ? key.field_data.join(', ') : key.field_data) : ' ';
          customContent += `</p></div>`
        });
        return customContent
      },
      printEncounter(){
        let _this =this

        let pageData = $('#encounterPage').clone();
        $(pageData).find('button').remove();
        $(pageData).find('.multiselect').remove();
        $(pageData).find('.clinical_details_notes').remove();
        $(pageData).find('.fa-eye').parent().remove();
        $(pageData).find('.medical-history-card li i').remove();
        $(pageData).find('#patient-details-ecounter-template').remove();
        let clinical_detail = '<div data-v-269365c0="" class="card-header">' +
            '<div data-v-269365c0="" class="row">' +
            '<div data-v-269365c0="" class="col-12">' +
            '<h3 data-v-269365c0="" class="mb-0">'+this.formTranslation.encounter_dashboard.title+'</h3>' +
            '</div> </div> <!----></div><div class="row">'
        $(pageData).find('.medical-history-card').map((key,value,row)=>{
          $(value).css('max-height','unset').css('min-height','unset')
          $(value).find('.list-group-item').css('border','unset')
          clinical_detail += '<div class="col-4 ">'
          clinical_detail += $(value).parent().clone().html()
          clinical_detail += '</div>'
        });
        clinical_detail += '</div>'
        $(pageData).find('#print_clinical_details').html(clinical_detail)
        $(pageData).find('.encounter-title').addClass('text-center text-primary').css('font-size','24px');
        $(pageData).find('.fa-upload').parent().remove();
        $(pageData).find('#historyDataForm .form-group').remove();
        let patient_details = $(pageData).find('.patient-details div').clone().html()
        let clinic_details = $(pageData).find('.clinic-details div').clone().html()
        $(pageData).find('.clinic-details div').remove()
        $(pageData).find('.patient-details div').remove()
        $(pageData).find('.patient-details').append(`<div class="col-6">`+patient_details+`</div>`)
        $(pageData).find('.patient-details').append(`<div class="col-6">`+clinic_details+`</div>`)
        $(pageData).find('.print-class').removeClass('d-none')
        $(pageData).append(`<style>@media print{@page {margin: 0;}.pagebreak { page-break-before: always; } .badge{border:unset} #encounterPage{padding:5px;}</style>`)
        $(pageData).find("#encounterDataForm .form-control").each(function(){
          if(this.value.length === 0){
            if(this?.tagName?.toLowerCase() == 'select'){
              this.selectedOptions[0].innerText =  _this.formTranslation.common.no_records_selected;
            }else{
              this.value=  _this.formTranslation.common.no_records_found
            }
          }

          if(this?.tagName?.toLowerCase() == 'select'){
            this.value =$(document).find("#encounterDataForm").find("#"+this.id).val();

            
          }
        })
        $(pageData).printArea({});
      },
      customFormOpen(props,custom_form_data){
          this.encounterCustomFormData = custom_form_data;
          this.encounterCustomFormData.module_id = custom_form_data.module_type === 'appointment_module' ? props.appointment_id : props.id;
          this.encounterCustomFormViewMode = props.status === '0';
          this.encounterCustomFormModal = true;
          console.log(this.encounterCustomFormData.module_id)
      },
      customFormCondition(props,custom_form_data){
        return props.custom_forms && props.custom_forms.length 
        &&  (custom_form_data.clinic_ids.length === 0 || custom_form_data.clinic_ids.includes[props.clinic_id])
        && ((custom_form_data.module_type === 'appointment_module' && props.appointment_id) || (custom_form_data.module_type === 'patient_encounter_module'))
      },
      getInitials(name) {
        if(name !== undefined && name !== '' && name !== null){
          const patient_name = name.split(" ");
          const initials = patient_name.map(patient_name => patient_name.charAt(0).toUpperCase());
          return initials.join("");
        }else{
          return ' - ';
        }
      },
    },
    computed: {
        userData() {
            return this.$store.state.userDataModule.user;
        },
        customFieldEncounterId () {
            return this.$route.params.encounter_id ;
        },
        encounterDoctorId() {
          return  this.encounterData.doctor_id ;
        },
        customFieldsData() {
            return this.encounterData.custom_fields
        },
        isCustomeFieldExist () {
         return (this.encounterData.custom_fields !== undefined && this.encounterData.custom_fields.length > 0) ;
        },
        isBillModuleActive () {
            const module = this.$store.state.userDataModule.user.module.module_config.filter(thing => thing.name === 'billing' && thing.status === '1');
            if (module.length > 0) {
                return true ;
            } else {
                return false ;
            }
        },
        getEnableEncounter(){
            if(this.userData.encounter_enable_module !== undefined){
                return this.userData.encounter_enable_module
            }
        },
        getEnableCount(){
           if(this.userData.addOns.kiviPro == true){
               return this.userData.encounter_enable_count
           }else{
               return "4"
           }
        },
        // formTranslation: function () {
        //     return this.$store.state.staticDataModule.langTranslateData ;
        // }
    },
    watch: {
    '$route': function () {
      if(this.$route?.query?.isEncounterTemp !== undefined){
        this.isEncounterTemp  =this.$route?.query?.isEncounterTemp;
      }
    }
  },
}
</script>
<style scoped>
.nameheading{
  margin: 0;
  font-weight: 500;
  font-size: 20px;
}
</style>

