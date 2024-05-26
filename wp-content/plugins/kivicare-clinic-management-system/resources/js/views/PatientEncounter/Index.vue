<template>
  <b-row>
    <b-col sm="12">
      <b-overlay :show="(Boolean)(userData.addOns.kiviPro != true && isEncounterTemp)" variant="white"
                     :opacity="0.4">
      <template #overlay>
              <overlay-message addon_type="pro"></overlay-message>
      </template>
      <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row class="align-items-center">
            <b-col sm="12" md="8" lg="8">
              <h3 class="mb-0">{{ encounterName }}</h3>
            </b-col>
            <b-col sm="12" md="4" lg="4" v-if="getUserRole() !== 'patient'">
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-sm btn-primary" @click="$router.go(-1);">
                  <i class="fa fa-angle-double-left"></i> {{ formTranslation.common.back }}
                </button>
                <!-- <button v-if="getUserRole() === 'doctor'||getUserRole() === 'administrator'" type="button" class="btn btn-sm btn-primary" @click="handleEncounterTemplateButton()">
                  {{ isEncounterTempName }}<span v-if="!userData.addOns.kiviPro" class="ml-2 badge p-1 kivicare-badge"
                    style="background:#f68685">Pro</span>
                </button> -->
                <button v-if="addEncounterButton && kcCheckPermission('patient_encounter_add')"
                  class="btn btn-sm btn-primary" @click="handleEncounterForm({})"
                  :to="{ name: 'patient-encounter.create', params: { patient_id: patientEncountersRequest.login_id } }">
                  <i v-if="!visible" class="fa fa-plus"></i> <i v-else class="fa fa-minus"></i>
                  {{ (visible ? formTranslation.encounter_dashboard.close_form :
                    formTranslation.encounter_dashboard.add_encounter) }}
                </button>
                <button v-else-if="kcCheckPermission('encounters_template_add') && addEncounterTemplateButton" class="btn btn-sm btn-primary"
                  @click="handleEncounterTemplateForm({})"
                  :to="{ name: 'patient-encounter.create', params: { patient_id: patientEncountersRequest.login_id } }">
                  <i class="fa fa-plus"></i>
                  {{ formTranslation.common.add_encounter_template }}
                </button>
              </div>
            </b-col>
          </b-row>
        </template>
        <b-collapse id="encounterDataForm" :visible="showAddForm" v-if="showAddForm && !isEncounterTemp">
          <Create :encounterId="encounterId" @getPatientEncountersData="getPatientEncountersData"
            @closeEncounterForm="closeEncounterForm" :patientField="patientField" :clinicField="clinicField" />
        </b-collapse>
        <b-collapse :visible="showEditForm" role="tabpanel" v-if="showEditForm && encounterId">
          <Create v-if="encounterId" :encounterId="encounterId" @getPatientEncountersData="getPatientEncountersData"
            @closeEncounterForm="closeEncounterForm" :patientField="patientField" />
        </b-collapse>
        <CustomForm :data="encounterCustomFormData" :viewMode="encounterCustomFormViewMode" :customFormModal="encounterCustomFormModal" v-if="encounterCustomFormModal" @closeModal="encounterCustomFormModal=false"></CustomForm>
        <ModalPopup v-if="showAddTemplateForm" modalId="create-encounter-template" modalSize="md"
          :openModal="showAddTemplateForm" :modalTitle="formTranslation.common.add_encounter_template"
          @closeModal="closeEncounterTemplateForm()">
          <div class="form-group">
            <label for="template_name" class="form-control-label"> {{ formTranslation.encounter_dashboard.template_name
            }}<span class="text-danger">*</span></label>
            <input class="form-control" id="template_name" v-model="encounter_template.name"
              :placeholder="formTranslation.encounter_dashboard.template_name_placeholder">
            <div v-if="formSubmitted && (!$v.encounter_template.name.required)" class="invalid-feedback">
              {{ formTranslation.patient_bill.encounter_template_name_required }}. </div>
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-outline-primary" @click="closeEncounterTemplateForm()">
              {{ formTranslation.common.cancel }}
            </button>
            <button class="btn btn-primary" @click="addTemplateHandle()"> {{ formTranslation.encounter_dashboard.add_btn }}
            </button>
          </div>
        </ModalPopup>
        <ModalPopup v-if="billDetailsModel" modalId="bill-details-modal" modalSize="lg" :openModal="billDetailsModel"
          :modalTitle="formTranslation.patient_bill.invoice_detail" @closeModal="billDetailsModel = false">
          <BillDetails :encounterId="encounterId" :clinic_extra="clinic_extra"
            @onBillCancel="billDetailsModel = false;" />
        </ModalPopup>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <div v-show="pageLoader" class="page-loader-section">
              <loader-component-2></loader-component-2>
            </div>
            <div class="mb-0">
              <vue-good-table ref="dataTable" :columns="patientEncounterList.column" :rows="patientEncounterList.data"
                :search-options="{
                  enabled: true,
                  placeholder: formTranslation.common.search_encounter_field_data_global_placeholder,
                }" mode="remote" styleClass="vgt-table striped" @on-sort-change="onSortChange"
                @on-column-filter="onColumnFilter" @on-page-change="onPageChange" @on-per-page-change="onPerPageChange"
                :totalRows="totalRows" :pagination-options="{
                  enabled: true,
                  mode: 'pages',
                }" @on-search="globalFilter"
                @on-selected-rows-change="(selected_row) => { globalCheckboxApplyData.data = selected_row }" :select-options="{
                  enabled: true,
                  selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                  selectionInfoClass: 'text-primary bg-white',
                  selectionText: formTranslation.common.rows_selected,
                  clearSelectionText: formTranslation.common.clear,
                  disableSelectInfo: false, // disable the select info panel on top
                  selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
                }" 
                compactMode>
                <div slot="emptystate" class="text-danger text-center">
                  {{ formTranslation.common.no_data_found }}
                </div>
                <div slot="table-actions">
                  <module-data-export :module_data="patientEncounterList.data"
                    :module_name="formTranslation.patient_bill.patients_encounter_list" module_type="encounter"
                    v-if="!isEncounterTemp && kcCheckPermission('patient_encounter_export')"> </module-data-export>
                </div>
                <div slot="selected-row-actions">
                  <div class="d-flex justify-content-end align-items-center">
                    <select class="form-control form-control-sm" v-model="globalCheckboxApplyData.action_perform">

                      <option v-for="(option, index) in globalCheckboxApplyDataActions" :value="option.value">{{ option.label
                      }}</option>
                    </select>
                    <button class="ml-2 btn btn-sm btn-primary" @click="confirmDelete">
                      {{ formTranslation.common.apply }}
                    </button>
                  </div>
                </div>
                <template slot="column-filter" slot-scope="{ column, updateFilters }">
                  <div v-if="column.field === 'encounter_date'" class="d-flex justify-content-start align-items-center">
                    <vc-date-picker id="appointmentDate" title-position="left"
                      @input="(value) => updateFilters(column, serverParams.columnFilters.encounter_date)"
                      v-model="serverParams.columnFilters.encounter_date" :popover="{ visibility: 'click' }" is-expanded
                      mode='range'>
                      <template v-slot="{ inputValue }">
                        <input :value="inputValue" class="form-control-sm"
                          :placeholder="formTranslation.appointments.plh_date" style="border: #fff" />
                      </template>
                    </vc-date-picker>
                    <span class="form-control-sm"
                      @click="updateFilters(column, serverParams.columnFilters.encounter_date = '')">X</span>
                  </div>
                </template>
                <template slot="table-row" slot-scope="props">
                  <div v-if="props.column.field == 'encounter_date'">
                    {{ props.row.encounter_date }}
                  </div>
                  <div v-else-if="props.column.field == 'patient_id'">
                    {{ props.row.patient_name }}
                  </div>
                  <div v-else-if="props.column.field == 'status'">
                    <span class="badge badge-danger" v-if="props.row.status == '0'"> {{ formTranslation.common.closed }} </span>
                    <span class="badge badge-success" v-if="props.row.status == '1'"> {{ formTranslation.common.active }} </span>
                  </div>
                  <div class="btn-group" v-else-if="props.column.field == 'actions'">
                    <button v-b-tooltip.hover :title="formTranslation.common.edit"
                      v-if="!isEncounterTemp && props.row.status !== '0' && getUserRole() !== 'patient' && kcCheckPermission('patient_encounter_edit')"
                      @click="editEncounterData(props.row, props.row.id)" class="btn btn-sm btn-outline-primary">
                      <i class="fa fa-pen-alt"></i>
                    </button>
                    <router-link v-if=" isEncounterTemp?kcCheckPermission('encounters_template_view'):kcCheckPermission('patient_encounter_view') " v-b-tooltip.hover
                      :title="formTranslation.patient_encounter.encounter_dashboard"
                      class="btn btn-sm btn-outline-primary"
                      :to="{ name: 'patient-encounter.dashboard', params: { encounter_id: props.row.id }, query: { isEncounterTemp } }">
                      <i class="fas fa-tachometer-alt"></i>
                    </router-link>
                    <router-link v-if="userData.addOns.bodyChart == true && kcCheckPermission('body_chart_list')" v-b-tooltip.hover
                      :title="formTranslation.common.body_chart"
                      class="btn btn-sm btn-outline-primary"
                      :to="{ name: 'patient-encounter.body-chart', params: { encounter_id: props.row.id } }">
                      <i class="fas fa-x-ray"></i>
                    </router-link>
                    <button v-b-tooltip.hover :title="formTranslation.patient_bill.bill_details"
                      v-if="checkEnableModule('billing') && props.row.status === '0'"
                      @click="billDetailsModel = true; encounterId = props.row.id" class="btn btn-sm btn-outline-primary">
                      <i class="fa fa-file-invoice"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" v-for="(custom_form_data,key) in props.row.custom_forms" :key="key" 
                        v-if="userData.addOns.kiviPro == true &&customFormCondition(props.row,custom_form_data)" @click="customFormOpen(props.row,custom_form_data)"
                        v-b-tooltip.hover :title="custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : '' " >
                        <i :class="(custom_form_data.name && custom_form_data.name.icon ? custom_form_data.name.icon : 'fas fa-book-medical')"></i>
                    </button>  
                    <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                      v-if="getUserRole() !== 'patient' && isEncounterTemp?kcCheckPermission('encounters_template_delete'):kcCheckPermission('patient_encounter_delete') "
                      @click="deleteEncounterData(props.index + 1)" class="btn btn-sm btn-outline-danger">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                  <div v-else>
                    {{ props.formattedRow[props.column.field] }}
                  </div>
                </template>
              </vue-good-table>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-overlay>
    </b-col>
  </b-row>
