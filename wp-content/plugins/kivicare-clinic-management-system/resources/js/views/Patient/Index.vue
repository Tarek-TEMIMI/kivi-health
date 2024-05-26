<template>
  <b-row>
    <b-col sm="12">
      <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row class="align-items-center">
            <b-col sm="6" md="8" lg="8">
              <h3 class="mb-0">{{ formTranslation.patient.patients_lists }}</h3>
            </b-col>
            <b-col sm="6" md="4" lg="4" v-if="kcCheckPermission('patient_add')">
              <div class="d-flex justify-content-end  align-items-center">
                <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion, userData.pro_version)"
                  class="btn btn-sm btn-primary" @click="$refs.module_data_import.openModel = true">
                  <i class="fas fa-file-import"></i>{{ formTranslation.common.import_data }}
                </button>
                <router-link class="btn btn-sm btn-primary" :to="{ name: 'patient.create' }">
                  <i class="fa fa-plus"></i> {{ formTranslation.patient.add_patient }}
                </router-link>
              </div>
            </b-col>
          </b-row>
        </template>
        <CustomForm :data="patientCustomFormData" :viewMode="patientCustomFormViewMode" :customFormModal="patientCustomFormModal" v-if="patientCustomFormModal" @closeModal="patientCustomFormModal=false"></CustomForm>
        <module-data-import
          v-if="userData.addOns.kiviPro && kcCheckPermission('patient_add') && kivicareCompareVersion(requireProVersion, userData.pro_version)"
          ref="module_data_import" @reloadList="getPatientList" :required_data="[
            { label: formTranslation.patient.first_name, value: 'first_name' },
            { label: formTranslation.patient.last_name, value: 'last_name' },
            { label: formTranslation.patient.email, value: 'email' },
            { label: formTranslation.common.country_calling_code, value: 'country_calling_code' },
            { label: formTranslation.common.country_code, value: 'country_code' },
            { label: formTranslation.patient.patient_contact, value: 'contact' },
            { label: formTranslation.patient.gender, value: 'gender' },
          ]" :module_name="formTranslation.common.patient" module_type="patient"></module-data-import>
        <div class="page-loader-section" v-show="pageLoader">
          <loader-component-2></loader-component-2>
        </div>
        <div id="printPatientData">
          <vue-good-table ref="dataTable" :columns="patientList.column" :rows="patientList.data" :search-options="{
            enabled: true,
            placeholder: formTranslation.common.search_patient_global_placeholder,
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
            }" compact-mode>

            <div slot="emptystate" class="text-danger text-center">
              {{ formTranslation.common.no_data_found }}
            </div>
            <div slot="table-actions">
              <module-data-export :module_data="patientList.data" :module_name="formTranslation.dashboard.patients"
                module_type="patient" v-if="kcCheckPermission('patient_export')"> </module-data-export>
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
            <template slot="loadingContent">
              <div>
                <span class="h2 font-weight-bold mb-0">
                  <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
                </span>
              </div>
            </template>
            <template slot="column-filter" slot-scope="{ column, updateFilters }">
              <div v-if="column.field === 'user_registered'" class="d-flex justify-content-center align-items-center">
                <input type="date" class="form-control-sm mr-1" style="border: #fff"
                  v-model="serverParams.columnFilters.user_registered" @onkeydown="() => { return false }"
                  @input="(value) => updateFilters(column, serverParams.columnFilters.user_registered)">
                <span @click="updateFilters(column, serverParams.columnFilters.user_registered = '')">X</span>
              </div>
            </template>
            <template slot="table-row" slot-scope="props">
              <div v-if="props.column.field == 'uid' && p_uid">
                {{ props.row.u_id }}
                <!-- {{ patientList.data[props.row.originalIndex].u_id }} -->
              </div>
              <div v-else-if="props.column.field == 'uid'">
                {{ props.row.ID }}
              </div>
              <div v-else-if="props.column.field == 'user_registered'">
                {{ props.row.user_registered }}
              </div>
              <div v-else-if="props.column.field == 'display_name'" class="d-flex align-items-center">
                <img v-if="props.row.profile_image != '' && props.row.profile_image != null"
                  :src="props.row.profile_image" alt="profile_image" height="45px" width="45px"
                  style="border-radius:50%; margin-right:1rem;" />
                <b-avatar v-else variant="primary" :text="getInitials(props.formattedRow.display_name)" class="mr-3" size="45px"></b-avatar>
                {{ props.formattedRow.display_name }}
              </div>
              <div v-else-if="props.column.field == 'user_status'" class="d-flex">
                <b-form-checkbox v-if="kcCheckPermission('patient_edit')" v-model="props.row.user_status"
                  name="check-button" switch value="0" size="lg" unchecked-value="1" :id="'status_change_' + props.row.ID"
                  @change="changeModuleValueStatus({ module_type: 'patients', id: props.row.ID, value: props.row.user_status })">
                </b-form-checkbox>
                <span class="badge badge-success" v-if="props.row.user_status == '0'"> {{ formTranslation.common.active }} </span>
                <span class="badge badge-danger" v-if="props.row.user_status == '1'"> {{ formTranslation.common.inactive }} </span>
              </div>
              <!-- {{ props.row.profile_image != "" }} -->
              <div class="btn-group" v-else-if="props.column.field == 'action'">
                <router-link v-b-tooltip.hover :title="formTranslation.common.edit"
                  v-if="kcCheckPermission('patient_edit')" class="btn btn-sm btn-outline-primary"
                  :to="{ name: 'patient.edit', params: { id: props.row.ID, pid: props.row.u_id } }">
                  <i class="fa fa-pen-alt"></i>
                </router-link>
                <router-link v-b-tooltip.hover :title="formTranslation.appointments.appointments"
                  v-if="kcCheckPermission('appointment_list')" class="btn btn-sm btn-outline-primary"
                  :to="{ name: 'patient-appointment-list', params: { patient_id: props.row.ID } }">
                  <i class="fas fa-calendar-week"></i>
                </router-link>
                <router-link v-b-tooltip.hover :title="formTranslation.patient_encounter.encounters"
                  v-if="kcCheckPermission('patient_encounter_list')" class="btn btn-sm btn-outline-primary"
                  :to="{ name: 'patient-encounter', params: { patient_id: props.row.ID } }">
                  <i class="fa fa-calendar-check"></i>
                </router-link>
                <router-link v-b-tooltip.hover :title="formTranslation.reports.reports"
                  :to="{ name: 'patient-medical-report_id', params: { patient_id: props.row.ID } }"
                  class="btn btn-sm btn-outline-primary"
                  v-if="userData.addOns.kiviPro == true && kcCheckPermission('patient_report')">
                  <i class="fa fa-file"></i>
                </router-link>
                <button v-b-tooltip.hover :title="formTranslation.receptionist.resend_credential"
                  :id="'resend_' + props.row.ID" v-if="kcCheckPermission('patient_edit')"
                  class="btn btn-outline-warning btn-sm" @click="resendRequest(props.row.ID)"> <i
                    class="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
                <router-link v-b-tooltip.hover :title="formTranslation.common.profile"
                  class="btn btn-sm btn-outline-primary" v-if="kcCheckPermission('patient_edit')"
                  :to="{ name: 'patient-profile-view', params: { id: props.row.ID } }">
                  <i class="fa fa-user"></i>
                </router-link>
                <button class="btn btn-sm btn-outline-primary" v-for="(custom_form_data,key) in props.row.custom_forms" :key="key" 
                    v-if="userData.addOns.kiviPro == true && customFormCondition(props.row,custom_form_data)" @click="customFormOpen(props.row,custom_form_data)"
                    v-b-tooltip.hover :title="custom_form_data.name && custom_form_data.name.text ? custom_form_data.name.text : '' " >
                    <i :class="(custom_form_data.name && custom_form_data.name.icon ? custom_form_data.name.icon : 'fas fa-book-medical')"></i>
                </button>
                <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                  v-if="kcCheckPermission('patient_delete')" class="btn btn-outline-danger btn-sm"
                  :id="'user_delete_' + props.index + 1" @click="deletePatientData(props.index + 1)"><i
                    class="fa fa-trash"></i></button>
              </div>
              <div v-else>
                {{ props.column.field == 'display_name' ? '' : props.formattedRow[props.column.field] }}
              </div>
            </template>
          </vue-good-table>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { post, get } from "../../config/request";
