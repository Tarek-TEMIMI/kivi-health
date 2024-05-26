<template>
  <b-row>
    <b-col sm="12">
      <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h3 class="mb-0">{{formTranslation.service.service_list}}</h3>
            </b-col>
            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('service_add')">
              <div class="d-flex justify-content-end">
                <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion,userData.pro_version)" class="float-right btn btn-sm btn-primary rtl-left"  @click="$refs.module_data_import.openModel = true" >
                    <i class="fas fa-file-import"></i>{{formTranslation.common.import_data}}
                </button>
                <button class="btn btn-sm btn-primary" @click="handleServiceDataForm({})">
                  <i v-if="!visible" class="fa fa-plus"></i> <i v-else class="fa fa-minus"></i>
                  {{ ( visible ? formTranslation.service.close_form_btn : formTranslation.service.add_service_btn ) }}
                </button>
              </div>
            </b-col>
          </b-row>
        </template>
        <module-data-import v-if="userData.addOns.kiviPro && kcCheckPermission('service_add') && kivicareCompareVersion(requireProVersion,userData.pro_version)" ref="module_data_import" @reloadList="getServiceData"
                  :required_data="[
                      {label:formTranslation.service.category,value:'category'},
                      {label:formTranslation.service.name,value:'name'},
                      {label:formTranslation.service.charges,value:'charges'},
                      {label:formTranslation.service.doctor+' ' +formTranslation.service.id,value:'doctor_id'},
                    ]" :module_name="formTranslation.common.service" module_type="service"></module-data-import>
        <b-collapse id="static-data-add-tab" :visible="showAddForm">
          <Create :serviceId="-1" @getServiceData="getServiceData" @closeForm="closeForm" v-if="showAddForm"></Create>
        </b-collapse>
        <b-collapse id="static-data-edit-tab" class="mt-2" :visible="showEditForm">
          <Create :serviceId="serviceId" @getServiceData="getServiceData" @closeForm="closeForm"
                  v-if="serviceId && showEditForm"></Create>
        </b-collapse>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <div class="page-loader-section" v-show="pageLoader">
              <loader-component-2></loader-component-2>
            </div>
            <div >
              <vue-good-table
                  ref="dataTable"
                  :columns="serviceList.column"
                  :rows="serviceList.data"
                  mode="remote"
                  :search-options="{
                    enabled: true,
                    placeholder:formTranslation.common.search_service_field_data_global_placeholder,
                  }"
                  @on-sort-change="onSortChange"
                  @on-column-filter="onColumnFilter"
                  @on-page-change="onPageChange"
                  @on-per-page-change="onPerPageChange"
                  :totalRows="totalRows"
                  :pagination-options="{
                     enabled: true,
                     mode: 'pages',
                  }"
                  @on-search="globalFilter"
                  @on-selected-rows-change="(selected_row) => { globalCheckboxApplyData.data = selected_row }" :select-options="{
                    enabled: true,
                    selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                    selectionInfoClass: 'text-primary bg-white',
                    selectionText: formTranslation.common.rows_selected,
                    clearSelectionText: formTranslation.common.clear,
                    disableSelectInfo: false, // disable the select info panel on top
                    selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
                  }" 
                  styleClass="vgt-table striped"
                  compactMode
              >
                <div slot="emptystate" class="text-danger text-center">
                  {{formTranslation.common.no_data_found}}
                </div>
                <template slot="column-filter" slot-scope="{ column, updateFilters }">
                  <div v-if="column.field === 'service_type'">
                    <select class="vgt-select" v-model="serverParams.columnFilters.service_type"  @change="(value) => updateFilters(column, serverParams.columnFilters.service_type)">
                      <option value="">{{ column.filterOptions.placeholder }}</option>
                      <option v-for="(value,index) in serviceCategory" :value="value.value" :key="index">{{value.text}}</option>
                    </select>
                  </div>
                  <div v-else-if="column.field === 'duration'">
                    <VueTimepicker v-model="serverParams.columnFilters.duration" id="duration" name="duration" :minute-interval="5" @change="(value) => updateFilters(column, serverParams.columnFilters.duration)"></VueTimepicker>
                  </div>
                </template>
                <div slot="table-actions">
                  <module-data-export :module_data="serviceList.data" :module_name="formTranslation.service.service_list"  module_type="services" v-if="kcCheckPermission('service_export')"> </module-data-export>
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
                <template slot="table-row" slot-scope="props">
                  <div v-if="props.column.field == 'name'" class="d-flex align-items-center">
                    <img v-if="props.row.image != '' && props.row.image != null" :src="props.row.image" alt="service_image"  height="45px" width="45px" style="border-radius:50%; margin-right:1rem;"/>
                    <b-avatar v-else variant="primary" :text="getInitials(props.formattedRow.name)" class="mr-3" size="45px"></b-avatar>
                    {{props.formattedRow.name}}
                    <!-- {{ props.row.profile_image != "" }} -->
                  </div>
                  <div v-else-if="props.column.field == 'status'" class="d-flex justify-content-start align-items-center">
                    <b-form-checkbox
                        v-if="kcCheckPermission('service_edit')"
                        v-model="props.row.status"
                        name="check-button"
                        switch
                        value="1"
                        size="lg"
                        unchecked-value="0"
                        :id="'status_change_' + props.row.id"
                        @change="changeModuleValueStatus({module_type:'doctor_service',id: props.row.id,value:props.row.status})"
                    >
                    </b-form-checkbox>
                    <div>
                      <span class="badge badge-success" v-if="props.row.status == '1'"> {{formTranslation.common.active}} </span>
                      <span class="badge badge-danger" v-else> {{formTranslation.common.inactive}} </span>
                    </div>
                  </div>
                  <div class="btn-group" v-else-if="props.column.field =='actions'">
                    <button type="button" v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_edit" v-if="kcCheckPermission('service_edit')"
                            @click="editServiceData(props.row, props.row.id)" class="btn btn-sm btn-outline-primary">
                      <i class="fa fa-pen-alt"></i>
                    </button>
                    <button v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt" v-if="kcCheckPermission('service_delete') && (!['telemed','Telemed'].includes(props.row.name))"
                            class="btn btn-outline-danger btn-sm"
                            @click="deleteServiceData(props)">
                    <i class="fa fa-trash"></i></button>
                  </div>
                  <div class="btn-group" v-else-if="props.column.field =='duration'">
                    {{formatDuration(props.row.duration)}}
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
    </b-col>
  </b-row>