</template>

<script>
import { get, post } from "../../config/request";
import Create from "./Create";
import BillDetails from "../../components/PatientBill/BillDetails";
import ModalPopup from "../../components/Modal/Index"
import { RouterLink } from "vue-router";
import { required } from "vuelidate/lib/validators";
import CustomForm from "../CustomForm/Form.vue"
export default {
  data: () => {
    return {
      doctorField: false,
      pageLoader: true,
      visible: false,
      showEditForm: false,
      showAddForm: false,
      patientEncounterList: {
        data: [],
        column: []
      },
      patientEncountersRequest: {
        login_id: 0,
        limit: 10,
        offset: 0,
        patient_id: 0
      },
      encounterData: {},
      serverParams: {
        columnFilters: {},
        sort: [
          {
            field: '',
            type: ''
          }
        ],
        page: 1,
        perPage: 10,
        searchTerm: '',
      },
      oldServerParams: {
        columnFilters: {

        },
        searchTerm: '',
        perPage: 10
      },
      totalRows: 0,
      doctors: [],
      encounterId: -1,
      addEncounterButton: true,
      editEncounter: false,
      patientField: false,
      clinicField: true,
      clinic_extra: {
        prefix: "",
        postfix: ""
      },
      billDetailsModel: false,
      isEncounterTempName: '',
      isEncounterTemp: false,
      encounterName: '',
      addEncounterTemplateButton: false,
      showAddTemplateForm: false,
      encounter_template: {
        id: '',
        name: ''
      },
      formSubmitted: false,
      globalCheckboxApplyData: {},
      globalCheckboxApplyDataActions: [

      ],
      encounterCustomFormData:{},
      encounterCustomFormModal:false,
      encounterCustomFormViewMode:false
    }
  },
  components: { Create, BillDetails, ModalPopup, RouterLink,CustomForm },
  mounted() {
    this.init();

    if ('patient_id' in this.$route.params) {
      this.patientField = false
      this.clinicField = false
      this.patientEncountersRequest.patient_id = this.$route.params.patient_id
    } else {
      this.patientField = true
      this.clinicField = true
    }
  },
  validations: {
    encounter_template: {
      name: { required }
    }
  },
  methods: {
    init: function () {
      this.setWhichTemplate(false);

      let userRole = this.getUserRole();
      if (userRole == "doctor") {
        this.doctorField = true
      }
      if (userRole == 'patient') {
        this.patientField = true
      }
      if (this.$route.params.patient_id === undefined) {
        this.patientEncountersRequest.login_id = this.login_id
      } else {
        this.patientEncountersRequest.patient_id = this.$route.params.patient_id
      }
   
      this.patientEncounterList = this.defaultPatientEncountersData();
      this.getPatientEncountersData()
      this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData()
      this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions()
    },
    setWhichTemplate: function (kc_router) {
      let route;
      if (kc_router == false) {
        route = this.$route.name
      } else {
        route = kc_router.name
      }
      if (route == 'encounter-template') {
        this.isEncounterTempName = this.formTranslation.common.switch_to_encounter
        this.encounterName = this.formTranslation.patient_bill.encounter_template_list
        this.addEncounterButton = false;
        this.addEncounterTemplateButton = true;
        this.isEncounterTemp = 1;
      } else {
        this.isEncounterTempName = this.formTranslation.common.switch_to_encounter_temp
        this.encounterName = this.formTranslation.patient_bill.patients_encounter_list
        this.addEncounterButton = true;
        this.addEncounterTemplateButton = false;
        this.isEncounterTemp = 0;
      }
    },
    handleEncounterTemplateButton: function () {
      if (this.userData.addOns.kiviPro) {
        if (this.$route?.query?.isEncounterTemp == 'true') {
          this.$router.push({ query: { isEncounterTemp: 0 } })
        } else {
          this.$router.push({ query: { isEncounterTemp: 1 } })
        }
      }
    },
    addTemplateHandle: function () {

      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.encounter_template.$invalid) {
        this.formSubmitted = true;
        return;
      }

      post('add_encounter_temp', { template_name: this.encounter_template.name, added_by: this.$store.state.userDataModule.user.ID })
        .then(res => {
          if (res?.data?.success === true) {
            this.$router.push({ name: 'patient-encounter.dashboard', params: { encounter_id: res?.data?.data.id }, query: { isEncounterTemp: 1 } })
            displayMessage(res?.data?.data?.message)
          }
        })
    },
    getDoctorsData: function () {
      get('get_static_data', {
        data_type: 'clinic_doctors',
        clinic_id: this.activeClinicId
      })
        .then((data) => {
          if (data.data.status !== undefined && data.data.status === true) {
            this.doctors = data.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },
    defaultPatientEncountersData: function () {
      return {
        totalRow: 0,
        column: this.isEncounterTemp ? [{
          field: 'id',
          label: this.formTranslation.common.id,
          width: '100px',
          filterOptions: {
            enabled: true,
            placeholder: this.formTranslation.common.id,
            filterValue: '',
          }
        },
        {
          field: 'encounters_template_name',
          label: this.formTranslation.patient_encounter_template.dt_lbl_name,
          filterOptions: {
            enabled: true,
            placeholder: this.formTranslation.patient_encounter_template.dt_plh_fltr_date,
            filterValue: '',
          }, width: '100%',

        },
        {
          field: 'actions',
          sortable: false,
          label: this.formTranslation.patient_encounter.dt_lbl_action,
          html: true
        }

        ] : [

          {
            field: 'id',
            label: this.formTranslation.common.id,
            width: '100px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.id,
              filterValue: '',
            }
          },
          {
            field: 'doctor_name',
            label: this.formTranslation.patient_encounter.dt_lbl_doc_name,
            hidden: this.doctorField,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_by_doc,
              filterValue: '',
            }
          },
          {
            field: 'clinic_name',
            label: this.formTranslation.patient_encounter.dt_lbl_clinic,
            filterOptions: {
              enabled: !(window.request_data.current_user_role === 'kiviCare_clinic_admin' || window.request_data.current_user_role === 'kiviCare_receptionist'),
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_by_clinic,
              filterValue: '',
            }
          },
          {
            field: 'patient_name',
            label: this.formTranslation.patient_encounter.dt_lbl_patient,
            hidden: this.patientField,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_patient,
              filterValue: '',
            }
          },
          {
            field: 'encounter_date',
            label: this.formTranslation.patient_encounter.dt_lbl_name,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_date,
              filterValue: '',
            }
          },
          {
            field: 'status',
            label: this.formTranslation.common.status,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterValue: '',
              filterDropdownItems: [
                { value: '1', text: this.formTranslation.common.active },
                { value: '0', text: this.formTranslation.common.closed }]
            }
          },
          {
            field: 'actions',
            sortable: false,
            label: this.formTranslation.patient_encounter.dt_lbl_action,
            html: true
          }
        ],
        data: []
      }
    },
    deleteEncounterData: function (index) {
      if (this.patientEncounterList.data[index - 1] !== undefined) {
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.common.py_delete,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                get( this.isEncounterTemp? 'delete_encounter_temp':'patient_encounter_delete', {
                  id: this.patientEncounterList.data[index - 1].id
                })
                  .then((data) => {
                    if (data.data.status !== undefined && data.data.status === true) {
                      this.patientEncounterList.data.splice((index - 1), 1);
                      displayMessage(data.data.message);
                    }
                  })
                  .catch((error) => {

                    if (error.response.data !== undefined && error.response.data.message !== undefined) {
                      displayErrorMessage(error.response.data.message);
                    } else {
                      displayErrorMessage(this.formTranslation.common.internal_server_error);
                    }

                  })
              }
            },
            cancel: {
              text: this.formTranslation.common.cancel
            }
          }
        });
      }
    },
    getPatientEncountersData: function () {
      this.pageLoader = true;
      let serverParams = Object.assign({}, this.serverParams)
      if (serverParams.columnFilters.encounter_date && serverParams.columnFilters.encounter_date.start && serverParams.columnFilters.encounter_date.end) {
        serverParams.columnFilters.encounter_date.start = moment(serverParams.columnFilters.encounter_date.start).format('YYYY-MM-DD')
        serverParams.columnFilters.encounter_date.end = moment(serverParams.columnFilters.encounter_date.end).format('YYYY-MM-DD')
      }
      if (this.login_id == this.$route.params.patient_id) {
        this.patientEncountersRequest.login_id = this.login_id
        this.patientEncountersRequest.patient_id = 0;
      }

      get(this.$route.name == 'encounter-template'? 'get_encounter_templates': 'patient_encounter_list', { ...this.patientEncountersRequest, ...serverParams  })
        .then((data) => {
          this.pageLoader = false;
          if ( (data.data.status !== undefined && data.data.status === true) || ( data?.data?.success == true)) {
            this.patientEncounterList.data = this.$route.name == 'encounter-template' ? data.data.data.list :data.data.data

            this.totalRows = data.data.data.total_rows;
            if (data.data.clinic_extra !== undefined && data.data.clinic_extra !== null) {
              this.clinic_extra = data.data.clinic_extra
            }
          } else {
            this.totalRows = 0;
            this.patientEncounterList.data = []
          }
        })
        .catch((error) => {
          this.pageLoader = false;
          if(error.response.status==403){
            displayErrorMessage(error.response.data.data);
            return;
          }
          displayErrorMessage(this.formTranslation.common.internal_server_error);
        })
    },

    defaultGlobalCheckboxApplyData() {
      return {
        action_perform: 'delete',
        module: this.$route.name == 'encounter-template'? 'patient_encounter_template': 'patient_encounter_list',
        data: []
      }
    },

    defaultGlobalCheckboxApplyDataActions: function () {
      return [
        {
          value: "delete",
          label: this.formTranslation.clinic_schedule.dt_lbl_dlt
        },
      ]
    },

    confirmDelete() {
      $.confirm({
        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
        content: this.formTranslation.common.py_delete,
        type: 'red',
        buttons: {
          ok: {
            text: this.formTranslation.common.yes,
            btnClass: 'btn-danger',
            keys: ['enter'],
            action: () => {        
              this.globalCheckboxApply();
            }
          },
          cancel:{
            text:this.formTranslation.common.cancel
          }
        }
      });
    },

    globalCheckboxApply() {
      this.pageLoader = true;
      post('module_wise_multiple_data_update', this.globalCheckboxApplyData)
        .then((data) => {
          this.pageLoader = false;
          if (data.data.status !== undefined && data.data.status === true) {
            displayMessage(data.data.message);
            this.getPatientEncountersData();
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          this.pageLoader = true;
          console.log(error);
        })
    },

    updateParams: function (newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getPatientEncountersData()
    },

    onPageChange(params) {
      this.updateParams({ page: params.currentPage });
    },

    onPerPageChange(params) {
      if (this.oldServerParams.perPage === params.currentPerPage) {
        return;
      }
      this.oldServerParams.perPage = params.currentPerPage;
      this.updateParams({ perPage: params.currentPerPage, page: params.currentPage });
    },

    onSortChange(params) {
      this.updateParams({
        sort: params,
      });
    },
    globalFilter: _.debounce(function (params) {

      if (this.oldServerParams.searchTerm === params.searchTerm) {
        return;
      }
      this.oldServerParams.searchTerm = params.searchTerm;
      this.updateParams({ searchTerm: params.searchTerm, perPage: this.serverParams.perPage, page: 1 });
    }, 300),
    onColumnFilter: _.debounce(function (params) {

      var emptyValue = true;
      var emptyValue2 = true;
      Object.values(params.columnFilters).map(function (value, index, array) {
        if (value) {
          emptyValue = false;
        }
      })
      Object.values(this.oldServerParams.columnFilters).map(function (value, index, array) {
        if (value) {
          emptyValue2 = false;
        }
      })
      if (!emptyValue || !emptyValue2) {
        this.oldServerParams.columnFilters = Object.assign({}, params.columnFilters)
        this.updateParams({ columnFilters: params.columnFilters, perPage: this.serverParams.perPage, page: 1 });
      }
    }, 300),
    editEncounterData(data, collapseID) {
      this.editEncounter = true;
      this.encounterId = collapseID
      this.showAddForm = false
      this.showEditForm = true
      this.visible = false
      window.scroll({ top: 0, behavior: 'smooth' });
    },
    handleEncounterForm() {
      this.closeEncounterForm();
      if (!this.showAddForm) {
        this.visible = true
        this.showAddForm = true
        this.showEditForm = false
      } else {
        this.visible = false
        this.showAddForm = false
        this.showEditForm = false
      }
    },
    closeEncounterForm() {
      this.visible = false
      this.encounterId = -1;
      this.showAddForm = false
      this.showEditForm = false
    },
    handleEncounterTemplateForm: function () {
      this.showAddTemplateForm = true;
    },
    closeEncounterTemplateForm: function () {
      this.showAddTemplateForm = false;
      this.encounter_template.name;
      this.encounter_template= {
        id: '',
        name: ''
      };
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
    }
  },
  computed: {
    getSpeciality: function () {
      return (salut) => {
        salut = JSON.parse(salut)
        if (salut !== undefined && salut.length > 0) {
          let specialties = '';
          salut.map(function (spec, index) {
            specialties += (salut.length === (index + 1) ? spec.label : spec.label + ', ');
            return spec;
          });
          return specialties;
        }
        return ' - ';
      }
    },
    login_id() {
      return this.$store.state.userDataModule.user.ID
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
  },
  watch: {
    getSidebarOpen(newValue, oldValue) {
      this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => { })
    },
    '$route': function (route) {
      this.updateParams();
      this.setWhichTemplate(route)
      this.patientEncounterList = this.defaultPatientEncountersData();
    },
    encounter_template(newValue, oldValue){
      if(this.showAddTemplateForm){
        this.formSubmitted= newValue.length != 0
      }
    }
  },
}
</script>

<style>
 @media (max-width: 576px){
  .vgt-compact td:before{
    padding-left: 0 !important;
  }
}
</style>