import CustomForm from "../CustomForm/Form.vue"
export default {
  components :{CustomForm},
  data: () => {
    return {
      pageLoader: true,
      patientList: {
        column: [],
        data: [],
      },
      totalRows: 0,
      clinic: [],
      filterClinic: [],
      p_uid: false,
      serverParams: {
        columnFilters: {

        },
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
      globalCheckboxApplyData: {},
      globalCheckboxApplyDataActions: [

      ],
      patientCustomFormData:{},
      patientCustomFormModal:false,
      patientCustomFormViewMode:false
    }
  },
  mounted() {
    this.init();
    // this.enabled_u_id = this.$route.params.pid != undefined ? this.$route.params.pid : ''
  },
  methods: {
    init: function () {
      this.getUniqueSetting();
      this.patientList = this.defaultPatientList(this.formTranslation);
      this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData()
      this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions()

      this.getPatientList();
      setTimeout(() => {
        this.clinic = this.clinics
        this.clinic.forEach(element => {
          this.filterClinic.push({ value: element.id, text: element.label })
        });
      }, 1000)
      this.getDynamicTranslation();
    },
    defaultPatientList: function () {
      return {
        column: [
          {
            field: 'uid',
            label: this.p_uid ? this.formTranslation.patient.unique_id : this.formTranslation.common.id,
            sortable: !this.p_uid,
            width: '100px',
            filterOptions: {
              enabled: true,
              placeholder: this.p_uid ? this.formTranslation.patient.unique_id : this.formTranslation.common.id,
              filterValue: '',
            }
          },
          {
            label: this.formTranslation.patient.dt_lbl_name,
            field: 'display_name',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient.dt_plh_name_filter,
              filterValue: '',
            }
          },
          {
            field: 'clinic_name',
            label: this.formTranslation.patient.clinic,
            sortable: false,
            filterOptions: {
              enabled: this.userData.addOns.kiviPro && ['administrator', 'doctor'].includes(this.getUserRole()),
              filterValue: '',
              filterDropdownItems: this.filterClinic
            }
          },
          {
            label: this.formTranslation.patient.dt_lbl_email,
            field: 'user_email',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient.dt_plh_email_fltr,
              filterValue: '',
            }
          },
          {
            label: this.formTranslation.patient.dt_lbl_mobile_number,
            field: 'mobile_number',
            sortable: false,
            width: '200px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient.dt_plh_mobile_fltr_number,
              filterValue: '',
            },
          },
          {
            label: this.formTranslation.patient.dt_lbl_registered,
            field: 'user_registered',
            filterOptions: {
              enabled: false,
              placeholder: this.formTranslation.patient.dt_plh_date,
              filterValue: '',
            },
          },
          {
            field: 'user_status',
            label: this.formTranslation.service.dt_lbl_status,
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterDropdownItems: [
                { value: '0', text: this.formTranslation.common.active },
                { value: '1', text: this.formTranslation.common.inactive }
              ],
              filterValue: '',
            },
            html: true
          },
          {
            label: this.formTranslation.patient.dt_lbl_action,
            field: 'action',
            sortable: false,
            html: true,
          }
        ],
        data: [],
      }
    },
    getPatientList: function () {
      get('patient_list', this.serverParams)
        .then((data) => {
          this.pageLoader = false;
          if (data.data.status !== undefined && data.data.status === true) {
            this.patientList.data = data.data.data;
            this.totalRows = data.data.total_rows;
          } else {
            this.patientList.data = [];
            this.totalRows = 0;
          }
        })
        .catch((error) => {
          this.pageLoader = false;
          console.log(error);
        })
    },
    defaultGlobalCheckboxApplyData() {
      return {
        action_perform: 'delete',
        module: 'patient',
        data: []
      }
    },
    defaultGlobalCheckboxApplyDataActions: function () {
      return [
        {
          value: "active",
          label: this.formTranslation.service.dt_active
        },
        {
          value: "inactive",
          label: this.formTranslation.service.dt_inactive
        },
        {
          value: "resend_credential",
          label: this.formTranslation.receptionist.resend_credential
        },
        {
          value: "delete",
          label: this.formTranslation.clinic_schedule.dt_lbl_dlt
        },
      ]
    },

    confirmDelete() {
      let content = '';
      if (this.globalCheckboxApplyData.action_perform === 'delete') {
        content = this.formTranslation.common.py_delete;
      } else if (this.globalCheckboxApplyData.action_perform === 'resend_credential') {
        content = this.formTranslation.common.py_resend_credential;
      } else if (this.globalCheckboxApplyData.action_perform === 'active' || this.globalCheckboxApplyData.action_perform === 'inactive') {
        content = this.formTranslation.common.py_status;
      }
      $.confirm({
        title: this.formTranslation.clinic_schedule.dt_are_you_sure,
        content: content,
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
            this.getPatientList();
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          this.pageLoader = true;
          console.log(error);
        })
    },
    deletePatientData: function (index) {
      if (this.patientList.data[index - 1] !== undefined) {
        let ele = $('#user_delete_' + index);
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.common.action_delete_appointment_patient,
          type: 'red',
          buttons: {
            ok: {
              text: this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                ele.prop('disabled', true);
                $(ele).find('i').removeClass('fa fa-trash')
                $(ele).find('i').addClass('fa fa-sync fa-spin')
                get('patient_delete', {
                  id: this.patientList.data[index - 1].ID
                })
                  .then((data) => {
                    ele.prop('disabled', false);
                    $(ele).find('i').removeClass('fa fa-sync fa-spin')
                    $(ele).find('i').addClass('fa fa-trash')
                    if (data.data.status !== undefined && data.data.status === true) {
                      this.patientList.data.splice((index - 1), 1);
                      displayMessage(data.data.message);
                    }
                  })
                  .catch((error) => {
                    ele.prop('disabled', false);
                    $(ele).find('i').removeClass('fa fa-sync fa-spin')
                    $(ele).find('i').addClass('fa fa-trash')
                    console.log(error);
                    displayErrorMessage(this.formTranslation.common.internal_server_error);
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
    resendRequest: function (id) {
      var element = $('#resend_' + id).find("i");
      element.removeClass('fa fa-paper-plane ')
      element.addClass("fa fa-spinner fa-spin");
      post('resend_credential', { id: id })
        .then((data) => {
          element.removeClass("fa fa-spinner fa-spin");
          element.addClass("fa fa-paper-plane")
          if (data.data.status !== undefined && data.data.status === true) {
            displayMessage(data.data.message)
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    getDynamicTranslation: function () {
      this.$store.state.staticDataModule.langTranslateData
    },
    getUniqueSetting: function () {
      if (this.userData.unquie_id_status !== undefined && this.userData.unquie_id_status == true) {
        this.p_uid = this.userData.unquie_id_status;
      } else {
        this.p_uid = false
      }
    },
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getPatientList()
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

    getInitials(name) {
      if(name !== undefined && name !== '' && name !== null){
        const patient_name = name.split(" ");
        const initials = patient_name.map(patient_name => patient_name.charAt(0).toUpperCase());
        return initials.join("");
      }else{
        return ' - ';
      }
    },
    customFormOpen(props,custom_form_data){
        this.patientCustomFormData = custom_form_data;
        this.patientCustomFormData.module_id = props.ID;
        this.patientCustomFormViewMode = false;
        this.patientCustomFormModal = true;
    },
    customFormCondition(props,custom_form_data){
      return props.custom_forms && props.custom_forms.length 
      &&  (custom_form_data.clinic_ids.length === 0 || custom_form_data.clinic_ids.some(value => props.clinic_id.includes(value)))
    }
  },
  computed: {
    patientListExport() {
      return 'Patient List - ' + moment().format('YYYY-MM-DD');
    },
    getSpeciality: function () {
      return (salut) => {
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
    userData() {
      return this.$store.state.userDataModule.user;
    },
    clinics() {
      return this.$store.state.clinic
    }
    // formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // }
  },
  watch: {}
}
</script>
<style>
#printPatientData .vgt-table thead th {
  vertical-align: middle;
}

@media (max-width: 576px){
  #printPatientData .vgt-compact td:before{
    width: 42%;
    padding-left: 0;
  }
}

</style>
