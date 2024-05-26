<template>
  <b-row>
    <b-col sm="12">
      <b-card class="p-0 shadow" body-class="p-0" header-tag="header" footer-tag="footer">
        <template v-slot:header>
          <b-row>
            <b-col sm="12" md="8" lg="8">
              <h2 class="mb-0">{{formTranslation.custom_field.custom_field_list}} <a v-if="request_status == 'off'" href="https://apps.iqonic.design/docs/product/kivicare/clinic-admin/settings/#custom-fileds" target="_blank"><i class="fa fa-question-circle"></i></a> </h2>
            </b-col>
            <b-col sm="12" md="4" lg="4" v-if="kcCheckPermission('custom_field_add')">
              <div class="d-flex justify-content-end">
                <button v-if="userData.addOns.kiviPro && kivicareCompareVersion(requireProVersion,userData.pro_version)" class="btn btn-sm btn-primary"  @click="$refs.module_data_import.openModel = true" >
                  <i class="fas fa-file-import"></i>{{formTranslation.common.import_data}}
                </button>
                <router-link 
                    class="btn btn-sm btn-primary"
                    :to="{ name: 'custom-field.create' }">
                  <i class="fa fa-plus"></i> {{formTranslation.custom_field.add_custom_field}}
                </router-link>
              </div>
            </b-col>
          </b-row>
        </template>
        <module-data-import v-if="userData.addOns.kiviPro && kcCheckPermission('custom_field_add') && kivicareCompareVersion(requireProVersion,userData.pro_version)" ref="module_data_import" @reloadList="getCustomFieldList"
            :required_data="[
            {label:formTranslation.common.module,value:'module'},
            {label:formTranslation.common.label,value:'label'},
            {label:formTranslation.common.input_type,value:'input_type'},
            {label:formTranslation.common.options,value:'options'},
          ]" :module_name="formTranslation.common.customField" module_type="customField"></module-data-import>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <div class="page-loader-section" v-show="pageLoader">
              <loader-component-2></loader-component-2>
            </div>
            <div id="customFieldPrint" >
              <div class="mb-0">
                <vue-good-table
                  ref="dataTable"
                  :columns="customFieldList.column"
                  :rows="customFieldList.data"
                  mode="remote"
                  :search-options="{
                    enabled: true,
                    placeholder:formTranslation.common.search_custom_field_data_global_placeholder,
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
                  styleClass="vgt-table striped"
                  compactMode
                >
                  <div slot="emptystate" class="text-danger text-center">
                    {{formTranslation.common.no_data_found}}
                  </div>
                  <div slot="table-actions">
                    <module-data-export :module_data="customFieldList.data" :module_name="formTranslation.custom_field.custom_field_list"  module_type="custom_field" v-if="kcCheckPermission('custom_field_export')"> </module-data-export>
                  </div>
                  <template slot="table-row" slot-scope="props">
                    <div v-if="props.column.field == 'fields'"> {{ props.row.fields | fields }}</div>
                    <div v-else-if="props.column.field == 'input_type'"> {{ props.row.fields | input_type }}</div>
                    <div v-else-if="props.column.field == 'status'" class="d-flex">
                      <b-form-checkbox
                          v-model="props.row.status"
                          v-if="kcCheckPermission('custom_field_edit')"
                          name="check-button"
                          switch
                          value="1"
                          size="lg"
                          unchecked-value="0"
                          :id="'status_change_' + props.row.id"
                          @change="changeModuleValueStatus({module_type:'custom_field',id: props.row.id,value:props.row.status})"
                      >
                      </b-form-checkbox>
                      <span class="badge badge-success" v-if="props.row.status == '1'"> {{formTranslation.common.active}} </span>
                      <span class="badge badge-danger" v-else> {{formTranslation.common.inactive}}  </span>
                    </div>
                    <div class="btn-group" v-else-if="props.column.field =='actions'">
                      <router-link 
                        v-b-tooltip.hover :title="formTranslation.common.edit" v-if="kcCheckPermission('custom_field_edit')"
                        class="btn btn-sm btn-outline-primary"
                        :to="{ name: 'custom-field.edit', params: { id: props.row.id } }">
                        <i class="fa fa-pen-alt"></i>
                      </router-link>
                      <button 
                        v-b-tooltip.hover :title="formTranslation.clinic_schedule.dt_lbl_dlt"
                        class="btn btn-outline-danger btn-sm"
                        v-if="kcCheckPermission('custom_field_delete')"
                        @click="deleteCustomFieldData(props.index + 1)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                    <div v-else>
                      {{ props.formattedRow[props.column.field] | typeFiled }}
                    </div>
                  </template>
                </vue-good-table>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>

import {post,get} from "../../config/request";