</template>

<script>

import VueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';
import {post, get} from "../../config/request";
import Create from "../Service/Create";

export default {
  components: {Create, VueTimepicker},
  data: () => {
    return {
      visible: false,
      showEditForm: false,
      showAddForm: false,
      pageLoader: true,
      serviceList: {
        data:[],
        column:[]
      },
      sessionEdit: false,
      serviceId: -1,
      editSessionDataIndex: "",
      serverParams: {
        columnFilters: {
          service_type:'',
          duration:''
        },
        sort: [
          {
            field: '',
            type: ''
          }
        ],
        page: 1,
        perPage: 10,
        searchTerm:'',
        type:'list'
      },
      oldServerParams:{
        columnFilters:{

        },
        searchTerm:'',
        perPage:10
      },
      totalRows: 0,
      serviceCategory:[],
      globalCheckboxApplyData: {},
      globalCheckboxApplyDataActions: [

      ]
    }
  },
  mounted() {
    this.getServiceCategoryType();
    this.init();
  },
  methods: {
    // changeDurationHandler(event) {
    //   const duration = parseInt(event.data.HH) * 60 + parseInt(event.data.mm);
    //   this.serverParams.columnFilters.duration = duration.toString();
    // },
    init: function () {
      this.serviceList = this.defaultServiceList()
      this.getServiceData();
      this.globalCheckboxApplyData = this.defaultGlobalCheckboxApplyData()
      this.globalCheckboxApplyDataActions = this.defaultGlobalCheckboxApplyDataActions()
    },
    defaultServiceList: function () {
      return {
        column: [
          {
            field: 'id',
            label: this.formTranslation.common.id,
            width:'100px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.id,
              filterValue: '',
            }
          },
          {
            field: 'service_id',
            label: this.formTranslation.widget_setting.service_setting + ' '+ this.formTranslation.common.id,
            width:'120px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.widget_setting.service_setting+ ' '+ this.formTranslation.common.id,
              filterValue: '',
            }
          },
          {
            field: 'name',
            width:'150px',
            label: this.formTranslation.service.dt_lbl_name,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.service.dt_plh_name_fltr,
              filterValue: '',
            }
          },
          {
            field: 'clinic_name',
            width:'150px',
            label: this.formTranslation.patient_encounter.dt_lbl_clinic,
            filterOptions: {
              enabled: !(window.request_data.current_user_role === 'kiviCare_clinic_admin' || window.request_data.current_user_role === 'kiviCare_receptionist'),
              placeholder: this.formTranslation.patient_encounter.dt_plh_fltr_by_clinic,
              filterValue: '',
            }
          },
          {
            field: 'doctor_name',
            width:'150px',
            label: this.formTranslation.service.dt_lbl_doctor,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.service.dt_plh_fltr_by_doc,
              filterValue: '',
            }
          },
          {
            field: 'charges',
            width:'150px',
            label: this.formTranslation.service.dt_lbl_charges,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.service.dt_plh_fltr_by_price,
              filterValue: '',
            }
          },
          {
            field: 'duration',
            width:'150px',
            label: this.formTranslation.patient_encounter.duration,
            hidden:this.userData.addOns.kiviPro !== true,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.patient_encounter.duration,
              filterValue: '',
              // filterDropdownItems:[
              //   {value:5,text:'5min'},
              //   {value:10,text:'10min'},
              //   {value:15,text:'15min'},
              //   {value:20,text:'20min'},
              //   {value:25,text:'25min'},
              //   {value:30,text:'30min'},
              //   {value:35,text:'35min'},
              //   {value:40,text:'40min'},
              //   {value:45,text:'45min'},
              //   {value:50,text:'50min'},
              //   {value:55,text:'55min'},
              //   {value:60,text:'1hr'},
              //   {value:75,text:'1hr 15min'},
              //   {value:90,text:'1hr 30min'},
              //   {value:105,text:'1hr 45min'},
              //   {value:120,text:'2hr'},
              //   {value:150,text:'2hr 30min'}
              // ]
            }
          },
          {
            field: 'service_type',
            label: this.formTranslation.service.dt_lbl_category,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.service.dt_plh_name_fltr,
              filterDropdownItems:this.serviceCategory,
              filterValue: '',
            }
          },
          {
            field: 'status',
            label: this.formTranslation.service.dt_lbl_status,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterValue: '',
              filterDropdownItems: [
                { value: '1', text: this.formTranslation.common.active },
                { value: '0', text: this.formTranslation.common.inactive } ]
            },
          },
          {
            field: 'actions',
            sortable:false,
            label: this.formTranslation.service.dt_lbl_action
          }
        ],
        data: []
      }
    },
    getServiceData: function () {
      this.pageLoader = true;
      get('service_list', this.serverParams)
          .then((data) => {
            this.pageLoader = false;
            if (data.data.status !== undefined && data.data.status === true) {

              this.serviceList.data = [];
              this.serviceList.data = data.data.data
              this.totalRows = data.data.total_rows;
            } else {
              this.pageLoader = false;
              this.serviceList.data = [];
              this.totalRows = 0;
            }
          })
          .catch((error) => {
            this.pageLoader = false;
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },

    defaultGlobalCheckboxApplyData() {
      return {
        action_perform: 'delete',
        module: 'doctor_service',
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
          value: "delete",
          label: this.formTranslation.clinic_schedule.dt_lbl_dlt
        },
      ]
    },

    confirmDelete() {
      let content = '';
      if (this.globalCheckboxApplyData.action_perform === 'delete') {
        content = this.formTranslation.common.py_delete;
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
            this.getServiceData();
          } else {
            displayErrorMessage(data.data.message)
          }
        })
        .catch((error) => {
          this.pageLoader = true;
          console.log(error);
        })
    },
    
    updateParams: function(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getServiceData()
    },

    onPageChange(params) {
      this.updateParams({page: params.currentPage});
    },

    onPerPageChange(params) {
      if(this.oldServerParams.perPage === params.currentPerPage){
        return ;
      }
      this.oldServerParams.perPage = params.currentPerPage;
      this.updateParams({perPage: params.currentPerPage,page: params.currentPage});
    },

    onSortChange(params) {
      this.updateParams({
        sort: params,
      });
    },
    globalFilter:_.debounce(function(params) {

      if(this.oldServerParams.searchTerm === params.searchTerm){
        return;
      }
      this.oldServerParams.searchTerm = params.searchTerm;
      this.updateParams({searchTerm: params.searchTerm,perPage: this.serverParams.perPage,page: 1});
    },300),
    onColumnFilter:_.debounce(function(params) {
      var emptyValue =  true;
      var emptyValue2 = true;
      Object.values(params.columnFilters).map(function (value, index, array){
        if(value){
          emptyValue = false;
        }
      })
      Object.values(this.oldServerParams.columnFilters).map(function (value, index, array){
        if(value){
          emptyValue2 = false;
        }
      })
      if(!emptyValue || !emptyValue2){
        this.oldServerParams.columnFilters = Object.assign({}, params.columnFilters)
        this.updateParams({columnFilters:params.columnFilters,perPage: this.serverParams.perPage,page: 1});
      }
    },300),
    getServiceCategoryType () {
      let _this = this;
      get('get_static_data', {
        data_type: 'static_data_with_label',
        static_data_type: 'service_type'
      })
          .then((response) => {
            if (response.data.status !== undefined && response.data.status === true) {
              this.serviceCategory = [];
              if(response.data.data.length > 0) {
                let checkExists = false ;
                response.data.data.map(function(value,key){
                  if(value.id == 'system_service'){
                    checkExists = true;
                  }
                  _this.serviceCategory.push({"value": value.id, "text": value.label});
                })
                if(!checkExists){
                  this.serviceCategory.push({"value":'system_service',"text":'System Service'})
                }
              }
            } else {
              displayErrorMessage(response.data.message)
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error)
          })
    },
    deleteServiceData: function (data) {
      if (data.index !== undefined) {
        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure ,
          content: this.formTranslation.common.deleting_services,
          type: 'red',
          buttons: {
            ok: {
              text:this.formTranslation.common.yes,
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                get('service_delete', {
                  id: data.row.id
                })
                  .then((response) => {
                    if(this.getUserRole() === 'administrator'){
                      this.$store.dispatch("userDataModule/fetchUserData", {});
                    }
                    if (response.data.status !== undefined && response.data.status === true) {
                      this.serviceList.data.splice(data.index, 1);
                      displayMessage(response.data.message);
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
              text:this.formTranslation.common.cancel
            }
          }
        });
      }
    },
    editServiceData: function (data, collapseID) {
      this.serviceId = collapseID
      this.showAddForm = false
      this.showEditForm = true
      this.visible = false
    },
    handleServiceDataForm() {
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
    closeForm() {
      this.visible = false
      this.serviceId = -1;
      this.showAddForm = false
      this.showEditForm = false
    },
    formatDuration(duration){
      if(!duration){
        return '';
      }
      if(parseInt(duration) > 0 ){
        var hours = Math.floor(duration / 60);
        var minutes = duration % 60;
        minutes += 'min';
        if(hours > 0){
          return hours+ 'hr ' + minutes;
        }
        return minutes;
      }

      return duration;
    },
    getInitials(name) {
      if(name !== undefined && name !== '' && name !== null){
        const patient_name = name.split(" ");
        const initials = patient_name.map(patient_name => patient_name.charAt(0).toUpperCase());
        return initials.join("");
      }else{
        return ' - ';
      }
    }
  },
  computed: {
    servicesListExport() {
      return 'Services List - ' + moment().format('YYYY-MM-DD');
    },
    userData() {
      return this.$store.state.userDataModule.user;
    },
    // formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // }
  },
  watch: {}
}
</script>