export default {
  data: () => {
    return {
      pageLoader: true,
      customFieldList: {
        column:[],
        data:[]
      },
      customFieldRequest: {},
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
        searchTerm:'',
      },
      oldServerParams:{
        columnFilters:{

        },
        searchTerm:'',
        perPage:10
      },
      totalRows: 0,
      moduleType:[
        {"value":"doctor_module","text":"Doctor module"},
        {"value":"patient_module","text":"Patient module"},
        {"value":"patient_encounter_module","text":"Patient encounter module"},
      ],
      request_status:'off',
      inputType:[
        { value: 'text', text: 'Text' },
        { value: 'number', text:'Number' }, 
        { value:'textarea', text:'Textarea' },
        { value:'file_upload', text:'File Upload' }, 
        { value:'select', text:'Select' }, 
        { value:'multiselect', text:'Multi select' }, 
        { value:'radio', text:'Radio' }, 
        { value:'checkbox', text:'Checkbox' },
        { value:'calendar', text:'Calendar' },
      ],
    }
  },
  mounted() {
    if(['patient','receptionist','doctor'].includes(this.getUserRole())) {
      this.$router.push({ name: "403"})
    }
    this.init();
    this.moduleType.unshift({"value":"","text":this.formTranslation.common.all})
    if(this.userData.addOns.kiviPro === true){
      this.moduleType.push({"value":"appointment_module","text":"Appointment module"})
    }
    this.getModule();
  },
  methods: {
    init: function () {
      this.customFieldList = this.defaultCustomFieldData();
      this.getCustomFieldList();
    },
    getCustomFieldList(){
      get('custom_field_list', this.serverParams)
          .then((data) => {
            this.pageLoader = false;
            if (data.data.status !== undefined && data.data.status === true) {
              this.customFieldList.data = data.data.data;
              this.totalRows = data.data.total;
            }else {
              this.customFieldList.data = data.data.data;
              this.totalRows = 0;
            }
          })
          .catch((error) => {
            console.log(error);
            displayErrorMessage(this.formTranslation.common.internal_server_error);
          })
    },
    updateParams:function(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      this.getCustomFieldList()
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
    defaultCustomFieldData: function () {
      return {
        data: [],
        column: [
          {
            field: 'id',
            label: this.formTranslation.common.id,
            width:'100px',
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.common.id,
              filterValue: ''
            }
          },
          {
            field: 'fields',
            label: this.formTranslation.custom_field.dt_lbl_field,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.custom_field.dt_plh_fltr_by_name,
              filterValue: '',
            }
          },
          {
            field: 'input_type',
            label: this.formTranslation.custom_field.input_type,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.custom_field.dt_plh_fltr_by_type,
              filterDropdownItems:this.inputType,
              filterValue: '',
            }
          },
          {
            field: 'module_type',
            label: this.formTranslation.custom_field.dt_lbl_type,
            filterOptions: {
              enabled: true,
              placeholder: this.formTranslation.custom_field.dt_plh_fltr_by_type,
              filterDropdownItems:this.moduleType,
              filterValue: ''
            }
          },
          {
            field: 'status',
            label: this.formTranslation.service.dt_lbl_status,
            filterOptions: {
              enabled: true, // enable filter for this column
              placeholder: this.formTranslation.static_data.dt_lbl_plh_sr_fltr_status,
              filterDropdownItems: [
                {value:"",text:this.formTranslation.common.all},
                { value: '1', text: this.formTranslation.common.active },
                { value: '0', text: this.formTranslation.common.inactive }  ]
            },
            html:true
          },
          {
            field: 'actions',
            sortable:false,
            label: this.formTranslation.custom_field.dt_lbl_action
          }
        ]
      }
    },
    deleteCustomFieldData: function (index) {
      if (this.customFieldList.data[index - 1] !== undefined) {

        $.confirm({
          title: this.formTranslation.clinic_schedule.dt_are_you_sure,
          content: this.formTranslation.common.py_delete_field,
          type: 'red',
          buttons: {
            ok: {
              text: "Yes",
              btnClass: 'btn-danger',
              keys: ['enter'],
              action: () => {
                get('custom_field_delete', {
                  id: this.customFieldList.data[index - 1].id
                })
                    .then((data) => {
                      if (data.data.status !== undefined && data.data.status === true) {
                        this.customFieldList.data.splice((index - 1), 1);
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
            cancel: () => {
            }
          }
        });
      }
    },
    getModule:function (){
      if(window.request_data.link_show_hide !== undefined && window.request_data.link_show_hide !== ''){
        this.request_status = window.request_data.link_show_hide;
      }
    }
  },
  computed: {
      customFieldListExport() {
        return 'Custom Field List - ' + moment().format('YYYY-MM-DD');
      },
    userData(){
      return this.$store.state.userDataModule.user;
    }
    // formTranslation: function () {
    //   return this.$store.state.staticDataModule.langTranslateData ;
    // }
  },
  filters: {
    fields: function (value) {
      let label = JSON.parse(value);
      let lableValue = label;
      if (label !== '' && label !== null) {
        if (label !== undefined && label['label'] !== undefined) {
          lableValue = label['label'];
          // lableValue = lableValue.replace(/_/gi, ' ');
        }
      }
      return lableValue;
    },
    input_type: function (value) {
      let type = JSON.parse(value);
      let typeValue = type;
      if (type !== '' && type !== null) {
        if (type !== undefined && type['type'] !== undefined) {
          typeValue = type['type'];
        }
      }
      return typeValue;
    },
    typeFiled: function (value) {
      let label = value;
      let lableValue = '';
      if (label !== '' && label !== null) {
        if (label !== undefined && label !== '') {
          lableValue = label;
          lableValue = lableValue.replace(/_/gi, ' ');
        }
      }
      return lableValue;
    }
  }
}
</script>
